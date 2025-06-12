"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getErrorRedirect, getRandomPostTime, getStatusRedirect } from "../helpers";
import { SupabaseClient } from "@supabase/supabase-js";


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

export const getUnipileId = async (): Promise<string|null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log(error);
  }
  if (!data.user) {
    console.log("No user");
    return null;
  }
  const { data: unipileData, error: unipileError } = await supabase
    .from("unipile_id")
    .select("unipile_id")
    .eq("user_id", data.user.id);
  if (unipileError) {
    console.log(unipileError);
  }
  return unipileData?.[0]?.unipile_id;
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

export const getKeywords = async () => {
  const supabase = await createClient();
  const unipileId = await getUnipileId();
  if (!unipileId) return [];
  const { data, error } = await supabase
    .from("keywords")
    .select("keywords")
    .eq("unipile_id", unipileId);
  if (error) {
    console.log(error);
    return [];
  }
  return data?.[0]?.keywords ?? [];
};

export async function getCommentsProposals(id?: string) {
  const unipile_id = id ?? (await getUnipileId());
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment_proposal")
    .select("id,created_at,post_text,post_link,comment_IA,author_name,post_id,unipile_id(user_timezone(timezone))")
    .eq("unipile_id", unipile_id).is("post_time", null);
  if (error) console.log(error);
  return data;
}

export async function delCommentProposal(id: string,supabase?: SupabaseClient<any, "public", any>) {
  const supabaseClient = supabase ?? await createClient();
  const { data,error } = await supabaseClient
    .from("comment_proposal")
    .delete()
    .eq("id", id)
    .select();
  console.log("delete data")
  console.log(data)
  if (error) {
    redirect(getErrorRedirect("/dashboard", "Erreur,", error.message));
  }
}


export const getProfileDescription = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const user_id = user?.user?.id;
  const { data, error } = await supabase
    .from("unipile_id")
    .select("profile_description")
    .eq("user_id", user_id)
    .single();
  if (error) redirect(getErrorRedirect("/dashboard", "Error", error.message));
  return data?.profile_description;
}

export const editProfileDescription = async (profileDescription : string)=>{
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const user_id = user?.user?.id;
  const { error } = await supabase
    .from("unipile_id")
    .update({ profile_description: profileDescription })
    .eq("user_id", user_id)
    .single();
  if (error) redirect(getErrorRedirect("/dashboard", "Error", error.message));
  redirect(getStatusRedirect("/dashboard", "Success ! 🎉", "Your profile description has been successfully updated"));
}

export const getLanguages = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  const user_id = user?.user?.id;
  const { data, error } = await supabase
    .from("unipile_id")
    .select("langues")
    .eq("user_id", user_id)
    .single();
  if (error) redirect(getErrorRedirect("/dashboard", "Error", error.message));
  return data?.langues;
}

export const saveLanguages = async (languages : string[],unipileId : string)=>{
  const supabase = await createClient();
  const { error } = await supabase
    .from("unipile_id")
    .update({ langues: languages })
    .eq("unipile_id", unipileId)
    .single();
  if (error) redirect(getErrorRedirect("/dashboard", "Error", error.message));
  redirect(getStatusRedirect("/dashboard", "Success ! 🎉", "Your languages have been successfully updated"));
}

export async function acceptComment(
  id: string,
  timezone:string,
  unipile_id?: string
) {
  console.log(timezone)
  const unipileId = unipile_id || (await getUnipileId());
  if (unipileId) {
    const supabase = await createClient();
    const postTime = getRandomPostTime(timezone)
    const {error} = await supabase.from('comment_proposal').update({post_time:postTime}).eq('id',id)
    if(error) redirect(getErrorRedirect("/dashboard", "Failed to accept comment", error.message));
    redirect(getStatusRedirect("/dashboard", "Success ! 🎉", "Your comment has been successfully accepted"));
  }
  redirect(getErrorRedirect("/dashboard", "Failed to accept comment"));
}

export const isTrialEnded = async (unipile_id: string|null) => {
  if (!unipile_id) return true;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("unipile_id")
    .select("end_trial")
    .eq("unipile_id", unipile_id)
    .single();
    console.log(data)
  if (error) {
    console.log(error);
    return false;
  }
  if (!data.end_trial) return false;
  return new Date(data.end_trial) < new Date();
}