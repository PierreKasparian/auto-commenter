export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

  const { data: keywords, error: keywordsError } = {
    data: { keywords: ["IA"] },
    error: null,
  }; //await supabase
  // .from("keywords")
  // .select("keywords")
  // .eq("unipile_id", account_id)
  // .single();

  if (keywordsError) {
    console.log(keywordsError);
  }
  if (!keywords) return;

  //1. il faut trouver un post. (que keywords pour le moment)-> fetch puis search via api
  const myHeaders = new Headers();
  myHeaders.append(
    "X-API-KEY",
    "1JEm4iqR.l2WOiZZ+iCFM00ttyLs4zNc8QCVXFgp6ZRkM/69L0OI="
  );
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const linkedInUrl = `https://www.linkedin.com/search/results/content/?datePosted="past-24h"&keywords=IA&origin=FACETED_SEARCH&sid=(p5&sortBy="relevance"`;

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
  console.log(posts);
  for (const post of posts.items) {
    console.log(post);
    if (Number(post.date.slice(0, -1)) <= 12 && post.text.split(' ').includes("IA")) {//faiblesse dans l'approche
      const {error}= await supabase
        .from("posts_comment")
        .insert({
          unipile_id: account_id,
          post_text: post.text,
          post_link:"youtube.com",
          comment_IA:"test"
        })
        if(error)console.log(error);
    }
  }

  //2. parcourir le script voir si on trouve le mot clé
  //3. il faut commenter

  return NextResponse.json({ ok: true });
}
