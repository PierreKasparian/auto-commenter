export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient, PostgrestError } from "@supabase/supabase-js";
import { FilterTimezoneReq } from "@/types";
import { getTimezoneOffsetInMinutes } from "@/utils/helpers";
import {
  getProviderId,
  getUserComments,
} from "@/utils/unipile/queries";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomTime = (timezone: string) => {
  const time = new Date();
  time.setHours(8);
  const offsetMinutes = Math.max(getTimezoneOffsetInMinutes(timezone), -8 * 60);

  const timeofTimezone = time.getTime() + offsetMinutes * 60 * 1000;
  const randomTime = getRandomInt(3, 120) * 5 * 60 * 1000;
  // const randomTime = 0
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
    "https://api13.unipile.com:14361/api/v1/accounts",
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
          .select("unipile_id,end_trial,user_timezone(timezone,created_at),profile_name")
          .eq("unipile_id", account.id.toString())
          .single();

      console.log(user_timezone);
      if (!user_timezone || filterError) {
        console.log("No timezone found for account", account.id);
        continue;
      }

      if (
        user_timezone.end_trial &&
        new Date(user_timezone.end_trial) < new Date()
      ) {
        console.log("Trial ended for account", account.id);
        return NextResponse.json({ error: "Trial ended" }, { status: 401 });
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
              created_at: new Date().toISOString(),
              done: false,
            },
          ],
          {
            onConflict: "unipile_id",
            ignoreDuplicates: false,
          }
        );

      if (upsertError) {
        console.error("Error inserting into Supabase:", upsertError);
      } else {
        console.log("Successfully inserted task:", data);
      }

      // console.log(await retrieveQdrantCom())
      //mise à jour des commentaires
      const provider_id = await getProviderId(account.id);
      const comments = await getUserComments(account.id, provider_id);
      fetch(process.env.NODE_ENV === "development" ? "http://localhost:3000/api/update-comments" : "https://auto-commenter.vercel.app/api/update-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CRON_SECRET}`,
        },
        body: JSON.stringify({ account_id: account.id, comments, profile_name: user_timezone.profile_name }),
      });
    } catch (error) {
      console.log(error);
    }
  }
  return NextResponse.json({ ok: true });
}
