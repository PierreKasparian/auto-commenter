import React from 'react'
import { Separator } from "@/components/ui/separator"
import KeywordsChoose from "@/components/dashboard/kw-choose"
import AccountsChoose from "@/components/dashboard/accounts-choose"
import { LinkedInAccountCard } from "@/components/dashboard/lkin-account-card"
import { getUnipileId } from "@/utils/supabase/queries"
import { getKeywords } from "@/utils/supabase/queries"

const DashboardPage = async () => {
  const { unipile_id } = await getUnipileId()
    const keywords = await getKeywords(unipile_id)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8 w-full">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">LinkedIn Auto Commenter</h1>
          <p className="text-muted-foreground">
            Automate your LinkedIn engagement with smart commenting
          </p>
        </div>

<div className="w-full">
            <LinkedInAccountCard unipileId={unipile_id} />
</div>

        {/* Configuration Section */}
        {unipile_id && (
          <div className="space-y-8 w-full">
            <Separator />

                <KeywordsChoose unipileId={unipile_id} kw={keywords} />


            {/* Accounts Configuration */}

                <AccountsChoose />

          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage