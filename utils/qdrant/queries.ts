"use server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { getUnipileId } from "../supabase/queries";
import { getErrorRedirect } from "../helpers";
import { redirect } from "next/navigation";
const client = new QdrantClient({
  url: process.env.QDRANT_CLUSTER_LINK!,
  apiKey: process.env.QDRANT_CLUSTER_API_KEY!,
});

export async function retrieveQdrantCom(vectorSearch?: {
  queryVector: number[];
  limit?: number;
  unipile_id?: string;
}) {
  const unipileId = vectorSearch?.unipile_id ?? (await getUnipileId());
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
    const commentList: string[] = results.map(
      (result) => result.payload?.comment
    ) as string[];
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
  console.log("post!!");
  console.log(post);
  console.log("comment!!");
  console.log(comment);

  const unipileId = unipile_id || (await getUnipileId());
  const existing = await client.search("comment_history", {
    vector: await vectorize(post),
    limit: 1,
    filter: {
      must: [
        {
          key: "post",
          match: {
            value: post,
          },
        },
        {
          key: "unipile_id",
          match: {
            value: unipileId,
          },
        },
      ],
    },
  });

  if (existing.length === 0) {
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
  }else console.log("post already exists")
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

export async function qdrantUpdateUnipileId(
  former_id: string,
  unipile_id: string
) {
  // Étape 1 : Récupérer les points avec unipile_id = "caca"
  const pointsToUpdate = await client.scroll("comment_history", {
    limit: 10000, // adapte selon le volume
    with_payload: true,
    filter: {
      must: [
        {
          key: "unipile_id",
          match: {
            value: former_id,
          },
        },
      ],
    },
  });

  const pointIds = pointsToUpdate.points.map((pt) => pt.id);

  if (pointIds.length === 0) {
    console.log("Aucun point à mettre à jour");
    return;
  }

  // Étape 2 : Mettre à jour le payload des points
  await client.setPayload("comment_history", {
    points: pointIds,
    payload: {
      unipile_id: unipile_id,
    },
  });

  console.log(`Mis à jour ${pointIds.length} points`);
}
