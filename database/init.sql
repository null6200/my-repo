-- Initialize database schema for skincare e-commerce

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    texture_shot_url TEXT,
    ph_level DECIMAL(3, 1),
    key_ingredients TEXT,
    skin_type_recommendation VARCHAR(255),
    inventory_status VARCHAR(50) DEFAULT 'In Stock',
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Processing',
    payment_status VARCHAR(50) DEFAULT 'Pending',
    paystack_reference VARCHAR(255) UNIQUE,
    order_items JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_skin_type ON products(skin_type_recommendation);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(inventory_status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(paystack_reference);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products (optional - for testing)
INSERT INTO products (name, price, description, image_url, ph_level, key_ingredients, skin_type_recommendation, inventory_status)
VALUES 
    ('Hydrating Serum', 85.00, 'A lightweight, fast-absorbing serum that delivers intense hydration with hyaluronic acid and vitamin B5.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800', 5.5, 'Hyaluronic Acid, Vitamin B5, Glycerin', 'Dry, Normal', 'In Stock'),
    ('Night Recovery Cream', 120.00, 'Rich overnight treatment that repairs and rejuvenates skin while you sleep with retinol and peptides.', 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800', 6.0, 'Retinol, Peptides, Ceramides', 'All Skin Types', 'In Stock'),
    ('Daily Protection SPF 50', 65.00, 'Broad-spectrum sunscreen with antioxidants that protects against UV damage and environmental stressors.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', 6.5, 'Zinc Oxide, Vitamin E, Green Tea Extract', 'All Skin Types', 'In Stock'),
    ('Gentle Cleansing Gel', 45.00, 'pH-balanced cleanser that removes impurities without stripping natural oils, perfect for sensitive skin.', 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800', 5.5, 'Aloe Vera, Chamomile, Glycerin', 'Sensitive, Dry', 'In Stock'),
    ('Vitamin C Brightening Serum', 95.00, 'Potent antioxidant serum that brightens skin tone and reduces dark spots with stabilized vitamin C.', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800', 3.5, 'Vitamin C, Ferulic Acid, Vitamin E', 'Oily, Combination', 'In Stock')
ON CONFLICT DO NOTHING;
