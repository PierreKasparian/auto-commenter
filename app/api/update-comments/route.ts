export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getPostFromId,
} from "@/utils/unipile/queries";
import { qdrantSavePost } from "@/utils/qdrant/queries";

export async function POST(req: Request) {
  // console.log(process.env.N8N_AUTH)
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { account_id,comments } = body;
  for (const comment of comments.items) {
    if (comment.text.length > 10) {
      await new Promise((resolve) => setTimeout(resolve, 1)); //ids are time generated
      const post = await getPostFromId(comment.post_urn, account_id);
      await qdrantSavePost(post.text, comment.text, account_id);
    }
  }
}