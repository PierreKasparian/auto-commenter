import { CommentCard } from "./comment-card"

// This would typically come from a database
// For demo purposes, we're using mock data
const getCommentExamples = async () => {
  // Simulate database fetch delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "1",
      text: "Great insights on this topic! I've been implementing similar strategies in my work and have seen significant improvements in productivity. Would love to connect and share experiences.",
      context: "Professional development post",
      createdAt: new Date(2023, 5, 15),
    },
    {
      id: "2",
      text: "Congratulations on this achievement! Your dedication to innovation in this space is truly inspiring. Looking forward to seeing what you accomplish next.",
      context: "Achievement announcement",
      createdAt: new Date(2023, 6, 22),
    },
    {
      id: "3",
      text: "This is a fascinating perspective on industry trends. I particularly appreciate your point about sustainable practices. Have you considered how this might apply to smaller businesses?",
      context: "Industry analysis post",
      createdAt: new Date(2023, 7, 10),
    },
  ]
}

export async function CommentExamplesList() {
  const commentExamples = await getCommentExamples()

  if (commentExamples.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-50">
        <p className="text-gray-500">You haven&apos;t added any comment examples yet.</p>
        <p className="text-gray-500 text-sm mt-1">
          Add a few examples to help our AI understand your commenting style.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {commentExamples.map((example) => (
        <CommentCard key={example.id} example={example} deleteCommentExample={async (id:string)=>{console.log(id)}} />
      ))}
    </div>
  )
}
