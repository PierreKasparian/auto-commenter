"use client";
import React from "react";
import type { ClassValue } from "clsx";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { CreditAmount } from "@/types";
import { redirectToPath } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";
import { getUnipileId } from "@/utils/supabase/queries";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);



const priceMap: Record<CreditAmount, string> = {
  1: process.env.NEXT_PUBLIC_STRIPE_TARIF_1_ID!,
  10: process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID!,
  20: process.env.NEXT_PUBLIC_STRIPE_TARIF_20_ID!,
  90: process.env.NEXT_PUBLIC_STRIPE_TARIF_90_ID!,
  180: process.env.NEXT_PUBLIC_STRIPE_TARIF_180_ID!,
};

const BuyButton = ({ credits,className }: { credits: CreditAmount,className?:ClassValue }) => {


  const handleClick = async () => {
    if (!(await getUnipileId())){
      redirectToPath(getErrorRedirect("/dashboard","You need to connect to your linkedin account to buy credits"))
      return;
    }
    console.log("tarif",process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID)
    console.log(priceMap[credits])
    const stripe = await stripePromise;

    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    //si l'utilisateur n'est pas co a son linkedin on le renvoie au dashboard
    const { sessionId } = await fetch(
      `/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId :priceMap[credits],user_id:user.data.user?.id }),
      }
    ).then(res => res.json());
    const result = await stripe?.redirectToCheckout({ sessionId });
    if (result?.error) {
      redirectToPath(getErrorRedirect("/dashboard",result.error.message??"Error checkout, contact ia.school.app@gmail.com"))
    }
  };
  return (
    <Button className={`w-full ${className}`} variant="outline" onClick={handleClick}>
      <CreditCard className="mr-2 h-4 w-4" /> Buy now
    </Button>
  );
};

export default BuyButton;
