# ProjectHub

Company project, branch, and department management with approval-gated communications.

## Start without using your computer's terminal (GitHub Codespaces)

1. Open this repository on GitHub: https://github.com/polarisbelgium/project-management
2. Select **Code** → **Codespaces** → **Create codespace on main**.
3. Wait for setup to finish. Codespaces installs dependencies and starts the web app automatically.
4. When port **3000** appears, open the forwarded app in your browser.

The app's demo dashboard can be viewed without configuring third-party credentials. Account login and live provider integrations require setup described below. Codespaces may require an eligible GitHub plan or organization permission.

## Optional local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Enable authentication and database

1. Create a Supabase project in your own account.
2. In its SQL Editor, run `supabase/migrations/0001_projecthub.sql`.
3. In **Project Settings → API**, copy the Project URL and anon/public key.
4. Set these in your deployment's environment variables (or `.env.local` for local development):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. In Supabase Authentication, enable email/password and configure the redirect URL to `http://localhost:3000/auth/callback` for local use.

Never post secrets in chat or commit them to GitHub. The service-role key, if later needed for a trusted server-only task, must never use a `NEXT_PUBLIC_` prefix. The current starter does not need it.

## Optional provider connections

- **Research:** set `TAVILY_API_KEY` as a server-side environment secret. Research queries run on the server and return source URLs and retrieval time.
- **Email sending:** set `RESEND_API_KEY` and `EMAIL_FROM` as server-side environment secrets, and verify the sender domain with Resend. A signed-in user must explicitly approve a pending draft before the server attempts to send it.
- **Application URL:** configure `NEXT_PUBLIC_APP_URL` to the URL where the app is running.

Without these provider keys, live research and email delivery are unavailable; the app must not pretend that those actions succeeded. Do not share API keys in chat, screenshots, or commits.

## Important limitations

- The authentication, database schema, research endpoint, and approval-gated email endpoint are foundations; dashboard/project/branch/department pages still use sample data and need database-backed CRUD before production.
- Email inbox reading/OAuth synchronization is not implemented. Sending through Resend does not provide an inbox.
- Configure organization membership, least-privilege access, privacy/retention, audit logging, backups, and consent/legal basis before storing real business or personal data.
- Run a production build and security review before deployment.
