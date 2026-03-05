import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const result = await query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Map database schema to Wix schema for frontend compatibility
    const product = result.rows[0];
    const mappedProduct = {
      _id: product.id,
      itemName: product.name,
      itemPrice: product.price,
      itemImage: product.image_url,
      itemDescription: product.description,
      textureShot: product.texture_shot_url,
      phLevel: product.ph_level,
      keyIngredients: product.key_ingredients,
      skinTypeRecommendation: product.skin_type_recommendation,
      inventoryStatus: product.inventory_status,
      _createdDate: product.created_at,
      _updatedDate: product.updated_at,
    };

    return new Response(JSON.stringify(mappedProduct), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch product' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      price,
      description,
      image_url,
      texture_shot_url,
      ph_level,
      key_ingredients,
      skin_type_recommendation,
      inventory_status,
    } = body;

    const result = await query(
      `UPDATE products SET
        name = $1, price = $2, description = $3, image_url = $4,
        texture_shot_url = $5, ph_level = $6, key_ingredients = $7,
        skin_type_recommendation = $8, inventory_status = $9
      WHERE id = $10
      RETURNING *`,
      [
        name,
        price,
        description,
        image_url,
        texture_shot_url,
        ph_level,
        key_ingredients,
        skin_type_recommendation,
        inventory_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update product' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const result = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete product' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
