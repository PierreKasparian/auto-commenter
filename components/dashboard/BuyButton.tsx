"use client";
import React from "react";
import type { ClassValue } from "clsx";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
// import { createClient } from "@/utils/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { CreditAmount } from "@/types";
import { redirectToPath } from "@/utils/supabase/server";
import { getErrorRedirect } from "@/utils/helpers";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY!);



const priceMap: Record<CreditAmount, string> = {
  10: process.env.NEXT_PUBLIC_STRIPE_TEST_TARIF_10_ID!,
  20: process.env.NEXT_PUBLIC_STRIPE_TEST_TARIF_20_ID!,
  90: process.env.NEXT_PUBLIC_STRIPE_TEST_TARIF_90_ID!,
  180: process.env.NEXT_PUBLIC_STRIPE_TEST_TARIF_180_ID!,
};

const BuyButton = ({ credits,className }: { credits: CreditAmount,className?:ClassValue }) => {


  const handleClick = async () => {
    console.log("tarif",process.env.NEXT_PUBLIC_STRIPE_TEST_TARIF_10_ID)
    console.log(priceMap[credits])
    const stripe = await stripePromise;

    // const supabase = await createClient();
    // const user = await supabase.auth.getUser();
    const { sessionId } = await fetch(
      `/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId :priceMap[credits] }),
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
