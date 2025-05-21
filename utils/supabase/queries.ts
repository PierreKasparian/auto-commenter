"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getErrorRedirect, getStatusRedirect } from "../helpers";

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect(getErrorRedirect("/dashboard", error.message));
  }
  redirect(
    getStatusRedirect(
      "/",
      "Success ! 🎉",
      "You have been successfully disconnected"
    )
  );
}

export const getUnipileId = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    redirect(getErrorRedirect("/dashboard", error.message));
  }
  if (!data.user) {
    redirect(getErrorRedirect("/dashboard", "No user"));
  }
  const { data: unipileData, error: unipileError } = await supabase
    .from("unipile_id")
    .select("unipile_id,access_token")
    .eq("user_id", data.user.id);
  if (unipileError) {
    console.log(unipileError);
    redirect(getErrorRedirect("/dashboard", unipileError.message));
  }
  return {
    unipile_id: unipileData?.[0]?.unipile_id,
    access_token: unipileData?.[0]?.access_token,
  };
};

export const saveKeywords = async (keywords: string[], unipileId: string) => {
  const supabase = await createClient();
  const { error } = await supabase.from("keywords").upsert(
    {
      keywords: keywords,
      unipile_id: unipileId,
    },
    { onConflict: "unipile_id", ignoreDuplicates: false }
  );
  if (error) {
    redirect(getErrorRedirect("/dashboard", error.message));
  }
  redirect(
    getStatusRedirect(
      "/dashboard",
      "Success ! 🎉",
      "Your keywords have been successfully saved"
    )
  );
};

export const getKeywords = async (unipileId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("keywords")
    .select("keywords")
    .eq("unipile_id", unipileId);
  if (error) {
    redirect(getErrorRedirect("/dashboard", error.message));
  }
  return data?.[0]?.keywords ?? [];
};

export async function linkedinConnect(accessToken: string, userAgent: string) {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify({
    provider: "LINKEDIN",
    access_token: accessToken,
    user_agent: userAgent,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api12.unipile.com:14269/api/v1/accounts",
    requestOptions as RequestInit
  );
  const result = await response.json();
  if (result.object == "AccountCreated") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log(error);
      redirect(getErrorRedirect("/dashboard", error.message));
    }
    if (!data.user) {
      console.log("No user");
      redirect(getErrorRedirect("/dashboard", "No user", "No user found"));
    }
    const { data: unipileData, error: unipileError } = await supabase
      .from("unipile_id")
      .insert({
        unipile_id: result.account_id,
        access_token: accessToken,
        user_id: data.user.id,
      })
      .single();
    if (unipileError) {
      console.log(unipileError);
      redirect(getErrorRedirect("/dashboard", "No user", unipileError.message));
    }
  }
  redirect(
    getStatusRedirect(
      "/dashboard",
      "Success ! 🎉",
      "Your account has been successfully connected"
    )
  );
}
