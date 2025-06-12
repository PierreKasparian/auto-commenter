import { NextResponse } from "next/server";
import Stripe from "stripe";
import { handleCheckoutCompleted,handleSubscriptionDeleted } from "@/utils/stripe/webhooks";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    // Read the raw body once
    const bodyBuffer = await request.arrayBuffer();
    // const bodyJson = await request.json();
    const body = Buffer.from(bodyBuffer).toString("utf-8");
    // Get signature from headers
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      // console.log("body", body);
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      // console.log("event", event);
    } catch (err: unknown) {
      console.log("Error in constructEvent", err);
      return NextResponse.json(
        { error: `Webhook Error: ${(err as Error).message}` },
        { status: 400 }
      );
    }
    console.log("event.type",event.type)
    if (event.type === "checkout.session.completed") {
        await handleCheckoutCompleted(event);
    }else if (event.type === "customer.subscription.deleted") {
        console.log("deleted")
        await handleSubscriptionDeleted(event);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: `Internal server error: ${(err as Error).message}` },
      { status: 500 }
    );
  }
}
