import React from "react";
import { retrieveQdrantCom } from "@/utils/qdrant/queries";

const page = async () => {
// Upsert points (PUT /collections/:collection_name/points)
// const response = await fetch("https://76b35f9a-6295-4c15-b966-3ff03aa966b9.eu-west-2-0.aws.cloud.qdrant.io:6333/collections/comment_history/points?wait=true", {
//   method: "PUT",
//   headers: {
//     "api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.HDJHZwr92wxcLOG-Ww6CQnTC6kfgQ7LcW7R7lwLkhT4",
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     "batch": {
//       "ids": [
//         2
//       ],
//       "vectors": [
//      Array(1536).fill(0)
//       ],
//       "payloads": [
//         {
//           "text": "sdf",
//           "post": "sdf",
//           "unipile_id": "sdf",
//         }
//       ]
//     }
//   }),
// });


const res = await retrieveQdrantCom({unipile_id:"sdf",vectorSearch:{queryVector:Array(1536).fill(100)}});
console.log(res)
// const body = await response.json();
// console.log(body);




// console.log(queryVector);


// Get collection details (GET /collections/:collection_name)


// const results = await client.search("comment_history", {
//   vector: queryVector,
//   limit: 5,
//   filter: {
//     must: [
//       {
//         key: "unipile_id",
//         match: { value: "sdf" },
//       },
//     ],
//   },
//   with_payload: true,
// });
// Search points (POST /collections/:collection_name/points/search)
// const response = await fetch("https://76b35f9a-6295-4c15-b966-3ff03aa966b9.eu-west-2-0.aws.cloud.qdrant.io:6333/collections/comment_history/points/search", {
//   method: "POST",
//   headers: {
//     "api-key": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.HDJHZwr92wxcLOG-Ww6CQnTC6kfgQ7LcW7R7lwLkhT4",
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     "vector": queryVector,
//     "limit": 1,
//     "with_payload": true,
//   }),
// });

// await client.createPayloadIndex("comment_history", {
//   field_name: "unipile_id",
//   field_schema: "keyword",
// });


// const queryVector = [0.2, 0.1, 0.9, 0.7];

// Exécution de la recherche


// Affichage des résultats
// console.log(results);

// const results = await retrieveQdrantCom("sdf");

  return <div></div>;
};

export default page;
