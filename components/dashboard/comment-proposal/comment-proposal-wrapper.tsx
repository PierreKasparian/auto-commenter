export const maxDuration = 60;
export const dynamic = "force-dynamic";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkedInAccountCard } from "@/components/dashboard/lkin-account-card";
import { Navbar } from "@/components/navbar";
import CommentProposalsComponent from "@/components/dashboard/comment-proposal/comment-proposals";
import { getCommentsProposals } from "@/utils/supabase/queries";
import { isUnipileAccountConnected } from "@/utils/helpers";
import { CommentProposal } from "@/types";
import { isTrialEnded } from "@/utils/supabase/queries";
import Link from "next/link";
const CommentSuggestionPage = async ({unipile_id, didGenerateComm}:{unipile_id:string | null, didGenerateComm: boolean}) => {
  console.log(unipile_id);
  const hasSubscription = !(await isTrialEnded(unipile_id));
  console.log(hasSubscription);
  let isConnected = false;
  let commentsProposals: CommentProposal[] = [];
  if (hasSubscription) {
    isConnected = await isUnipileAccountConnected(unipile_id ?? "");
    if (isConnected && !didGenerateComm){
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${process.env.TRIG_TASK_KEY}`);
        myHeaders.append("accept", "application/json");
        const requestOptions1 = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            account_id: unipile_id
          }),
          redirect: "follow"
        };
        await fetch(process.env.NEXT_ENV === "development" ? "http://localhost:3000/api/generate-com" : "https://auto-commenter.vercel.app/api/generate-com", requestOptions1 as RequestInit);
    }
    commentsProposals = (await getCommentsProposals(
      unipile_id ?? undefined
    )) as unknown as CommentProposal[];
  }
  return (
    <>
      <Navbar isDashboard={true} />
      <div className="container mx-auto py-8">
        <div className="space-y-8 w-full">
          {!hasSubscription && unipile_id ? (
            <div className="w-full">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold mb-2">
                    Get Started with Auto-Commenter
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <p className="text-muted-foreground mb-6">
                    Unlock the power of automated LinkedIn engagement with our
                    premium features.
                  </p>
                  <Link
                    href="/dashboard/purchase-credits"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-teal-600 text-white hover:bg-teal-700 h-10 px-4 py-2"
                  >
                    Purchase Credits
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            unipile_id &&
            isConnected && (
                <div className="space-y-8 w-full">
                  <CommentProposalsComponent
                    commentsProposals={commentsProposals}
                  />
                </div>
            )
          )}
          {(hasSubscription || !unipile_id) && (
            <div className="w-full">
                <LinkedInAccountCard
                  unipileId={unipile_id}
                  isConnected={isConnected}
                />
              </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentSuggestionPage;
