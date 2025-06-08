import { Suspense } from "react"
import { CommentExamplesList } from "./comment-examples-list"
import { AddCommentForm } from "./add-comment-form"
import ProfileDescriptionForm from "./profile-desc-form"
import { getProfileDescription } from "@/utils/supabase/queries"



export default async function YourTone() {
  const profileDescription = await getProfileDescription()

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-black">Your comment tone</h2>
        <p className="text-muted-foreground">Add examples of comments you&apos;ve made to help our AI match your tone and style</p>
      </div>
<div className="">
  <ProfileDescriptionForm profileDesc={profileDescription} />
</div>
      <div className="p-6">
        <AddCommentForm />

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Your posted comments</h3>
          <p className="text-gray-500 text-sm mb-4">
          Add a few examples to help our AI understand your commenting style. Delete examples if you don&apos;t want the IA to take example on them.
        </p>
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
