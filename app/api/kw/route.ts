export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Groq } from "groq-sdk";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const groq = new Groq();
async function generateComment(post: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Comment this post:\n" + post,
      },
    ],
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    temperature: 1,
    top_p: 1,
    stream: false,
    stop: null,
  });

  return chatCompletion.choices[0]?.message.content;
}

async function createComment(
  post: string,
  post_link: string,
  account_id: string
) {
  const comment = await generateComment(post);
  const { error } = await supabase.from("posts_comment").insert({
    unipile_id: account_id,
    post_text: post,
    post_link: post_link,
    comment_IA: comment,
  });
  if (error) console.log(error);
}
export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.TRIG_TASK_KEY}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const account_id = body.account_id;
  console.log("passé");

  const { data: keywords, error: keywordsError } = await supabase
    .from("keywords")
    .select("keywords")
    .eq("unipile_id", account_id)
    .single();

  if (keywordsError) {
    console.log(keywordsError);
  }
  if (!keywords) return;

  const myHeaders = new Headers();
  myHeaders.append(
    "X-API-KEY",
    "1JEm4iqR.l2WOiZZ+iCFM00ttyLs4zNc8QCVXFgp6ZRkM/69L0OI="
  );
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const linkedInUrl = `https://www.linkedin.com/search/results/content/?datePosted="past-24h"&keywords=${keywords.keywords.join("%20")}&origin=FACETED_SEARCH&sid=(p5&sortBy="relevance"`;

  const raw = JSON.stringify({
    api: "classic",
    category: "people",
    url: encodeURI(linkedInUrl),
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const posts = await fetch(
    `https://api12.unipile.com:14269/api/v1/linkedin/search?account_id=${account_id}`,
    requestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
  for (const post of posts.items) {
    if (Number(post.date.slice(0, -1)) <= 12) {
      console.log(post);
      //faiblesse dans l'approche
      console.log("dedans");
      createComment(post.text, post.share_url, account_id);
    }
  }

  return NextResponse.json({ ok: true });
}
