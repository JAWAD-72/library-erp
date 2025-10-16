import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://shramakysrnfdkwpgdgx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocmFtYWt5c3JuZmRrd3BnZGd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyNDk4OTAsImV4cCI6MjA3NTgyNTg5MH0.EJxszZ_JKlHxtXH9KlK_kTJwDt1QK3iw40itz55e-Dc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
