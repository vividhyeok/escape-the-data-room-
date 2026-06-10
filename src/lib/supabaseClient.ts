import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const env = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env ?? {};

const rawSupabaseUrl = env.VITE_SUPABASE_URL;
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const SUPABASE_CONFIG_ERROR_MESSAGE = "Supabase 환경변수를 확인해 주세요.";

function normalizeSupabaseUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  try {
    const url = new URL(trimmed);
    url.pathname = url.pathname.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/g, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/g, "");
  } catch {
    console.warn("VITE_SUPABASE_URL 형식이 올바르지 않습니다.", trimmed);
    return trimmed.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/g, "");
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

if (rawSupabaseUrl && supabaseUrl && rawSupabaseUrl.trim() !== supabaseUrl) {
  console.warn("VITE_SUPABASE_URL에서 /rest/v1 경로를 제거하고 Supabase project URL로 보정했습니다.");
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured) {
  console.warn(SUPABASE_CONFIG_ERROR_MESSAGE);
}

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabasePublishableKey as string)
  : null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(SUPABASE_CONFIG_ERROR_MESSAGE);
  }

  return supabase;
}
