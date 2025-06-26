import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export const maxDuration = 60;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { text } = await request.json();

  if (
    request.headers.get("Authorization") !==
    `Bearer ${process.env.TRIG_TASK_KEY}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: [
          {
            text: `Summarize this linkedin post. 
## OUTPUT
- Use the same language as the post
- Use 3 key points`,
            type: "text",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            text: text,
            type: "text",
          },
        ],
      },
    ],
    stream: false,
  });
  console.log(response.choices[0].message.content);
  const data = response.choices[0].message.content;
  return NextResponse.json(data);
}
