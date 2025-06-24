"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { LinkedInTokenInfoDialog } from "./find-tok-dialog";
import { fuckUnipile, getUnipileConnectUrl } from "@/utils/unipile/queries";
import { useState } from "react";
import { redirectToPath } from "@/utils/supabase/server";
import {
  getStatusRedirect,
  getErrorRedirect,
  toastErrorPop,
} from "@/utils/helpers";
import { createClient } from "@/utils/supabase/client";

export function LinkedInConnectForm({
  unipileId,
  reconnectForTrial,
}: {
  unipileId?: string | null;
  reconnectForTrial?: boolean;
}) {
  console.log(reconnectForTrial);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [formSubmitted, isFormSubmitted] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent) => {
    isFormSubmitted(true);
    e.preventDefault();
    const userAgent = navigator.userAgent;
    if (!reconnectForTrial) {
      const successUrl = getStatusRedirect(
        "/dashboard",
        "Success",
        "Reconnection successful"
      );
      const supabase = await createClient();
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        console.log("No user");
        toastErrorPop("No user", "No user found");
        return;
      }
      const cancelUrl = getErrorRedirect("/dashboard", "Reconnection issued");
      // await linkedinConnect(accessToken, userAgent)
      const a = await getUnipileConnectUrl(
        (process.env.NEXT_ENV === "development"
          ? "http://localhost:3000/dashboard"
          : "https://auto-commenter.vercel.app/") + successUrl,
        (process.env.NEXT_ENV === "development"
          ? "http://localhost:3000/dashboard"
          : "https://auto-commenter.vercel.app/") + cancelUrl,
        true,
        user?.user.id
      );

      redirectToPath(a.url);
    } else {
      await fuckUnipile(accessToken, userAgent, unipileId!);
    }
    isFormSubmitted(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm">No Linkedin account connected</p>
        <div className="flex items-center space-x-2">
          <p className="text-xs text-muted-foreground">
            How to get your Linkedin access token
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setIsDialogOpen(true)}
            aria-label="Informations sur l'access token"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter your Linkedin access token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Your token is stored securely and is only used for authorized
            actions.
          </p>
        </div>
        <Button
          type="submit"
          className="w-full bg-[#0A66C2] hover:bg-[#004182]"
          disabled={!accessToken.trim() || formSubmitted}
        >
          {formSubmitted ? "Connecting..." : "Connect my LinkedIn account"}
        </Button>
      </form>

      <LinkedInTokenInfoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
