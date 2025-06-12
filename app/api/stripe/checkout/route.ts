import { getStatusRedirect, getErrorRedirect } from "@/utils/helpers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { priceId,user_id } = await request.json();
  // console.log(priceId)
  try {
    const successUrl = getStatusRedirect("/dashboard","Success","Subscription successful");
    const cancelUrl = getErrorRedirect("/dashboard","Subscription cancelled");
    console.log(`${request.headers.get('origin')}/${successUrl}`)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user_id,
      },
      success_url: `${request.headers.get('origin')}${successUrl}`,
      cancel_url: `${request.headers.get('origin')}${cancelUrl}`,
    });
    console.log(session)
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating checkout session' }, { status: 500 });
  }
}