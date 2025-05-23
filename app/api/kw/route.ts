import { NextResponse } from "next/server";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { Groq } from "groq-sdk";
// import { LinkedInPost } from "@/types";

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

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.TRIG_TASK_KEY}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const account_id = body.account_id;

  const { data: keywords, error: keywordsError } = await supabase
    .from("keywords")
    .select("keywords, unipile_id(com_per_day_max)")
    .eq("unipile_id", account_id)
    .single();

  console.log(keywords);
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

  const linkedInUrl = `https://www.linkedin.com/search/results/content/?contentType="photos"&datePosted="past-24h"&keywords=${keywords.keywords
    .join(" OR ")
    .split(" ")
    .join("%20")}&origin=FACETED_SEARCH&sid=(p5&sortBy="relevance"`;
  console.log(linkedInUrl);
  const raw = JSON.stringify({
    api: "classic",
    category: "people",
    url: linkedInUrl,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const posts = await fetch(
    `https://api12.unipile.com:14269/api/v1/linkedin/search?limit=50&account_id=${account_id}`,
    requestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));

  //   //comment long
  // posts.items.sort((a: LinkedInPost, b: LinkedInPost) => {
  //   const textLengthA = a.text ? a.text.length : 0;
  //   const textLengthB = b.text ? b.text.length : 0;
  //   return textLengthB - textLengthA;
  // });
  console.log(posts);
  console.log(
    "\n--------------------------------------\n\n" +
      (
        keywords.unipile_id as unknown as {
          com_per_day_max: any;
        }
      ).com_per_day_max
  );
  let n_commments = 0;
  for (const post of posts.items) {
    if (
      (Number(post.date.slice(0, -1)) <= 12 || post.date.slice(-1) === "m") &&
      n_commments <
        Number(
          (
            keywords.unipile_id as unknown as {
              com_per_day_max: any;
            }
          ).com_per_day_max &&
            post.text.length > 100 &&
            post.permissions.can_post_comments
        )
      //  && keywords.keywords.some((el: string) =>
      //   post.text.split(/[\s.,;!?]+/).includes(el)
      // )
    ) {
      //faiblesse dans l'approche
      const response = await createComment(
        post.text,
        post.share_url,
        account_id
      );
      // if (response)
      n_commments++;
    }
  }

  return NextResponse.json({ ok: true });
}
