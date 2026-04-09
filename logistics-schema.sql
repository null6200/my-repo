-- Logistics Companies Table
CREATE TABLE IF NOT EXISTS logistics_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pickup Locations Table
CREATE TABLE IF NOT EXISTS pickup_locations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES logistics_companies(id) ON DELETE CASCADE,
  state VARCHAR(100) NOT NULL,
  location_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pickup_locations_company ON pickup_locations(company_id);
CREATE INDEX IF NOT EXISTS idx_pickup_locations_state ON pickup_locations(state);
CREATE INDEX IF NOT EXISTS idx_logistics_companies_code ON logistics_companies(code);

-- Insert initial logistics companies
INSERT INTO logistics_companies (name, code, base_price, is_active) VALUES
  ('GUO Transport', 'GUO', 2500.00, true),
  ('GIG Logistics', 'GIG', 2000.00, true),
  ('ABC Transport', 'ABC', 1800.00, true),
  ('PARK Logistics', 'PARK', 2200.00, true)
ON CONFLICT (code) DO NOTHING;
