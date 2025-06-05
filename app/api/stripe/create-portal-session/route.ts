import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!);

export async function POST(request:Request) {
  try {
    const body = await request.json();
    const {user_id} = body;
    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const supabase = await createClient();
    const {data: customer_id } = await supabase.from('unipile_id').select('customer_id').eq('user_id', user_id).single();
    if (!customer_id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customer_id.customer_id,
      return_url: `${request.headers.get('origin')}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating portal session' }, { status: 500 });
  }
}