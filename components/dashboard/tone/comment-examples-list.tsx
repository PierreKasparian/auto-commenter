import { qdrantDelPost, retrieveQdrantCom } from "@/utils/qdrant/queries"
import { CommentCard } from "./comment-card"
import { QdrantResponse, QdrantSearchResult } from "@/types"


export async function CommentExamplesList() {
  const comments = (await retrieveQdrantCom() as QdrantResponse)
  if (comments.points.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <p className="text-gray-500">You haven&apos;t added any comment examples yet.</p>

      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.points.map((example) => (
        <CommentCard key={example.id} example={example as QdrantSearchResult} deleteCommentExample={qdrantDelPost}/>
      ))}
      <p className="text-muted-foreground text-sm">AI will use these examples to replicate your tone and generate comments.</p>
    </div>
  )
}
