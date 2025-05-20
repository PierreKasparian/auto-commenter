export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getTimezoneOffsetInMinutes(timeZone: string, date: Date = new Date()): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  type DateParts = { [key: string]: string };

  const parts: DateParts = formatter.formatToParts(date).reduce((acc: DateParts, part) => {
    if (part.type !== "literal" && part.value) {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  const isoString = `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`;
  const targetDate = new Date(isoString);

  const offsetMs: number = targetDate.getTime() - date.getTime();
  return Math.round(offsetMs / 60000); // offset in minutes
}

const generateRandomTime = (timezone: string) => {
  const time = new Date();
  time.setHours(8);
  const offsetMinutes = Math.max(getTimezoneOffsetInMinutes(timezone), -8 * 60);

  const timeofTimezone = time.getTime() + (offsetMinutes * 60 * 1000);
  const randomTime = getRandomInt(3, 120) * 5 * 60 * 1000;
  // const randomTime = 0
  console.log((timeofTimezone + randomTime).toString().slice(0, -5))
  return (timeofTimezone + randomTime).toString().slice(0, -5);
};


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
    process.env.UNIPILE_API_KEY!
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

  console.log("accounts",accounts);
  for (const account of accounts) {
    const formattedTime = generateRandomTime("Asia/Shanghai");

    console.log(`Formatted time: ${formattedTime}`);    // const res = await fetch(

    const { data, error } = await supabase.from("comment-time").upsert([
      {
        unipile_id: account.id,
        comment_time: formattedTime,
      },
    ],{
      onConflict: "unipile_id",
    });

    if (error) {
      console.error("Error inserting into Supabase:", error);
    } else {
      console.log("Successfully inserted task:", data);
    }
  }
  return NextResponse.json({ ok: true });
}
