import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies(); // <-- await here
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. Perform the server-side sign out
  const { error } = await supabase.auth.signOut();

  // 2. Explicitly delete the cookies using the store's delete method
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  cookieStore.delete("sb-auth-token");

  if (error) {
    console.error("Server Logout Error:", error);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
