export const maxDuration = 60;
export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import { getUnipileId, hasSuggestionBeenDone } from "@/utils/supabase/queries";

import CommentProposalWrapper from "@/components/dashboard/comment-proposal/comment-proposal-wrapper";
import DashboardLoading from "@/components/dashboard/DashboardLoading";
const Page = async () => {
  const unipile_id = await getUnipileId();

  const didGenerateComm = unipile_id
    ? await hasSuggestionBeenDone(unipile_id)
    : false;
  return (
    <Suspense fallback={<DashboardLoading didGenerateComm={didGenerateComm} />}>
      <CommentProposalWrapper unipile_id={unipile_id} didGenerateComm={didGenerateComm} />
    </Suspense>
  );
};

export default Page;
