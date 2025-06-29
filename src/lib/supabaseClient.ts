import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // Recommended for SvelteKit
  },
  global: {
    headers: {
      'X-Client-Info': 'eventure'
    }
  }
});


export async function getAuthHeaders() {
  if (!browser) return {};
  const session = (await supabase.auth.getSession()).data.session;
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}
