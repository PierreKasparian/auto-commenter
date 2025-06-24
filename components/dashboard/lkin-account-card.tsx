import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin } from "lucide-react";
import { getUnipileConnectUrl } from "@/utils/unipile/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getStatusRedirect,
  getErrorRedirect,
  toastErrorPop,
} from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { LinkedInConnectForm } from "./lkin-form";

export async function LinkedInAccountCard({
  unipileId,
  isConnected,
}: {
  unipileId: string | null;
  isConnected: boolean;
}) {
  let url;
  const cancelUrl = getErrorRedirect("/dashboard", "Connection issued");
  const successUrl = getStatusRedirect(
    "/dashboard",
    "Success",
    "Connection successful"
  );
  if (!unipileId) {
    console.log("full connection");
    const supabase = await createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      console.log("No user");
      toastErrorPop("No user", "No user found");
      return;
    }
    // await linkedinConnect(accessToken, userAgent)
    url = await getUnipileConnectUrl(
      (process.env.NEXT_ENV === "development"
        ? "http://localhost:3000"
        : "https://auto-commenter.vercel.app") + successUrl,
      (process.env.NEXT_ENV === "development"
        ? "http://localhost:3000"
        : "https://auto-commenter.vercel.app") + cancelUrl,
      true,
      user?.user.id
    );
  } else if (!isConnected) {
    console.log("recconection");
    url = await getUnipileConnectUrl(
      (process.env.NEXT_ENV === "development"
        ? "http://localhost:3000"
        : "https://auto-commenter.vercel.app") + successUrl,
      (process.env.NEXT_ENV === "development"
        ? "http://localhost:3000"
        : "https://auto-commenter.vercel.app") + cancelUrl,
      false,
      unipileId!
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Linkedin className="h-5 w-5 mr-2 text-[#0A66C2]" />
          LinkedIn Account
        </CardTitle>
        <CardDescription>
          Manage the LinkedIn account used for automatic comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unipileId && isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={"/placeholder.svg"} alt={"LinkedIn"} />
                <AvatarFallback className="bg-[#0A66C2] text-white">
                  {"LinkedIn"
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">You&apos;re connected</p>
                {/* <p className="text-sm text-muted-foreground">
                  You can disconnect when you want
                </p> */}
              </div>
            </div>
            {/* <Button variant="outline" size="sm" >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button> */}
          </div>
        ) : (
          !url ? (
            <LinkedInConnectForm
              unipileId={unipileId}
              reconnectForTrial={!url && !!unipileId}
            />
          ) :
          <Link href={url}>
            <Button>Connect</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
