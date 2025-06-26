import { CommentProposal } from "@/types"
import { CommentProposalCard } from "./comment-proposal-card"
import { generateSummary } from "@/utils/server"
// import { acceptCommentProposal, rejectCommentProposal } from "./actions"

// This would typically come from a database


export async function CommentProposalsList({commentsProposals}: {commentsProposals: CommentProposal[] | null}) {



  if (!commentsProposals || commentsProposals.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending comment suggestion</h3>
          <p className="text-gray-500">
            Your comment suggestion will appear here. Select options below to begin matching posts and generating comments.
          </p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
        {commentsProposals.map((proposal) => (
          <CommentProposalCard
            key={proposal.id}
            proposal={proposal}
            generateSummary = {generateSummary}
          />
        ))}
      </div>
  )
}
