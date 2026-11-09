# Project Management MVP

A company-wide project, branch, and department management platform with approval-gated AI assistance.

## Current MVP
- Company dashboard and project lifecycle tracking
- Branch and department overview pages
- Prospect contact list for clients and investors
- Email workspace UI for reviewing sample messages and agent-prepared reply drafts
- Explicit approval queue for reply drafts; sending is disabled in this demo

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Important demo limitations
- Prospects and email drafts are held in browser memory/local storage, not a shared database.
- The email workspace uses sample messages. It is not connected to an inbox and does not send email.
- To enable real email safely, add authenticated server-side provider integration, secure credential storage, audit logging, and a server-enforced approval check. Never expose provider credentials in client-side code.
- Review privacy, consent, and applicable email laws before contacting prospects.
