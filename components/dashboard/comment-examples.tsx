import { Suspense } from "react"
import { CommentExamplesList } from "./comment-examples-list"
import { AddCommentForm } from "./add-comment-form"

export interface CommentExample {
  id: string
  text: string
  context: string
  createdAt: Date
}

export default function CommentExamplesComponent() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b bg-gradient-to-r from-teal-500 to-emerald-500">
        <h2 className="text-xl font-semibold text-white">Your Comment Examples</h2>
        <p className="text-teal-50">Add examples of comments you&apos;ve made to help our AI match your tone and style</p>
      </div>

      <div className="p-6">
        <AddCommentForm />

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your saved examples</h3>
          <Suspense fallback={<CommentExamplesLoading />}>
            <CommentExamplesList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function CommentExamplesLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  )
}
