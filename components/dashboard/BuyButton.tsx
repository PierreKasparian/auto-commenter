"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { redirect } from "next/navigation";
const BuyButton = ({ user_id, credits }: { user_id: string, credits: number }) => {
  const handleClick = async () => {
    const response = await fetch(
      `/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user_id,
          credits: credits,
        }),
      }
    );
    const { paymentUrl } = await response.json();
    console.log(paymentUrl);
    redirect(paymentUrl);
  };
  return (
    <Button className="w-full" variant="outline" onClick={handleClick}>
      <CreditCard className="mr-2 h-4 w-4" /> Buy now
    </Button>
  );
};

export default BuyButton;
