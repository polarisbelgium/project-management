import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const query = typeof body?.query === 'string' ? body.query.trim().slice(0, 300) : '';
  if (query.length < 3) return NextResponse.json({ error: 'Enter at least 3 characters to search.' }, { status: 400 });
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Research provider is not configured. Add TAVILY_API_KEY on the server.' }, { status: 503 });

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', max_results: 8, include_answer: false }),
      cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return NextResponse.json({ error: 'Research provider request failed.' }, { status: 502 });
    const payload = await response.json();
    const results = Array.isArray(payload.results) ? payload.results.slice(0, 8).map((item: any) => ({
      title: typeof item.title === 'string' ? item.title : 'Untitled result',
      url: typeof item.url === 'string' && /^https?:\/\//i.test(item.url) ? item.url : null,
      snippet: typeof item.content === 'string' ? item.content.slice(0, 800) : '',
      score: typeof item.score === 'number' ? item.score : null,
    })).filter((item: { url: string | null }) => item.url) : [];
    return NextResponse.json({ results, retrievedAt: new Date().toISOString(), provider: 'Tavily' });
  } catch {
    return NextResponse.json({ error: 'Research service is temporarily unavailable.' }, { status: 502 });
  }
}
