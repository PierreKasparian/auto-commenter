export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { postComment } from "@/utils/unipile/queries";
import { NextResponse } from "next/server";
import { qdrantSavePost } from "@/utils/qdrant/queries";
import { delCommentProposal } from "@/utils/supabase/queries";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.TRIG_TASK_KEY}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, post_id, unipile_id, comment, post_text } = body;
  console.log(id, post_id, unipile_id, comment, post_text )
  if (
    unipile_id &&
    (await qdrantSavePost(post_text, comment, unipile_id)).success
  ) {
    console.log('comment saving..')
    await delCommentProposal(id,supabase);
    console.log('comment deleted')
    postComment(post_id, comment, unipile_id);
    console.log('comment posted')
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  return NextResponse.json({ received: true });
}
