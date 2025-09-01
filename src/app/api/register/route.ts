import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface RegisterRequest {
  userId: string;
  name: string;
}

// POST /api/register
export async function POST(req: Request) {
  try {
    const body: RegisterRequest = await req.json();
    const { userId, name } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId は必須です" },
        { status: 400 }
      );
    }

    console.log("📩 Register API call:", { userId, name });

    // --- profile テーブルに INSERT ---
    const { error: profileError } = await supabaseAdmin
      .from("profile")
      .insert([
        {
          user_id: userId, // auth.users.id を参照
          name,            // Profile モデルに追加済み
          bio: "",
          typeResult: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error("❌ profile insert error:", profileError);
      return NextResponse.json(
        {
          error: "profile insert failed",
          details: profileError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "✅ Profile created!", userId, name },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ API unexpected error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }
    console.error("❌ API unexpected error (non-Error):", err);
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
