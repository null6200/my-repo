import type { APIRoute } from 'astro';
import { query } from '@/lib/db';
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email';

export const GET: APIRoute = async () => {
  try {
    const result = await query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );

    // Transform database rows to match admin panel format
    const orders = result.rows.map(row => ({
      id: row.id,
      orderNumber: row.id.slice(0, 13).toUpperCase(),
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      items: typeof row.order_items === 'string' ? JSON.parse(row.order_items) : row.order_items,
      total: parseFloat(row.total_amount),
      shippingCost: parseFloat(row.shipping_cost || 0),
      logistics: row.logistics_company || 'N/A',
      pickupLocation: row.pickup_location || 'N/A',
      state: row.state,
      city: row.city,
      shippingAddress: row.shipping_address,
      status: row.order_status,
      paymentStatus: row.payment_status,
      paystackReference: row.paystack_reference,
      createdAt: row.created_at,
    }));

    return new Response(JSON.stringify({ orders }), {
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
      shipping_cost,
      logistics_company,
      pickup_location,
      order_status,
      payment_status,
      paystack_reference,
      order_items,
    } = body;

    const result = await query(
      `INSERT INTO orders (
        customer_name, customer_email, customer_phone,
        shipping_address, city, state, country, postal_code,
        total_amount, shipping_cost, logistics_company, pickup_location,
        order_status, payment_status,
        paystack_reference, order_items
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
        shipping_cost || 0,
        logistics_company || 'N/A',
        pickup_location || 'N/A',
        order_status || 'Processing',
        payment_status || 'Pending',
        paystack_reference,
        JSON.stringify(order_items),
      ]
    );

    const order = result.rows[0];

    // Decrement inventory for ordered items
    try {
      for (const item of order_items) {
        await query(
          `UPDATE products 
           SET stock_quantity = GREATEST(stock_quantity - $1, 0),
               inventory_status = CASE 
                 WHEN stock_quantity - $1 <= 0 THEN 'Out of Stock'
                 WHEN stock_quantity - $1 <= 5 THEN 'Low Stock'
                 ELSE inventory_status
               END
           WHERE id = $2`,
          [item.quantity, item.id]
        );
        console.log(`✅ Decremented stock for ${item.name}: -${item.quantity}`);
      }
    } catch (inventoryError) {
      console.error('Failed to update inventory:', inventoryError);
      // Don't fail the order if inventory update fails
    }

    // Send order confirmation email (don't block response if email fails)
    sendOrderConfirmationEmail({
      orderId: order.id,
      customerName: customer_name,
      customerEmail: customer_email,
      customerPhone: customer_phone,
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

    // Send admin notification email
    sendAdminOrderNotification({
      orderId: order.id,
      customerName: customer_name,
      customerEmail: customer_email,
      customerPhone: customer_phone,
      orderItems: order_items,
      totalAmount: total_amount,
      shippingAddress: shipping_address,
      city,
      state,
      country,
      orderDate: order.created_at,
      paystackReference: paystack_reference,
    }).catch((error) => {
      console.error('Failed to send admin notification email:', error);
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
