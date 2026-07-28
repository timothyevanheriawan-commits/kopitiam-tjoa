import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * True only if the currently-authenticated user has a row in `staff`.
 * Being logged in to Supabase Auth is NOT sufficient by itself — see
 * supabase/schema.sql for the `staff` table and `is_staff()` RPC this
 * wraps. Always call this (or rely on the `is_staff()` RLS check) before
 * doing anything staff-only; never gate on `user` existing alone.
 */
export async function isStaff(
  supabase: SupabaseClient<Database>,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_staff");
  if (error) {
    // Fail closed — an error checking staff status must never be
    // treated as "yes, staff".
    return false;
  }
  return data === true;
}
