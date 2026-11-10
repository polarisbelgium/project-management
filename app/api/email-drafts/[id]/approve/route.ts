import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return NextResponse.json({ error: 'Email delivery is not configured. Draft remains pending.' }, { status: 503 });

  // Conditional status transition prevents repeat approvals/sends; RLS restricts updates to this user's draft.
  const { data: draft, error } = await supabase.from('email_drafts').update({ status: 'sending', approved_by: user.id, approved_at: new Date().toISOString() }).eq('id', params.id).eq('owner_id', user.id).eq('status', 'pending').select('id,recipient,subject,body').maybeSingle();
  if (error || !draft) return NextResponse.json({ error: 'Draft not found, already processed, or not awaiting your approval.' }, { status: 409 });

  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [draft.recipient], subject: draft.subject, text: draft.body }), cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!response.ok) {
      await supabase.from('email_drafts').update({ status: 'failed' }).eq('id', draft.id).eq('owner_id', user.id).eq('status', 'sending');
      return NextResponse.json({ error: 'Email provider rejected the message. Draft marked failed; review before retrying.' }, { status: 502 });
    }
    const providerResult = await response.json();
    await supabase.from('email_drafts').update({ status: 'sent', provider_message_id: typeof providerResult.id === 'string' ? providerResult.id : null, sent_at: new Date().toISOString() }).eq('id', draft.id).eq('owner_id', user.id).eq('status', 'sending');
    return NextResponse.json({ status: 'sent' });
  } catch {
    await supabase.from('email_drafts').update({ status: 'failed' }).eq('id', draft.id).eq('owner_id', user.id).eq('status', 'sending');
    return NextResponse.json({ error: 'Email provider unavailable. Draft marked failed; verify delivery status before retrying.' }, { status: 502 });
  }
}
