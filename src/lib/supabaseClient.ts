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
    url.hostname = url.hostname.replace(/xxxx\.supabase\.co$/i, ".supabase.co");
    url.pathname = url.pathname.replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/g, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/g, "");
  } catch {
    console.warn("VITE_SUPABASE_URL 형식이 올바르지 않습니다.", trimmed);
    return trimmed
      .replace(/xxxx\.supabase\.co/i, ".supabase.co")
      .replace(/\/rest\/v1\/?$/i, "")
      .replace(/\/+$/g, "");
  }
}

const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

if (rawSupabaseUrl && supabaseUrl && rawSupabaseUrl.trim() !== supabaseUrl) {
  console.warn("VITE_SUPABASE_URL을 Supabase project URL 형식으로 보정했습니다.");
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

if (!isSupabaseConfigured) {
  console.warn(SUPABASE_CONFIG_ERROR_MESSAGE);
}

function createSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  try {
    return createClient(supabaseUrl as string, supabasePublishableKey as string);
  } catch (error) {
    console.warn("Supabase client 생성에 실패했습니다.", error);
    return null;
  }
}

export const supabase: SupabaseClient | null = createSupabaseClient();

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(SUPABASE_CONFIG_ERROR_MESSAGE);
  }

  return supabase;
}
