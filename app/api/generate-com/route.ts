export const maxDuration = 60;
export const dynamic = "force-dynamic";
import DetectLanguage from 'detectlanguage';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { retrieveQdrantCom, vectorize } from "@/utils/qdrant/queries";
import { OpenAI } from "openai";
import { ExampleComment } from "@/types";
// import { LinkedInPost } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateComment(post: string, unipile_id: string,profileDescription : string) {
  const exampleCom = (await retrieveQdrantCom({
    queryVector: await vectorize(post),
    limit: 5,
    unipile_id,
  })) as string[];

  const exampleMessages: ExampleComment[] = exampleCom.map((comment) => ({
    role: "assistant" as const,
    content: comment,
  }));
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `You are a LinkedIn assistant that writes short, natural-sounding comments.
  
# GOAL
- Write a warm, authentic LinkedIn comment in response to a given post.
- The comment **must be written in the same language as the post**, no matter what language the user's profile or examples are in.

# RULES
- Detect the language of the LinkedIn post and generate the comment in that language, whether it’s English, French, Spanish, etc.
- Keep the tone authentic and conversational: avoid overly formal or robotic language.
- DO NOT default to the user's profile language. ALWAYS match the post's language.
- DO NOT USE hyphens as separator, use everyday punctuation (periods, commas) instead.

# STYLE
- Max 1–2 sentences.
- Human tone, like a thoughtful colleague or peer.
- No clichés, no generic phrases, no emoji overload.

# CONTEXT
You must take inspiration for the tone from the user’s profile description and comment examples—but always match the language of the post.`,
      },
      {
        role: "system",
        content: `# IMPORTANT
  If the post is in English, reply in English.
  If the post is in French, reply in French.
  If the post is in Spanish, reply in Spanish.
  Ignore the language of the profile or the examples—always follow the post's language.`,
      },
      ...exampleMessages, // keep these only if you control them per language
      {
        role: "user",
        content: `### LinkedIn Profile Description:
  ${profileDescription}
  
  ### LinkedIn Post:
  "${post}"`,
      },
    ],
    temperature: 1,
    max_completion_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false,
  });
  

  return response.choices[0]?.message.content;
}

async function createComment(
  post: string,
  post_link: string,
  account_id: string,
  author_name: string,
  post_id: string,
  profileDescription:string
) {
  const comment = await generateComment(post, account_id,profileDescription);
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

async function isLanguageInList(text: string,selectedLanguages:string[]):Promise<boolean> {
  const result = await detectlanguage.detect(text);
  console.log('language detected')
  console.log("is in list : ",(selectedLanguages.includes(result[0].language)))
  return selectedLanguages.includes(result[0].language);
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

  const { data: keywords, error: keywordsError } = await supabase
    .from("keywords")
    .select("keywords, unipile_id(com_per_day_max, profile_description)")
    .eq("unipile_id", account_id)
    .single();

  console.log(keywords);
  if (keywordsError) {
    console.log("kw err");
    console.log(keywordsError);
  }
  if (!keywords) return;

  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
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
  console.log(JSON.stringify(requestOptions));
  const posts = await fetch(
    `https://api10.unipile.com:14079/api/v1/linkedin/search?limit=50&account_id=${account_id}`,
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
  console.log(posts);
  // return Next/Response.json({ok:true});
  console.log(
    "\n--------------------------------------\n\n" +
      (
        keywords.unipile_id as unknown as {
          com_per_day_max: number;
        }
      ).com_per_day_max
  );
  let n_commments = 0;
for (let i=0;i<2;i++){
  let selectedLang;
  if (i==0){
  const {data } = await supabase.from('unipile_id').select('langues').eq('unipile_id', account_id);
  selectedLang = data?.[0]?.langues;
  }else{
    selectedLang = ["en"];
  }
  if (n_commments >= Number(
    (
      keywords.unipile_id as unknown as {
        com_per_day_max: number;
      }
    ).com_per_day_max
  )) break;
    for (const post of posts.items) {
      if (
        ((Number(post.date.slice(0, -1)) <= 12 && post.date.slice(-1) === "h") ||
          post.date.slice(-1) === "m") &&
        n_commments <
          Number(
            (
              keywords.unipile_id as unknown as {
                com_per_day_max: number;
              }
            ).com_per_day_max
          ) &&
        post.text.length > 100 &&
        post.permissions.can_post_comments
        //  && keywords.keywords.some((el: string) =>
        //   post.text.split(/[\s.,;!?]+/).includes(el)
        // )
        && (await isLanguageInList(post.text,selectedLang))
      ) {
        //faiblesse dans l'approche
        const response = await createComment(
          post.text,
          post.share_url,
          account_id,
          post.author.name,
          post.social_id,
          (keywords.unipile_id as unknown as { profile_description: string }).profile_description
        );
        if (!response.error) n_commments++;
        console.log(response);
      }
    }
}

  return NextResponse.json({ ok: true });
}
