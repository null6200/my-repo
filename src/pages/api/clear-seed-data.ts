import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

/**
 * PRODUCTION CLEANUP ENDPOINT
 * 
 * This endpoint removes all seeded/test products from the database.
 * Use this when you're ready to add your real products.
 * 
 * WARNING: This will delete ALL products from the database!
 * 
 * Usage: Visit http://localhost:4321/api/clear-seed-data
 * Or in production: https://yourdomain.com/api/clear-seed-data
 * 
 * For safety, you can also run this SQL command directly:
 * docker exec skincare-ecommerce-db psql -U skincare_user -d skincare_ecommerce -c "DELETE FROM products;"
 */

export const GET: APIRoute = async () => {
  try {
    // Get count before deletion
    const beforeCount = await query('SELECT COUNT(*) as count FROM products');
    const productsCount = beforeCount.rows[0].count;

    // Delete all products
    await query('DELETE FROM products');

    // Reset the sequence for product IDs (optional - starts IDs from 1 again)
    await query('ALTER SEQUENCE products_id_seq RESTART WITH 1');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully deleted ${productsCount} products from database`,
        note: 'Database is now empty and ready for your real products'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Clear data error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

/**
 * Alternative: DELETE specific seeded products by name pattern
 * Uncomment this if you want to keep some products and only delete seeded ones
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { deletePattern } = body;

    if (!deletePattern) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Please provide a deletePattern in the request body' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete products matching a pattern (e.g., names containing certain words)
    const result = await query(
      'DELETE FROM products WHERE name ILIKE $1 RETURNING *',
      [`%${deletePattern}%`]
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Deleted ${result.rows.length} products matching pattern: ${deletePattern}`,
        deletedProducts: result.rows.map(p => p.name)
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Clear data error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
