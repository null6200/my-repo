import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';

export const GET: APIRoute = async () => {
  try {
    const result = await query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    return new Response(JSON.stringify({ items: result.rows }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch orders' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      state,
      country,
      postal_code,
      total_amount,
      order_status,
      payment_status,
      paystack_reference,
      order_items,
    } = body;

    const result = await query(
      `INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        shipping_address, city, state, country, postal_code,
        total_amount, order_status, payment_status,
        paystack_reference, order_items
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        city,
        state,
        country,
        postal_code,
        total_amount,
        order_status || 'Processing',
        payment_status || 'Pending',
        paystack_reference,
        JSON.stringify(order_items),
      ]
    );

    const order = result.rows[0];

    // Send order confirmation email (don't block response if email fails)
    sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: customer_name,
      customerEmail: customer_email,
      orderItems: order_items,
      totalAmount: total_amount,
      shippingAddress: shipping_address,
      city,
      state,
      country,
      orderDate: order.created_at,
      paystackReference: paystack_reference,
    }).catch((error) => {
      console.error('Failed to send order confirmation email:', error);
    });

    return new Response(JSON.stringify(order), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create order' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
