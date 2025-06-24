"use server";
import { redirect } from "next/navigation";
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { qdrantUpdateUnipileId } from "../qdrant/queries";
import { createClient } from "../supabase/server";
import { getUnipileId } from "../supabase/queries";
import { LinkedInPost } from "@/types";

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
    "https://api16.unipile.com:14661/api/v1/posts/" +
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

export async function getProviderId(unipile_id: string, public_id?: string) {
  console.log("unipile_id from function", unipile_id);
  console.log(public_id ?? "me");
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const provider_id = await fetch(
    `https://api16.unipile.com:14661/api/v1/users/${
      public_id ?? "me"
    }?account_id=${unipile_id}`,
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
    `https://api16.unipile.com:14661/api/v1/users/${provider_id}/comments?limit=100&account_id=${unipileId}`,
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
    "https://api16.unipile.com:14661/api/v1/users/" +
      provider_id +
      "?account_id=" +
      unipileId,
    requestOptions as RequestInit
  );
  const result = await response.json();
  console.log(result);
  return {
    profileDescription: result.headline,
    profileName: result.first_name + " " + result.last_name,
  };
}

// export async function linkedinConnect(accessToken: string, userAgent: string) {
//   const myHeaders = new Headers();
//   myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
//   myHeaders.append("accept", "application/json");
//   myHeaders.append("content-type", "application/json");

//   const raw = JSON.stringify({
//     provider: "LINKEDIN",
//     access_token: accessToken,
//     user_agent: userAgent,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   const response = await fetch(
//     "https://api16.unipile.com:14661/api/v1/accounts",
//     requestOptions as RequestInit
//   ).catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
//   await new Promise((resolve) => setTimeout(resolve, 7000));
//   console.log(response);
//   const result = await response.json();
//   if (result.object == "AccountCreated") {
//     const supabase = await createClient();
//     const { data, error } = await supabase.auth.getUser();
//     if (error) {
//       console.log(error);
//       redirect(getErrorRedirect("/dashboard", error.message));
//     }
//     if (!data.user) {
//       console.log("No user");
//       redirect(getErrorRedirect("/dashboard", "No user", "No user found"));
//     }
//     const provider_id = await getProviderId(result.account_id);
//     console.log("provider_id", provider_id);
//     const { profileDescription, profileName } = await getProfilDesc(
//       result.account_id,
//       provider_id
//     );
//     console.log(profileDescription);
//     const { error: unipileError } = await supabase.from("unipile_id").insert({
//       unipile_id: result.account_id,
//       user_id: data.user.id,
//       com_per_day_max: 2, //a changer
//       profile_description: profileDescription ?? "",
//       profile_name: profileName,
//     });
//     if (unipileError) {
//       console.log(unipileError);
//       redirect(getErrorRedirect("/dashboard", "No user", unipileError.message));
//     }

//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     try {
//       const comments = await getUserComments(result.account_id, provider_id);
//       console.log("comments", comments);
//       for (const comment of comments.items.slice(0, 20)) {
//         if (comment.text.length > 15 && comment.author === profileName) {
//           const post = await getPostFromId(comment.post_urn, result.account_id);
//           await qdrantSavePost(post.text, comment.text, result.account_id);
//           await new Promise((resolve) => setTimeout(resolve, 1)); //ids are time generated}
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       redirect(
//         getErrorRedirect(
//           "/dashboard",
//           "Error",
//           "Error retrieving your comments"
//         )
//       );
//     }
//     redirect(
//       getStatusRedirect(
//         "/dashboard",
//         "Success ! 🎉",
//         "Your account has been successfully connected"
//       )
//     );
//   }
//   redirect(getErrorRedirect("/dashboard", "No user", "No user found"));
// }



export const getUnipileConnectUrl = async (
  success_url: string,
  failure_url: string,
  isConnect: boolean,
  id: string
) => {
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify(
    isConnect
      ? {
          type: "create",
          providers: "*",
          expiresOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          api_url: "https://api16.unipile.com:14661",
          success_redirect_url: success_url,
          failure_redirect_url: failure_url,
          notify_url: "https://auto-commenter.vercel.app/api/unipile/",
          name: id,
        }
      : {
          type: "reconnect",
          providers: "*",
          expiresOn: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          api_url: "https://api16.unipile.com:14661",
          reconnect_account: id,
          success_redirect_url: success_url,
          failure_redirect_url: failure_url,
          name: id,
        }
  );

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const result = await fetch(
    "https://api16.unipile.com:14661/api/v1/hosted/accounts/link",
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

export async function postComment(
  post_id: string,
  comment: string,
  unipile_id?: string
) {
  const unipileId = unipile_id || (await getUnipileId());
  const myHeaders = new Headers();
  myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify({
    account_id: unipileId,
    text: comment,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  // await waitRandomTime();
  console.log("comment close to posting..");
  const res = await fetch(
    "https://api16.unipile.com:14661/api/v1/posts/" +
      post_id.replaceAll(":", "%3A") +
      "/comments",
    requestOptions as RequestInit
  )
    .then((response) => response.text())
    // .then((result) => console.log(result))
    .catch((error) => console.log(error));
  console.log(res);
}

export async function fuckUnipile(
  accessToken: string,
  userAgent: string,
  unipile_id?: string
) {
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
    "https://api16.unipile.com:14661/api/v1/accounts",
    requestOptions as RequestInit
  ).catch((error) => redirect(getErrorRedirect("/dashboard", error.message)));
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log(response);
  const result = await response.json();
  await qdrantUpdateUnipileId(unipile_id!, result.account_id);
  if (result.object == "AccountCreated") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      redirect(
        getErrorRedirect(
          "/dashboard",
          "Error",
          error?.message ?? "No user found"
        )
      );
    }
    const { error: unipileError } = await supabase
      .from("unipile_id")
      .update({
        unipile_id: result.account_id,
      })
      .eq("user_id", data.user.id);
    if (unipileError) {
      console.log(unipileError);
      redirect(getErrorRedirect("/dashboard", "Error", unipileError.message));
    }
    redirect(
      getStatusRedirect(
        "/dashboard",
        "Success ! 🎉",
        "Your account has been successfully connected"
      )
    );
  }
}

export async function getUserPosts(public_ids: string[], unipile_id: string) {
  let posts: LinkedInPost[] = [];

  for (const public_id of public_ids) {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", process.env.UNIPILE_API_KEY!);
    myHeaders.append("accept", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "https://api16.unipile.com:14661/api/v1/users/" +
        public_id +
        "?account_id=" +
        unipile_id,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
    console.log(response);

    const response2 = await fetch(
      "https://api16.unipile.com:14661/api/v1/users/" +
        response.provider_id +
        "/posts?limit=1&account_id=" +
        unipile_id,
      requestOptions as RequestInit
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));
    console.log(response2);

    posts = [...posts, ...response2.items];
  }

  return posts;
}
