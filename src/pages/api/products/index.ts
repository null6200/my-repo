import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async () => {
  try {
    const result = await query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );

    // Map database schema to Wix schema for frontend compatibility
    const mappedProducts = result.rows.map((product: any) => ({
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
      stockQuantity: product.stock_quantity || 0,
      _createdDate: product.created_at,
      _updatedDate: product.updated_at,
    }));

    return new Response(JSON.stringify({ items: mappedProducts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch products' }),
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
      name,
      price,
      description,
      image_url,
      texture_shot_url,
      ph_level,
      key_ingredients,
      skin_type_recommendation,
      inventory_status,
      stock_quantity,
    } = body;

    const result = await query(
      `INSERT INTO products (
        name, price, description, image_url, texture_shot_url,
        ph_level, key_ingredients, skin_type_recommendation, inventory_status, stock_quantity
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        inventory_status || 'In Stock',
        stock_quantity || 0,
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create product' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
