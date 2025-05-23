import { QdrantClient } from "@qdrant/js-client-rest";
const client = new QdrantClient({ url:process.env.QDRANT_CLUSTER_LINK!, apiKey: process.env.QDRANT_CLUSTER_API_KEY! });

export async function retrieveQdrantCom(unipile_id: string,queryVector: number[],limit=5){
    const results = await client.search("comment_history", {
      vector: queryVector,
      limit: limit,
      with_payload: true, // Inclure les payloads dans la réponse
      with_vector: false, // Ne pas inclure les vecteurs dans la réponse
      filter: {
        must: [
          {
            key: "unipile_id",
            match: { value: unipile_id },
          },
        ],
      },
    });
    return results;
  }

async function vectorize(text: string){
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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
    unipileId: string
  ) {
    const res = await client.upsert("comment_history", {
        points: [
          {
            id: Number((new Date()).getTime()),
            payload: { post: post, comment: comment, unipile_id: unipileId },
            vector: await vectorize(post),
          },
        ],
      });
    return res;
  }