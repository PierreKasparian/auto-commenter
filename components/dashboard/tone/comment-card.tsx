"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QdrantSearchResult } from "@/types"
import { redirectToPath } from "@/utils/supabase/server"
import { getStatusRedirect } from "@/utils/helpers"

interface CommentCardProps {
  example: QdrantSearchResult
  deleteCommentExample: (id: number|string) => Promise<{
    success: boolean;
}>
}

export function CommentCard({ example, deleteCommentExample }: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const result = await deleteCommentExample(example.id)
      if (result.success) {
        redirectToPath(getStatusRedirect("/dashboard", "Success ! 🎉", "Your comment has been successfully deleted"))
      }
    } catch (error) {
      console.error("Failed to delete comment example:", error)
    } finally {
      setIsDeleting(false)
    }
  }
  // console.log(comments.points[0].payload)

  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
        <div>
          <span className="leading-relaxed whitespace-pre-line break-words">{example.payload?.post}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
      <div className="p-4 bg-white">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">{example.payload?.comment}</p>
      </div>
    </div>
  )
}
