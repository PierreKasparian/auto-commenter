"use server"
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function handleSubscriptionDeleted(event: Stripe.Event) {


    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;
    
    console.log(JSON.stringify(event));
    console.log("customerId", customerId);
    const supabase = await createClient(); // No need to await here
    console.log(    await supabase
        .from("unipile_id")
        .select()
        .eq("customer_id", customerId))
    const { data: data_select_credits, error: error_select_credits } =
    await supabase
      .from("unipile_id")
      .update({ com_per_day_max: 0, end_trial: new Date() })
      .eq("customer_id", customerId)
      .select();
    console.log("data_select_credits", data_select_credits);
    // if (error_select_credits || !data_select_credits) {
        
}
export async function handleCheckoutCompleted(event: Stripe.Event) {
    console.log("dedans");
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("session", session);
      const customerId = session.customer as string;
      const userId = session.metadata?.user_id; // Get user_id from metadata
      if (!userId) {
        return [
          { error: "Missing user_id in metadata" },
          { status: 400 }
        ];
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const itemId = lineItems.data[0]?.price?.id;
      console.log("itemId", itemId);
      if (
        ![
          process.env.NEXT_PUBLIC_STRIPE_TARIF_90_ID,
          process.env.NEXT_PUBLIC_STRIPE_TARIF_180_ID,
          process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID,
          process.env.NEXT_PUBLIC_STRIPE_TARIF_20_ID,
        ].includes(itemId)
      ) {
        return [{ error: "Invalid plan" }, { status: 400 }];
      }
      console.log('itemId',itemId)
      const credits =
        itemId === process.env.NEXT_PUBLIC_STRIPE_TARIF_90_ID ||
        itemId === process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID
          ? 10
          : 25;
      // Update Supabase
      const supabase = await createClient(); // No need to await here
      console.log(userId)
      const { data: data_select_credits, error: error_select_credits } =
        await supabase
          .from("unipile_id")
          .update({ com_per_day_max: credits, customer_id: customerId, end_trial: null })
          .eq("user_id", userId)
          .select();
      console.log("data_select_credits", data_select_credits);
      if (error_select_credits || !data_select_credits) {
        console.dir(error_select_credits, { depth: null });
        console.error("Supabase error:", {
          message: error_select_credits.message,
          details: error_select_credits.details,
          hint: error_select_credits.hint,
          code: error_select_credits.code,
        });
        return [{ error: "Failed to update credits" }, { status: 500 }];
      }

      console.log(`Updated user ${userId} with customer ${customerId}`);
}
export async function handleSubscriptionUpdated(event: Stripe.Event) {
    console.log("dedans");
    const subscription = event.data.object as Stripe.Subscription;
    console.log("subscription", JSON.stringify(subscription));
    const customerId = subscription.customer as string;
    if (!customerId) {
      return [
        { error: "Missing customerId" },
        { status: 400 }
      ];
    }
    if (subscription.status !== "active") {
        await handleSubscriptionDeleted(event);
    }
    if (
      ![
        process.env.NEXT_PUBLIC_STRIPE_TARIF_90_ID,
        process.env.NEXT_PUBLIC_STRIPE_TARIF_180_ID,
        process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID,
        process.env.NEXT_PUBLIC_STRIPE_TARIF_20_ID,
      ].includes(subscription.items.data[0].plan.id)
    ) {
      return [{ error: "Invalid plan" }, { status: 400 }];
    }
    const credits =
        subscription.items.data[0].plan.id === process.env.NEXT_PUBLIC_STRIPE_TARIF_90_ID ||
        subscription.items.data[0].plan.id === process.env.NEXT_PUBLIC_STRIPE_TARIF_10_ID
          ? 10
          : 25;
    // Update Supabase
    const supabase = await createClient(); // No need to await here
    console.log(customerId)
    const { data: data_select_credits } =
      await supabase
        .from("unipile_id")
        .update({ com_per_day_max: credits, end_trial: null })
        .eq("customer_id", customerId)
        .select();
    console.log("data_select_credits", data_select_credits);
    console.log(`Updated user with customer ${customerId}`);
}
