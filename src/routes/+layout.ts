import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from "$env/static/public";
import { createBrowserClient, isBrowser, parseCookieHeader } from "@supabase/ssr";
import type { Load } from "@sveltejs/kit";

interface PageData {
    supabase: any;
    session: any | null;
}

export const ssr = false;
export const load: Load = async (event) => {
    event.depends('supabase:auth');
    
    interface CookieConfig {
        get(key: string): string | null;
        set(key: string, value: string): void;
        remove(key: string): void;
    }

    interface SupabaseConfig {
        global: {
            fetch: typeof fetch;
        };
        cookies: CookieConfig;
    }

    const supabase = createBrowserClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            global: { fetch: event.fetch },
            cookies: {
                get(key: string): string | null {
                    if (!isBrowser) return event.data?.session ? JSON.stringify(event.data.session) : null;
                    const cookie = parseCookieHeader(document.cookie);
                    return cookie?.find(c => c.name === key)?.value ?? null;
                },
                set(key: string, value: string): void {
                    document.cookie = `${key}=${value}; path=/`;
                },
                remove(key: string): void {
                    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                }
            }
        } satisfies SupabaseConfig
    );

    try {
        const { data: { session } } = await supabase.auth.getSession();
        return { supabase, session };
    } catch (error) {
        console.error('Session error:', error);
        return { supabase, session: null };
    }
};