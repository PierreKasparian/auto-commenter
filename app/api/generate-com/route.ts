export const maxDuration = 60;
export const dynamic = "force-dynamic";
import DetectLanguage from "detectlanguage";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { retrieveQdrantCom, vectorize } from "@/utils/qdrant/queries";
import { OpenAI } from "openai";
import { ExampleComment } from "@/types";
import { isUnipileAccountConnected, languagesSupported } from "@/utils/helpers";
import { sendMail } from "@/utils/mailer/queries";

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
    limit: 7,
    unipile_id,
  })) as string[];

  const exampleMessages: ExampleComment[] = exampleCom.map((comment) => ({
    role: "assistant" as const,
    content: comment,
  }));
  console.log("exampleMessages");
  console.log(exampleMessages);
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `**Instruction:**  
Write a LinkedIn comment that sounds natural, warm, and in line with the tone of the original post. Use the user's profile description and example comments as inspiration.

**Important:**  
Match the tone of the example comments exactly. Your output must feel like it was written by the same person who wrote the examples — same energy, same vocabulary, same rhythm.

### Guidelines

1. Carefully read the LinkedIn post to understand its key themes (e.g., collaboration, innovation, milestones, mindset).
2. Pay close attention to the tone, style, and voice of the example comments. You must replicate that tone to blend in naturally.
3. Write a short, conversational LinkedIn comment in ${fullLanguagePost}.
4. Speak in the first person, as if you're genuinely reacting or contributing.
5. Avoid any robotic or generic phrasing.

### Output Format

- A single LinkedIn comment (1–2 sentences max).
- Warm, personal, friendly — never formal or overdone.
- Use normal punctuation (periods, commas), no double hyphens or ellipses.
- Avoid cliché phrases, emojis, or patterns that feel AI-generated.
- Your goal is to sound exactly like a real human who’s part of the conversation.`,
      },
      ...exampleMessages, // keep these only if you control them per language
      {
        role: "user",
        content: `### My LinkedIn account description:
${profileDescription}
  
## Post to Comment On (IN ${fullLanguagePost.toUpperCase()}):
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

  return response.choices[0]?.message.content?.replace("—", ",");
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

  if (!(await isUnipileAccountConnected(account_id))) {
    console.log("Account not connected");
    await sendMail(
      "ia.school.app@gmail.com",
      "Auto commenter account problem",
      `Hey, 
There was a problem accessing to your Linkedin account to generate new comments. Please connect to https://auto-commenter.vercel.app/dashboard to fix the issue.

Best regards,
Pierre`
    );
    return NextResponse.json(
      { error: "Account not connected" },
      { status: 401 }
    );
  }

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
    `https://api1.unipile.com:13115/api/v1/linkedin/search?limit=50&account_id=${account_id}`,
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
  console.log(
    "\n--------------------------------------\n\n" +
      (
        keywords.unipile_id as unknown as {
          com_per_day_max: number;
        }
      ).com_per_day_max
  );
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
    if (
      n_commments >=
      Number(
        (
          keywords.unipile_id as unknown as {
            com_per_day_max: number;
          }
        ).com_per_day_max
      )
    )
      break;
    for (const post of posts.items) {
      const languagePost = await detectlanguage.detect(post.text);
      if (
        ((Number(post.date.slice(0, -1)) <= 12 &&
          post.date.slice(-1) === "h") ||
          post.date.slice(-1) === "m") &&
        n_commments <
          Number(
            (
              keywords.unipile_id as unknown as {
                com_per_day_max: number;
              }
            ).com_per_day_max
          ) &&
        post.text.length > 300 &&
        post.permissions.can_post_comments &&
        //  && keywords.keywords.some((el: string) =>
        //   post.text.split(/[\s.,;!?]+/).includes(el)
        // )
        selectedLang.includes(languagePost[0].language)
      ) {
        //faiblesse dans l'approche
        const response = await createComment(
          post.text,
          post.share_url,
          account_id,
          post.author.name,
          post.social_id,
          (keywords.unipile_id as unknown as { profile_description: string })
            .profile_description,
          languagePost[0].language
        );
        if (!response.error) n_commments++;
        // console.log(response);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
