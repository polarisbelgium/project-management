# ProjectHub

Company project, branch, and department management with approval-gated communications.

## Run locally
1. Install Node.js LTS and run `npm install`.
2. Create a Supabase project and configure Authentication (email/password; enable email confirmation).
3. Run `supabase/migrations/0001_projecthub.sql` in the Supabase SQL editor.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Optionally configure a Tavily key for sourced public web search and Resend credentials for outbound mail. Keep all secrets server-side; never put service-role/provider keys in `NEXT_PUBLIC_*` variables.
6. Run `npm run dev` and open http://localhost:3000.

## Security and integration notes
- Supabase Auth sessions are checked by middleware; the dashboard requires sign-in once configured. Email draft API routes also check the authenticated user.
- RLS is enabled in the starter schema. The organization/prospect schema is a foundation and the current sample dashboard data has not yet been migrated to database-backed CRUD.
- Research uses a server-side Tavily integration and returns source URLs plus retrieval timestamps. No results are faked when the provider is missing. Respect source and provider terms; verify findings.
- Sending uses the server-side Resend integration and requires explicit, authenticated approval of a pending draft. Approved text is sent and the status is persisted. Delivery credentials are never sent to the browser. Confirm recipients and content before approval.
- Client, employee, and prospect records may be personal data: configure authorization, retention, privacy notices, consent/legal basis, and audit/backup policies before production use.

## Current limitations
- Authentication must be configured by the operator in Supabase; email inbox reading/replies and OAuth inbox synchronization are not implemented.
- Dashboard/project/branch/department pages still use sample data; full multi-tenant database CRUD is next.
