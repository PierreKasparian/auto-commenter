import { CommentProposalsList } from "./comment-proposals-list";
import { CommentProposal } from "@/types";

export default function CommentProposalsComponent({
  commentsProposals,
}: {
  commentsProposals: CommentProposal[] | null;
}) {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Comment suggestion</h1>
        <p className="text-gray-600 mt-2">
          Review AI-generated comments for LinkedIn posts matching your keywords
          and preferences
        </p>
      </div>

      <CommentProposalsList commentsProposals={commentsProposals} />
    </div>
  );
}
