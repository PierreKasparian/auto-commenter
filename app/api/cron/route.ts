export const maxDuration = 60; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { FilterTimezoneReq } from "@/types";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getTimezoneOffsetInMinutes(
  timeZone: string,
  date: Date = new Date()
): number {
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

  const parts: DateParts = formatter
    .formatToParts(date)
    .reduce((acc: DateParts, part) => {
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

  const timeofTimezone = time.getTime() + offsetMinutes * 60 * 1000;
  const randomTime = getRandomInt(3, 120) * 5 * 60 * 1000;
  // const randomTime = 0
  console.log((timeofTimezone + randomTime).toString().slice(0, -5));
  return (timeofTimezone + randomTime).toString().slice(0, -5);
};

export async function GET(req: Request) {
  // console.log(process.env.N8N_AUTH)
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const accounts = await fetch(
    "https://api3.unipile.com:13349/api/v1/accounts",
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

  console.log("accounts", accounts);
  for (const account of accounts) {
    try {
      const {
        data: user_timezone,
        error: filterError,
      }: { data: FilterTimezoneReq | null; error: PostgrestError | null } =
        await supabase
          .from("unipile_id")
          .select("unipile_id,user_timezone(timezone,created_at)")
          .eq("unipile_id", account.id.toString())
          .single();

      console.log(user_timezone);
      if (!user_timezone || filterError) {
        console.log("No timezone found for account", account.id);
        continue;
      }

      const formattedTime = generateRandomTime(
        user_timezone.user_timezone.timezone
      );

      console.log(`Formatted time: ${formattedTime}`); // const res = await fetch(

      const { data, error: upsertError } = await supabase
        .from("comment_time")
        .upsert(
          [
            {
              unipile_id: account.id,
              comment_time: formattedTime,
            },
          ],
          {
            onConflict: "unipile_id",
          }
        );

      if (upsertError) {
        console.error("Error inserting into Supabase:", upsertError);
      } else {
        console.log("Successfully inserted task:", data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return NextResponse.json({ ok: true });
}
