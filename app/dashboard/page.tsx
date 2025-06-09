export const maxDuration = 180;
export const dynamic = 'force-dynamic';
import React from "react";
import { Separator } from "@/components/ui/separator";
import KeywordsChoose from "@/components/dashboard/kw-choose";
import AccountsChoose from "@/components/dashboard/accounts-choose";
import { LinkedInAccountCard } from "@/components/dashboard/lkin-account-card";
import { getUnipileId } from "@/utils/supabase/queries";
import { getKeywords } from "@/utils/supabase/queries";
import { getLanguages } from "@/utils/supabase/queries";
import { Navbar } from "@/components/navbar";
import YourTone from "@/components/dashboard/tone/comment-examples";
import CommentProposalsComponent from "@/components/dashboard/comment-proposal/comment-proposals";
import { getCommentsProposals } from "@/utils/supabase/queries";
import LanguageChoose from "@/components/dashboard/language-choose";
import { isUnipileAccountConnected } from "@/utils/helpers";

const DashboardPage = async () => {
  const unipile_id = await getUnipileId();
  const isConnected = await isUnipileAccountConnected(unipile_id ?? "");
  const keywords = await getKeywords();
  const langues = await getLanguages();
  const commentsProposals = await getCommentsProposals(unipile_id ?? undefined);
  return (
    <>
      <Navbar isDashboard={true} />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8 w-full">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Dashboard
            </h1>
            <p className="text-muted-foreground">
              Automate your LinkedIn engagement with smart commenting
            </p>
          </div>
          <Separator />
          {/* Configuration Section */}
          {unipile_id && isConnected && (
            <>
              <div className="space-y-8 w-full">
                <CommentProposalsComponent
                  commentsProposals={commentsProposals}
                />

                <div className="w-full flex flex-row space-x-8">
                  <div className="w-full space-y-4">
                    <KeywordsChoose unipileId={unipile_id} kw={keywords} />{" "}
                    <AccountsChoose />
                    <LanguageChoose unipileId={unipile_id} langues={langues} />
                  </div>
                  <YourTone />
                </div>

                {/* Accounts Configuration */}
              </div>
              <Separator />{" "}
            </>
          )}{" "}
          <div className="w-full">
            <LinkedInAccountCard unipileId={unipile_id} isConnected={isConnected}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
