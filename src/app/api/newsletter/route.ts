import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // If Supabase is not configured, just return success (for demo)
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Newsletter signup (Supabase not configured):", email);
      return NextResponse.json({
        success: true,
        message: "Thank you for subscribing!",
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, subscribed")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed!",
          alreadySubscribed: true,
        });
      } else {
        // Re-subscribe
        await supabase
          .from("newsletter_subscribers")
          .update({ subscribed: true, updated_at: new Date().toISOString() })
          .eq("id", existing.id);

        return NextResponse.json({
          success: true,
          message: "Welcome back! You're now re-subscribed.",
        });
      }
    }

    // New subscriber
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      user_id: userId || null,
      subscribed: true,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Newsletter subscription error:", error);
      // If table doesn't exist, still return success
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          message: "Thank you for subscribing!",
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! Check your inbox for updates.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
