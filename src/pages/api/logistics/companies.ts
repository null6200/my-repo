import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const prerender = false;

// GET all logistics companies
export const GET: APIRoute = async () => {
  try {
    const result = await query(
      'SELECT * FROM logistics_companies ORDER BY name ASC'
    );

    return new Response(JSON.stringify({ companies: result.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching logistics companies:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch companies' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST create new company
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, code, base_price, is_active } = body;

    const result = await query(
      `INSERT INTO logistics_companies (name, code, base_price, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, code, base_price || 0, is_active !== false]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating company:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create company' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT update company
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, name, code, base_price, is_active } = body;

    const result = await query(
      `UPDATE logistics_companies 
       SET name = $1, code = $2, base_price = $3, is_active = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, code, base_price, is_active, id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Company not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating company:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update company' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE company
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    const result = await query(
      'DELETE FROM logistics_companies WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Company not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting company:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete company' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
