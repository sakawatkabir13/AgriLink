// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user?.email) throw new Error("User not authenticated");
    const user = userData.user;

    const { items, deliveryCharge, region } = await req.json();

    if (!items || items.length === 0) throw new Error("Cart is empty");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Build line items from cart
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "bdt",
        product_data: {
          name: item.name,
          description: `${item.region} • ${item.isWholesale ? "Wholesale" : "Retail"} • ${item.unit}`,
        },
        unit_amount: Math.round(item.unitPrice * 100), // Convert to paisa
      },
      quantity: item.quantity,
    }));

    // Add delivery charge if applicable
    if (deliveryCharge > 0) {
      lineItems.push({
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Delivery Charge",
            description: `Delivery to ${region}`,
          },
          unit_amount: Math.round(deliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    // Create order in database
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.unitPrice * item.quantity,
      0
    ) + deliveryCharge;

    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        buyer_id: user.id,
        total_amount: totalAmount,
        delivery_charge: deliveryCharge,
        region: region || "Dhaka",
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      is_wholesale: item.isWholesale,
    }));

    await supabaseClient.from("order_items").insert(orderItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?order_id=${order.id}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: { order_id: order.id },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
