"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Check, X, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { CommentProposal } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import { delCommentProposal } from "@/utils/supabase/queries"
import { acceptComment } from "@/utils/supabase/queries"
import { redirectToPath } from "@/utils/supabase/server"
import { getStatusRedirect } from "@/utils/helpers"

interface CommentProposalCardProps {
  proposal: CommentProposal
}

export function CommentProposalCard({ proposal }: CommentProposalCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null)
  const [commentIA, setCommentIA] = useState(proposal.comment_IA)

  const handleAccept = async () => {
    try {
      setIsProcessing(true)
      setActionType("accept")
      console.log(commentIA)
      await acceptComment(proposal.id,proposal.unipile_id.user_timezone.timezone)

    } catch (error) {
      console.error("Failed to accept comment:", error)

    } finally {
      setIsProcessing(false)
      setActionType(null)
    }
  }

  const handleReject = async () => {
    try {
      setIsProcessing(true)
      setActionType("reject")
      await delCommentProposal(proposal.id)
      redirectToPath(getStatusRedirect('/dashboard',"Success ! 🎉", "Your comment has been successfully rejected"));
    } catch (error) {
      console.error("Failed to reject comment:", error)

    } finally {
      setIsProcessing(false)
      setActionType(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Proposed {formatDistanceToNow(proposal.created_at, { addSuffix: true })}
            </span>
          </div>

        </div>
      </div>

      {/* Original Post */}
      <div className="p-6 border-b">
        <div className="flex items-start space-x-4">
        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                          {proposal.author_name.charAt(0)}
                        </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{proposal.author_name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">
                  {/* {format(proposal.post.publishedAt, "MMM d, yyyy 'at' h:mm a")} */}
                </span>
                <a
                  href={proposal.post_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View original post</span>
                </a>
              </div>
            </div>
            <pre className="text-gray-700 leading-relaxed whitespace-pre-line break-words" style={{ fontFamily: 'inherit' }}>{proposal.post_text}</pre>
          </div>
        </div>
      </div>

      {/* Proposed Comment */}
      <div className="p-6 bg-teal-50 border-b">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <svg
            className="h-4 w-4 text-teal-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          AI-Generated Comment
        </h4>
        <div className="bg-white rounded-lg p-4 border border-teal-200">
          <Textarea value={commentIA} className="text-gray-700 leading-relaxed whitespace-pre-line break-words border-none focus:ring-0" style={{ fontFamily: 'inherit' }} onChange={(e) => setCommentIA(e.target.value)} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 bg-gray-50">
        <div className="flex space-x-3">
          <Button
            onClick={handleReject}
            variant="outline"
            disabled={isProcessing}
            className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
          >
            {isProcessing && actionType === "reject" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            Reject
          </Button>
          <Button onClick={handleAccept} disabled={isProcessing} className="flex-1 bg-teal-600 hover:bg-teal-700">
            {isProcessing && actionType === "accept" ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Accept & Post
          </Button>
        </div>
      </div>
    </div>
  )
}
