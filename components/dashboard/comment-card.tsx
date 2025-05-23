"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CommentExample } from "./comment-examples"

interface CommentCardProps {
  example: CommentExample
  deleteCommentExample: (id: string) => Promise<void>
}

export function CommentCard({ example, deleteCommentExample }: CommentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteCommentExample(example.id)
    } catch (error) {
      console.error("Failed to delete comment example:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden group">
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
        <div>
          <span className="text-sm font-medium text-gray-700">{example.context}</span>
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
        <p className="text-gray-700">{example.text}</p>
      </div>
    </div>
  )
}
