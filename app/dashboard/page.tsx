export const maxDuration = 60;
export const dynamic = "force-dynamic";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KeywordsChoose from "@/components/dashboard/kw-choose";
// import AccountsChoose from "@/components/dashboard/account-choose/accounts-choose";
import { LinkedInAccountCard } from "@/components/dashboard/lkin-account-card";
import { getUnipileId } from "@/utils/supabase/queries";
import { getAccountsNkw } from "@/utils/supabase/queries";
import { getLanguages } from "@/utils/supabase/queries";
import { Navbar } from "@/components/navbar";
import YourTone from "@/components/dashboard/tone/comment-examples";
import LanguageChoose from "@/components/dashboard/language-choose";
import { isUnipileAccountConnected } from "@/utils/helpers";
import { isTrialEnded } from "@/utils/supabase/queries";
import Link from "next/link";
import AccountsChoose from "@/components/dashboard/account-choose/accounts-choose";
const DashboardPage = async () => {
  const unipile_id = await getUnipileId();
  console.log(unipile_id);
  const hasSubscription = !(await isTrialEnded(unipile_id));
  console.log(hasSubscription);
  let isConnected = false;
  let keywords: string[] = [];
  let accounts: string[] = [];
  let langues: string[] = [];
  if (hasSubscription) {
    isConnected = await isUnipileAccountConnected(unipile_id ?? "");
    const accountsNkw = await getAccountsNkw();
    keywords = accountsNkw.keywords?.keywords ?? [];
    accounts = accountsNkw.accounts?.accounts ?? [];
    langues = await getLanguages();
  }
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
          
          {/* Configuration Section */}
          {!hasSubscription && unipile_id ? (
            <>
            <Separator />
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
            </>
          ) : (
            unipile_id &&
            isConnected && (
              <>
              <Separator />
                <div className="space-y-8 w-full">
                  <div className="w-full flex flex-col space-y-8">
                    <div className="flex flex-row w-full space-x-4">
                      <KeywordsChoose unipileId={unipile_id} kw={keywords} />{" "}
                      
                      <LanguageChoose
                        unipileId={unipile_id}
                        langues={langues}
                      />
                    </div>
                    <AccountsChoose unipileId={unipile_id} accounts={accounts} />
                    <Separator />
                    <YourTone />
                  </div>

                  {/* Accounts Configuration */}
                </div>
              </>
            )
          )}
          {(hasSubscription || !unipile_id) && (
            <>
              <Separator />{" "}
              <div className="w-full">
                <LinkedInAccountCard
                  unipileId={unipile_id}
                  isConnected={isConnected}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
