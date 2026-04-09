import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const prerender = false;

// GET all pickup locations (optionally filter by company_id or state)
export const GET: APIRoute = async ({ url }) => {
  try {
    const companyId = url.searchParams.get('company_id');
    const state = url.searchParams.get('state');

    let queryText = `
      SELECT pl.*, lc.name as company_name, lc.code as company_code
      FROM pickup_locations pl
      JOIN logistics_companies lc ON pl.company_id = lc.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (companyId) {
      params.push(companyId);
      queryText += ` AND pl.company_id = $${params.length}`;
    }

    if (state) {
      params.push(state);
      queryText += ` AND pl.state = $${params.length}`;
    }

    queryText += ' ORDER BY lc.name, pl.state, pl.location_name';

    const result = await query(queryText, params);

    return new Response(JSON.stringify({ locations: result.rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching pickup locations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch locations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST create new location
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { company_id, state, location_name, address, is_active } = body;

    const result = await query(
      `INSERT INTO pickup_locations (company_id, state, location_name, address, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [company_id, state, location_name, address, is_active !== false]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating location:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create location' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT update location
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { id, company_id, state, location_name, address, is_active } = body;

    const result = await query(
      `UPDATE pickup_locations 
       SET company_id = $1, state = $2, location_name = $3, address = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [company_id, state, location_name, address, is_active, id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating location:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update location' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE location
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const { id } = await request.json();

    const result = await query(
      'DELETE FROM pickup_locations WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting location:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete location' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
