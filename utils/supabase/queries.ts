"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { qdrantSavePost } from "../qdrant/queries";

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

export const getUnipileId = async (): Promise<string | null> => {
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
    return null;
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

export async function getPostFromId(postId: string, unipileId: string) {
  console.log("postID : ",postId,"unipileId",unipileId)
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const post = await fetch(
    "https://api3.unipile.com:13349/api/v1/posts/" +
      postId +
      "?account_id=" +
      unipileId,
    requestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
  console.log("post : ",post)
  return post;
}

async function getProviderId(unipile_id:string){
  console.log("unipile_id from function",unipile_id)
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const provider_id = await fetch(
    "https://api3.unipile.com:13349/api/v1/users/me?account_id=" + unipile_id,
    requestOptions as RequestInit
  ).then((response) => response.json())
    .then((result) => {console.log(result);return result.provider_id})
    .catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  return provider_id
}


export async function getUserComments(unipileId: string,provider_id:string) {

  const comHeaders = new Headers();
  comHeaders.append(
    "X-API-KEY",
    process.env.UNIPILE_API_KEY!
  );
  comHeaders.append("accept", "application/json");

  const comRequestOptions = {
    method: "GET",
    headers: comHeaders,
    redirect: "follow",
  };

  const comments = await fetch(
    `https://api3.unipile.com:13349/api/v1/users/${provider_id}/comments?account_id=${unipileId}`,
    comRequestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  return comments;
}

export async function getProfilDesc(unipileId: string,provider_id:string) {
  const myHeaders = new Headers();
myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
myHeaders.append("accept", "application/json");

const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

const response = await fetch("https://api3.unipile.com:13349/api/v1/users/"+provider_id+"?account_id="+unipileId, requestOptions as RequestInit)
const result = await response.json()
console.log(result)
return result.headline
}

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
    "https://api3.unipile.com:13349/api/v1/accounts",
    requestOptions as RequestInit
  ).catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log(response)
  const result = await response.json();
  let provider_id;
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
    provider_id = await getProviderId(result.account_id)
    console.log("provider_id",provider_id)
    const profileDescription = await getProfilDesc(result.account_id,provider_id)
    console.log(profileDescription)
    const { error: unipileError } = await supabase
      .from("unipile_id")
      .insert({
        unipile_id: result.account_id,
        access_token: accessToken,
        user_id: data.user.id,
        user_agent: userAgent,
        com_per_day_max: 2, //a changer
        profile_description: profileDescription ?? "",
      })
    if (unipileError) {
      console.log(unipileError);
      redirect(getErrorRedirect("/dashboard", "No user", unipileError.message));
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const comments = await getUserComments(result.account_id,provider_id);
    console.log("comments",comments)
    for (const comment of comments.items) {
      if (comment.text.length > 10) {
        const post = await getPostFromId(comment.post_urn, result.account_id);
        await qdrantSavePost(post.text, comment.text, result.account_id);
        await new Promise((resolve) => setTimeout(resolve, 1)); //ids are time generated}
      }
    }
  } catch (error) {
    console.log(error);
    redirect(getErrorRedirect("/dashboard", (error as Error).message));
  }
  redirect(
    getStatusRedirect(
      "/dashboard",
      "Success ! 🎉",
      "Your account has been successfully connected"
    )
  );
}

export async function getCommentsProposals(id?: string) {
  const unipile_id = id ?? (await getUnipileId());
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment_proposal")
    .select("id,created_at,post_text,post_link,comment_IA,author_name,post_id")
    .eq("unipile_id", unipile_id);
  if (error) console.log(error);
  return data;
}

export async function delCommentProposal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("comment_proposal")
    .delete()
    .eq("id", id);
  if (error) {
    redirect(getErrorRedirect("/dashboard", "Erreur,", error.message));
  }
}
