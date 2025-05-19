export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  // console.log(process.env.N8N_AUTH)
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const myHeaders = new Headers();
  myHeaders.append(
    "X-API-KEY",
    "1JEm4iqR.l2WOiZZ+iCFM00ttyLs4zNc8QCVXFgp6ZRkM/69L0OI="
  );
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const accounts = await fetch(
    "https://api12.unipile.com:14269/api/v1/accounts",
    requestOptions as RequestInit
  )
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result.items;
    })
    .catch((error) => {
      console.log(error);
      return console.error(error);
    });

  console.log(accounts);
  for (const account of accounts) {
    const randomHour = Math.floor(Math.random() * 11) + 8; // 8 to 18
    const randomMinute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, 15, ..., 55
    const today = new Date();
    today.setHours(randomHour, randomMinute, 0, 0);
    console.log(today);
    // const res = await fetch(
    //   "http://localhost:5678/webhook-test/9f69c248-04f1-4057-90de-d8cd6d0b0c94",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": `${process.env.N8N_AUTH}`,
    //     },
    //     body: JSON.stringify({
    //       account_id: account.id,
    //       date: today,
    //     }),
    //   }
    // );
    const { data, error } = await supabase.from("comment-time").insert([
      {
        unipile_id: account.id,
        comment_time: today.toISOString(),
      },
    ]);

    if (error) {
      console.error("Error inserting into Supabase:", error);
    } else {
      console.log("Successfully inserted task:", data);
    }
  }
  return NextResponse.json({ ok: true });
}
