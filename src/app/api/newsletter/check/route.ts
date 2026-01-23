import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ subscribed: false });
    }

    // If Supabase is not configured, check localStorage hint
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ subscribed: false });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("subscribed")
      .eq("email", email.toLowerCase())
      .single();

    return NextResponse.json({
      subscribed: data?.subscribed === true,
    });
  } catch {
    return NextResponse.json({ subscribed: false });
  }
}
