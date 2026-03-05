import type { APIRoute } from 'astro';
import { query } from '@/lib/db';

export const GET: APIRoute = async () => {
  try {
    // Comprehensive product catalog with images for all categories
    const sampleProducts = [
      // SERUMS Category
      {
        name: 'Vitamin C Brightening Serum',
        price: 12500,
        description: 'A powerful vitamin C serum that brightens and evens skin tone. Formulated with 10% pure vitamin C and hyaluronic acid for radiant, glowing skin.',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Vitamin C 10%, Hyaluronic Acid, Vitamin E',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Niacinamide 10% + Zinc Serum',
        price: 8500,
        description: 'Reduces appearance of pores and blemishes. Perfect for oily and combination skin. Balances oil production and improves skin texture.',
        image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
        ph_level: 6.0,
        key_ingredients: 'Niacinamide 10%, Zinc PCA 1%',
        skin_type_recommendation: 'Oily, Combination',
        inventory_status: 'In Stock'
      },
      {
        name: 'Retinol Night Renewal Serum',
        price: 15000,
        description: 'Advanced anti-aging formula with encapsulated retinol for smoother, firmer skin. Reduces fine lines and wrinkles while you sleep.',
        image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
        ph_level: 6.2,
        key_ingredients: 'Retinol 0.5%, Peptides, Squalane',
        skin_type_recommendation: 'Normal, Dry',
        inventory_status: 'In Stock'
      },
      {
        name: 'Hyaluronic Acid Hydration Serum',
        price: 11000,
        description: 'Multi-molecular weight hyaluronic acid penetrates deep to hydrate all skin layers. Plumps and smooths for a youthful appearance.',
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        ph_level: 5.8,
        key_ingredients: 'Hyaluronic Acid, Glycerin, Panthenol',
        skin_type_recommendation: 'Dry, Normal, All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Peptide Firming Serum',
        price: 16500,
        description: 'Advanced peptide complex that firms and lifts skin. Boosts collagen production for visibly younger-looking skin.',
        image_url: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500&h=500&fit=crop',
        ph_level: 6.0,
        key_ingredients: 'Matrixyl 3000, Argireline, Copper Peptides',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },

      // SUNSCREEN Category
      {
        name: 'Mineral Sunscreen SPF 50+ PA++++',
        price: 10500,
        description: 'Broad spectrum mineral protection with zinc oxide. Lightweight, non-greasy finish perfect for daily use. No white cast.',
        image_url: 'https://images.unsplash.com/photo-1556228852-80a5a1a6c4c6?w=500&h=500&fit=crop',
        ph_level: 6.5,
        key_ingredients: 'Zinc Oxide 20%, Titanium Dioxide, Vitamin E',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Invisible UV Shield SPF 50',
        price: 9500,
        description: 'Ultra-light chemical sunscreen that absorbs instantly. Water-resistant for 80 minutes. Perfect under makeup.',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
        ph_level: 6.0,
        key_ingredients: 'Avobenzone, Octinoxate, Niacinamide',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Tinted Sunscreen SPF 45',
        price: 12000,
        description: 'Multitasking tinted sunscreen evens skin tone while protecting. Available in 3 shades for natural coverage.',
        image_url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=500&fit=crop',
        ph_level: 6.2,
        key_ingredients: 'Zinc Oxide, Iron Oxides, Vitamin C',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },

      // BODY WASH Category
      {
        name: 'Hydrating Coconut Body Wash',
        price: 6500,
        description: 'Creamy coconut body wash that cleanses without stripping. Leaves skin soft, smooth, and delicately scented.',
        image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Coconut Oil, Shea Butter, Glycerin',
        skin_type_recommendation: 'Dry, Normal',
        inventory_status: 'In Stock'
      },
      {
        name: 'Exfoliating Coffee Body Scrub Wash',
        price: 7500,
        description: 'Energizing coffee scrub wash that buffs away dead skin. Improves circulation and reveals smoother, brighter skin.',
        image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
        ph_level: 5.8,
        key_ingredients: 'Coffee Extract, Walnut Shell, Vitamin E',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Gentle Oat Milk Body Wash',
        price: 6000,
        description: 'Soothing oat milk formula for sensitive skin. Fragrance-free and hypoallergenic. Calms irritation and redness.',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Oat Milk, Colloidal Oatmeal, Ceramides',
        skin_type_recommendation: 'Sensitive, Dry',
        inventory_status: 'In Stock'
      },

      // FACE Category
      {
        name: 'Alpha Arbutin Brightening Cream',
        price: 11000,
        description: 'Targets dark spots and hyperpigmentation for a more even complexion. Gentle yet effective brightening treatment.',
        image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Alpha Arbutin 2%, Kojic Acid, Vitamin C',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Centella Calming Face Gel',
        price: 7500,
        description: 'Soothing gel for sensitive and irritated skin. Reduces redness and inflammation instantly. Perfect for post-treatment care.',
        image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Centella Asiatica 80%, Aloe Vera, Green Tea',
        skin_type_recommendation: 'Sensitive, All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Glycolic Acid Exfoliating Toner',
        price: 9000,
        description: 'Gentle chemical exfoliant that reveals brighter, smoother skin. Use 2-3 times weekly for best results.',
        image_url: 'https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=500&h=500&fit=crop',
        ph_level: 3.8,
        key_ingredients: 'Glycolic Acid 7%, Aloe Vera, Ginseng',
        skin_type_recommendation: 'Normal, Oily',
        inventory_status: 'In Stock'
      },
      {
        name: 'Ceramide Barrier Repair Cream',
        price: 13500,
        description: 'Rich moisturizer that repairs and strengthens skin barrier. Locks in moisture for 24-hour hydration.',
        image_url: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=500&fit=crop',
        ph_level: 5.8,
        key_ingredients: 'Ceramides, Cholesterol, Fatty Acids',
        skin_type_recommendation: 'Dry, Sensitive',
        inventory_status: 'In Stock'
      },
      {
        name: 'Tea Tree Oil Control Gel',
        price: 8000,
        description: 'Lightweight gel that controls excess oil and prevents breakouts. Perfect for acne-prone skin.',
        image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Tea Tree Oil 5%, Salicylic Acid, Niacinamide',
        skin_type_recommendation: 'Oily, Combination',
        inventory_status: 'In Stock'
      },

      // BODY LOTIONS Category
      {
        name: 'Shea Butter Body Lotion',
        price: 8500,
        description: 'Ultra-rich body lotion with pure shea butter. Deeply nourishes and softens even the driest skin.',
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
        ph_level: 5.8,
        key_ingredients: 'Shea Butter 25%, Cocoa Butter, Vitamin E',
        skin_type_recommendation: 'Dry, Very Dry',
        inventory_status: 'In Stock'
      },
      {
        name: 'Vitamin E Glow Body Lotion',
        price: 7500,
        description: 'Lightweight lotion that absorbs quickly. Leaves skin glowing and radiant with vitamin E and natural oils.',
        image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop',
        ph_level: 6.0,
        key_ingredients: 'Vitamin E, Jojoba Oil, Almond Oil',
        skin_type_recommendation: 'Normal, Dry',
        inventory_status: 'In Stock'
      },
      {
        name: 'Collagen Firming Body Lotion',
        price: 10500,
        description: 'Anti-aging body lotion with collagen and peptides. Firms and tightens skin for a more youthful appearance.',
        image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=500&fit=crop',
        ph_level: 5.8,
        key_ingredients: 'Hydrolyzed Collagen, Peptides, Retinol',
        skin_type_recommendation: 'All Skin Types',
        inventory_status: 'In Stock'
      },
      {
        name: 'Aloe Vera Soothing Body Lotion',
        price: 6500,
        description: 'Cooling aloe vera lotion perfect for after-sun care. Calms and hydrates irritated skin instantly.',
        image_url: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500&h=500&fit=crop',
        ph_level: 5.5,
        key_ingredients: 'Aloe Vera 70%, Cucumber Extract, Chamomile',
        skin_type_recommendation: 'Sensitive, All Skin Types',
        inventory_status: 'In Stock'
      }
    ];

    // Insert sample products
    let insertedCount = 0;
    for (const product of sampleProducts) {
      const result = await query(
        `INSERT INTO products (name, price, description, image_url, ph_level, key_ingredients, skin_type_recommendation, inventory_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (name) DO NOTHING
         RETURNING id`,
        [
          product.name,
          product.price,
          product.description,
          product.image_url,
          product.ph_level,
          product.key_ingredients,
          product.skin_type_recommendation,
          product.inventory_status
        ]
      );
      if (result.rows.length > 0) insertedCount++;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully seeded ${insertedCount} new products (${sampleProducts.length} total products in seed data)`,
        categories: {
          serums: 5,
          sunscreen: 3,
          bodyWash: 3,
          face: 5,
          bodyLotions: 4
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Seed error:', error);
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
