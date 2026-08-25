import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ffauweryjzpnskdaqcyp.supabase.co';

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_bLkboY3aqcA-LRqg7VROgw_IjxTh84f';

const schema = (process.env.SUPABASE_SCHEMA || 'project_changehub') as any;

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      db: {
        schema: schema,
      },
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}

export const supabase = getSupabaseClient();
