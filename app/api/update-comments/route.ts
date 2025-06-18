export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getPostFromId,
} from "@/utils/unipile/queries";
import { qdrantSavePost } from "@/utils/qdrant/queries";
import { checkAccountConnected } from "@/utils/helpers";

export async function POST(req: Request) {
  // console.log(process.env.N8N_AUTH)
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { user_id,account_id,comments,profile_name } = body;
  const isConnected = await checkAccountConnected(user_id,account_id);
  if (user_id=="69ee9830-91ca-4a10-9495-4eefa612ba86")  return NextResponse.json({ ok: true });
  if (!isConnected) return NextResponse.json(
    { error: "Account not connected" },
    { status: 401 }
  );
  for (const comment of comments.items) {
    if (comment.text.length > 10 && comment.author === profile_name) {
      await new Promise((resolve) => setTimeout(resolve, 1)); //ids are time generated
      const post = await getPostFromId(comment.post_urn, account_id);
      await qdrantSavePost(post.text, comment.text, account_id);
    }
  }
  return NextResponse.json({ ok: true });
}