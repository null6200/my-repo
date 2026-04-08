-- Add shipping and logistics columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS logistics_company VARCHAR(100),
ADD COLUMN IF NOT EXISTS pickup_location VARCHAR(255);

-- Update existing orders to have default values
UPDATE orders 
SET shipping_cost = 0 
WHERE shipping_cost IS NULL;

UPDATE orders 
SET logistics_company = 'N/A' 
WHERE logistics_company IS NULL;

UPDATE orders 
SET pickup_location = 'N/A' 
WHERE pickup_location IS NULL;
