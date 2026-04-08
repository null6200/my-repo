import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    const result = await query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const row = result.rows[0];
    const order = {
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
      country: row.country,
      postalCode: row.postal_code,
      shippingAddress: row.shipping_address,
      status: row.order_status,
      paymentStatus: row.payment_status,
      paystackReference: row.paystack_reference,
      createdAt: row.created_at,
    };

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch order' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return new Response(
        JSON.stringify({ error: 'Status is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const result = await query(
      'UPDATE orders SET order_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log(`✅ Order ${id.slice(0, 8)} status updated to: ${status}`);

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update order' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
