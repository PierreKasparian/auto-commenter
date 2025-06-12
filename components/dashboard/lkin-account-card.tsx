import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LinkedInConnectForm } from "./lkin-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin } from "lucide-react";
import { getUnipileReconnectUrl } from "@/utils/unipile/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function LinkedInAccountCard({
  unipileId,
  isConnected,
}: {
  unipileId: string | null;
  isConnected: boolean;
}) {
  let url;
  if (!isConnected) {
    url = await getUnipileReconnectUrl(unipileId!);
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
                <p className="text-sm text-muted-foreground">
                  You can disconnect when you want
                </p>
              </div>
            </div>
            {/* <Button variant="outline" size="sm" >
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </Button> */}
          </div>
        ) : !unipileId || (!url) ? (
          <LinkedInConnectForm reconnectForTrial={!url}/>
        ) : (
          <Link href={url}>
            <Button>Reconnect</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
