export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { postComment } from "@/utils/unipile/queries";
import { NextResponse } from "next/server";
import { qdrantSavePost } from "@/utils/qdrant/queries";
import { delCommentProposal } from "@/utils/supabase/queries";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, post_id, unipile_id, comment, post_text } = body;
  if (
    unipile_id &&
    (await qdrantSavePost(post_text, comment, unipile_id)).success
  ) {
    await delCommentProposal(id);
    postComment(post_id, comment, unipile_id);
  } else {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  return NextResponse.json({ received: true });
}
