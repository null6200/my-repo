-- Add stock_quantity column to existing products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- Update existing products to have default stock quantity
UPDATE products SET stock_quantity = 0 WHERE stock_quantity IS NULL;
