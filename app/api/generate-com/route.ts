export const maxDuration = 60;
export const dynamic = "force-dynamic";
import DetectLanguage from "detectlanguage";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { retrieveQdrantCom, vectorize } from "@/utils/qdrant/queries";
import { OpenAI } from "openai";
import { QdrantCom } from "@/types";
import { checkAccountConnected, languagesSupported } from "@/utils/helpers";
import { getAccountsNkw } from "@/utils/supabase/queries";
import { getSystemPrompt } from "./libs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateComment(
  post: string,
  unipile_id: string,
  profileDescription: string,
  languagePost: string
) {
  const fullLanguagePost = languagesSupported.find(
    (lang) => lang.value === languagePost
  )?.label as string;
  console.log("fullLanguagePost", fullLanguagePost);
  const exampleCom = (await retrieveQdrantCom({
    queryVector: await vectorize(post),
    limit: 5,
    unipile_id,
  })) as unknown as QdrantCom[];

  // Create properly typed messages
  const exampleMessages = exampleCom.map((comment) => [
    {
      role: "user" as const,
      content: comment.post,
    },
    {
      role: "assistant" as const,
      content: comment.comments,
    },
  ]).flat() as { role: 'user' | 'assistant'; content: string }[];

  const userMessage = {
    role: "user" as const,
    content: post
  } as { role: 'user'; content: string };

  // console.log([getSystemPrompt(fullLanguagePost, profileDescription), ...exampleMessages, userMessage]);
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [getSystemPrompt(fullLanguagePost, profileDescription), ...exampleMessages, userMessage] as {
      role: 'user' | 'assistant' | 'system';
      content: string;
    }[],
    temperature: 0.6,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
  });

  return response.choices[0]?.message.content?.replace("—", ", ");
}

async function createComment(
  post: string,
  post_link: string,
  account_id: string,
  author_name: string,
  post_id: string,
  profileDescription: string,
  languagePost: string
) {
  const comment = await generateComment(
    post,
    account_id,
    profileDescription,
    languagePost
  );
  const { error } = await supabase.from("comment_proposal").insert({
    unipile_id: account_id,
    post_text: post,
    post_link: post_link,
    comment_IA: comment,
    author_name: author_name,
    post_id: post_id,
  });
  if (error) return { error: error };
  return { error: null };
}

const detectlanguage = new DetectLanguage(process.env.DETECT_LANGUAGE_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  // console.log(body);
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.TRIG_TASK_KEY}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const account_id = body.account_id;
  // const { data: keywords, error: keywordsError } = await supabase
  //   .from("keywords")
  //   .select(
  //     "keywords, unipile_id(user_id,com_per_day_max, profile_description)"
  //   )
  //   .eq("unipile_id", account_id)
  //   .single();
  const data = await getAccountsNkw(account_id);
  console.log(data);
  // return
  if (!(data.keywords?.keywords) && !(data.accounts?.accounts)) return NextResponse.json({ error: "No keywords or accounts" }, { status: 401 });

  const isConnected = await checkAccountConnected(data.user_id,account_id);
  if (!isConnected) return NextResponse.json(
    { error: "Account not connected" },
    { status: 401 }
  );
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const linkedInUrl = `https://www.linkedin.com/search/results/content/?contentType="photos"&datePosted="past-24h"&keywords=${data.keywords?.keywords
    .join(" OR ")
    .split(" ")
    .join("%20")}&origin=FACETED_SEARCH&sid=(p5&sortBy="relevance"`;
  console.log(linkedInUrl);
  // return
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
  console.log(JSON.stringify(requestOptions));
  const posts = await fetch(
    `https://api13.unipile.com:14361/api/v1/linkedin/search?limit=50&account_id=${account_id}`,
    requestOptions as RequestInit
  )
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .catch((error) => console.error(error));

  //   //comment long
  // posts.items.sort((a: LinkedInPost, b: LinkedInPost) => {
  //   const textLengthA = a.text ? a.text.length : 0;
  //   const textLengthB = b.text ? b.text.length : 0;
  //   return textLengthB - textLengthA;
  // });
  // console.log(posts);
  // return Next/Response.json({ok:true});
  console.log("\n--------------------------------------\n\n" +data.com_per_day_max);
  let n_commments = 0;
  for (let i = 0; i < 2; i++) {
    let selectedLang;
    if (i == 0) {
      const { data } = await supabase
        .from("unipile_id")
        .select("langues")
        .eq("unipile_id", account_id);
      selectedLang = data?.[0]?.langues;
    } else {
      selectedLang = ["en"];
    }
    if (n_commments >=data.com_per_day_max) break;
    for (const post of posts.items) {
      const languagePost = await detectlanguage.detect(post.text);
      if (
        ((Number(post.date.slice(0, -1)) <= 12 &&
          post.date.slice(-1) === "h") ||
          post.date.slice(-1) === "m") &&
        n_commments < data.com_per_day_max &&
        post.text.length > 300 &&
        post.permissions.can_post_comments &&
        selectedLang.includes(languagePost[0].language)
      ) {
        //faiblesse dans l'approche
        const response = await createComment(
          post.text,
          post.share_url,
          account_id,
          post.author.name,
          post.social_id,
          data.profile_description,
          languagePost[0].language
        );
        if (!response.error) n_commments++;
        // console.log(response);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
