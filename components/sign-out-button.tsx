'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.assign('/login');
    } finally { setBusy(false); }
  }
  return <button className="ghost-btn signout-button" onClick={signOut} disabled={busy}>Sign out</button>;
}
