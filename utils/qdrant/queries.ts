"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { delCommentProposal, getUnipileId } from "../supabase/queries";
import { getErrorRedirect, getStatusRedirect } from "../helpers";
import { redirect } from "next/navigation";
const client = new QdrantClient({
  url: process.env.QDRANT_CLUSTER_LINK!,
  apiKey: process.env.QDRANT_CLUSTER_API_KEY!,
});

export async function retrieveQdrantCom(vectorSearch?: {
  queryVector: number[];
  limit?: number;
  unipile_id?:string
}) {
  const unipileId = vectorSearch?.unipile_id ?? await getUnipileId();
  let results;
  if (vectorSearch) {
    results = await client.search("comment_history", {
      vector: vectorSearch?.queryVector,
      limit: vectorSearch?.limit,
      with_payload: true, // Inclure les payloads dans la réponse
      with_vector: false, // Ne pas inclure les vecteurs dans la réponse
      filter: {
        must: [
          {
            key: "unipile_id",
            match: { value: unipileId },
          },
        ],
      },
    });
    const commentList:string[] = results.map(result => result.payload?.comment) as string[];
    return commentList;
  } else {
    results = await client.scroll("comment_history", {
      limit: 500, // Nombre maximum de points à récupérer
      with_payload: true, // Inclure les payloads dans la réponse
      filter: {
        must: [
          {
            key: "unipile_id",
            match: { value: unipileId },
          },
        ],
      },
    });
  }
  return results;
}

export async function vectorize(text: string) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-ada-002",
    }),
  });
  const data = await response.json();
  return data.data[0].embedding;
}

export async function qdrantSavePost(
  post: string,
  comment: string,
  unipile_id?: string
) {
  console.log('post!!')
  console.log(post);
  console.log('comment!!')
  console.log(comment);

  const unipileId = unipile_id || (await getUnipileId());
  const res = await client.upsert("comment_history", {
    points: [
      {
        id: Number(new Date().getTime()),
        payload: { post: post, comment: comment, unipile_id: unipileId },
        vector: await vectorize(post),
      },
    ],
    wait: true,
  });
  if (!(res.status === "completed" || res.status === "acknowledged")) {
    redirect(getErrorRedirect("/dashboard", "Failed to save post"));
  }
  return { success: true };
}

export async function qdrantDelPost(id: number | string) {
  const res = await client.delete("comment_history", {
    points: [id],
    wait: true,
  });
  if (!(res.status === "completed" || res.status === "acknowledged")) {
    redirect(getErrorRedirect("/dashboard", "Failed to delete post"));
  }
  return { success: true };
}

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
  
  await fetch("https://api3.unipile.com:13349/api/v1/posts/"+post_id.replaceAll(":","%3A")+"/comments", requestOptions as RequestInit)
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
    await postComment(post_id,comment,unipileId);
    redirect(getStatusRedirect("/dashboard", "Success ! 🎉", "Your comment has been successfully accepted"));
  }
  redirect(getErrorRedirect("/dashboard", "Failed to accept comment"));
}
