"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { addCommentExample } from "./actions"

export function AddCommentForm() {
  const [text, setText] = useState("")
  const [context, setContext] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      return
    }

    try {
      setIsSubmitting(true)
      // await addCommentExample({ text, context: context || "General comment" })

      // Reset form
      setText("")
      setContext("")

    } catch (error) {
      console.error("Failed to add comment example:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="comment-text">Comment Example</Label>
        <Textarea
          id="comment-text"
          placeholder="Enter an example of a comment you've made on LinkedIn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px]"
        />
        <p className="text-xs text-gray-500">Add a real comment you&apos;ve made that represents your tone and style.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment-context">Context (Optional)</Label>
        <Input
          id="comment-context"
          placeholder="e.g., Industry news, Congratulations, Job posting..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <p className="text-xs text-gray-500">Providing context helps our AI understand when to use similar comments.</p>
      </div>

      <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting || !text.trim()}>
        {isSubmitting ? "Adding..." : "Add Comment Example"}
      </Button>
    </form>
  )
}
