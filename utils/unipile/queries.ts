export { maxDuration } from "./route-config";
"use server";
import { redirect } from "next/navigation";
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { qdrantSavePost } from "../qdrant/queries";
import { createClient } from "../supabase/server";
import { delCommentProposal, getUnipileId } from "../supabase/queries";

export async function getPostFromId(postId: string, unipileId: string) {
  console.log("postID : ", postId, "unipileId", unipileId);
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const post = await fetch(
    "https://api10.unipile.com:14079/api/v1/posts/" +
      postId +
      "?account_id=" +
      unipileId,
    requestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => console.error(error));
  console.log("post : ", post);
  return post;
}

export async function getProviderId(unipile_id: string) {
  console.log("unipile_id from function", unipile_id);
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const provider_id = await fetch(
    "https://api10.unipile.com:14079/api/v1/users/me?account_id=" + unipile_id,
    requestOptions as RequestInit
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result.provider_id;
    });
  return provider_id;
}

export async function getUserComments(unipileId: string, provider_id: string) {
  const comHeaders = new Headers();
  comHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  comHeaders.append("accept", "application/json");

  const comRequestOptions = {
    method: "GET",
    headers: comHeaders,
    redirect: "follow",
  };

  const comments = await fetch(
    `https://api10.unipile.com:14079/api/v1/users/${provider_id}/comments?account_id=${unipileId}`,
    comRequestOptions as RequestInit
  )
    .then((response) => response.json())
    .catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  return comments;
}

export async function getProfilDesc(unipileId: string, provider_id: string) {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api10.unipile.com:14079/api/v1/users/" +
      provider_id +
      "?account_id=" +
      unipileId,
    requestOptions as RequestInit
  );
  const result = await response.json();
  console.log(result);
  return result.headline;
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
    "https://api10.unipile.com:14079/api/v1/accounts",
    requestOptions as RequestInit
  ).catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  await new Promise((resolve) => setTimeout(resolve, 10000));
  console.log(response);
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
    provider_id = await getProviderId(result.account_id);
    console.log("provider_id", provider_id);
    const profileDescription = await getProfilDesc(
      result.account_id,
      provider_id
    );
    console.log(profileDescription);
    const { error: unipileError } = await supabase.from("unipile_id").insert({
      unipile_id: result.account_id,
      access_token: accessToken,
      user_id: data.user.id,
      user_agent: userAgent,
      com_per_day_max: 2, //a changer
      profile_description: profileDescription ?? "",
    });
    if (unipileError) {
      console.log(unipileError);
      redirect(getErrorRedirect("/dashboard", "No user", unipileError.message));
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const comments = await getUserComments(result.account_id, provider_id);
    console.log("comments", comments);
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

export const getUnipileReconnectUrl = async (unipile_id: string) => {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify({
    type: "reconnect",
    providers: "*",
    expiresOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    api_url: "https://api10.unipile.com:14079/api/v1/accounts",
    reconnect_account: unipile_id,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = await fetch(
    "https://api10.unipile.com:14079/api/v1/hosted/accounts/link",
    requestOptions as RequestInit
  )
    .then(async (response) => await response.json())
    .catch((error) =>
      redirect(getErrorRedirect("/dashboard", "Error", error.message))
    );
  //   const result = await response.json();
  console.log(result);
  return result.url;
};

async function postComment(post_id:string,comment:string,unipile_id?:string){
  const unipileId = unipile_id || (await getUnipileId());
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");
  
  const raw = JSON.stringify({
    "account_id": unipileId,
    "text": comment
  });
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 50000));
  await fetch("https://api10.unipile.com:14079/api/v1/posts/"+post_id.replaceAll(":","%3A")+"/comments", requestOptions as RequestInit)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
}

export async function acceptComment(
  post: string,
  comment: string,
  id: string,
  post_id: string,
  unipile_id?: string
) {
  const unipileId = unipile_id || (await getUnipileId());
  if (unipileId && (await qdrantSavePost(post, comment, unipileId)).success) {
    await delCommentProposal(id);
    postComment(post_id,comment,unipileId);
    redirect(getStatusRedirect("/dashboard", "Success ! 🎉", "Your comment has been successfully accepted"));
  }
  redirect(getErrorRedirect("/dashboard", "Failed to accept comment"));
}