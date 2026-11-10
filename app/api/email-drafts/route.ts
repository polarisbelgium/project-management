import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const to = typeof body?.to === 'string' ? body.to.trim().toLowerCase() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim().slice(0, 200) : '';
  const text = typeof body?.text === 'string' ? body.text.trim().slice(0, 10000) : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !subject || !text) return NextResponse.json({ error: 'Valid recipient, subject, and message are required.' }, { status: 400 });
  const { data, error } = await supabase.from('email_drafts').insert({ owner_id: user.id, recipient: to, subject, body: text, status: 'pending' }).select('id,status').single();
  if (error) return NextResponse.json({ error: 'Could not save draft. Apply the database migration and verify your access policies.' }, { status: 500 });
  return NextResponse.json({ draft: data }, { status: 201 });
}
