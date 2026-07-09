import { createClient } from "@/lib/supabase/server";
import { DEFAULT_HOURS } from "@/lib/constants";
import type { BusinessHours } from "@/types/domain";

export async function getBusinessHours(): Promise<{
  hours: BusinessHours;
  manualOverride: boolean | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_settings")
    .select("hours, manual_open_override")
    .single();

  if (error || !data) {
    return { hours: DEFAULT_HOURS, manualOverride: null };
  }

  return {
    hours: data.hours as unknown as BusinessHours,
    manualOverride: data.manual_open_override,
  };
}
