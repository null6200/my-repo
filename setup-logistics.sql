-- Complete Logistics Management Setup
-- Run this file to create tables, add companies, and seed PARK locations

-- Create logistics tables
CREATE TABLE IF NOT EXISTS logistics_companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_pickup_locations_company ON pickup_locations(company_id);
CREATE INDEX IF NOT EXISTS idx_pickup_locations_state ON pickup_locations(state);
CREATE INDEX IF NOT EXISTS idx_logistics_companies_code ON logistics_companies(code);

-- Insert logistics companies
INSERT INTO logistics_companies (name, code, base_price, is_active) VALUES
  ('GUO Transport', 'GUO', 2500.00, true),
  ('GIG Logistics', 'GIG', 2000.00, true),
  ('ABC Transport', 'ABC', 1800.00, true),
  ('PARK Logistics', 'PARK', 2200.00, true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  base_price = EXCLUDED.base_price,
  is_active = EXCLUDED.is_active;

-- Seed PARK Logistics locations
DO $$
DECLARE
  park_id INTEGER;
BEGIN
  SELECT id INTO park_id FROM logistics_companies WHERE code = 'PARK';
  
  -- Delete existing PARK locations to avoid duplicates
  DELETE FROM pickup_locations WHERE company_id = park_id;
  
  -- Lagos locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Lagos', 'Ikeja Terminal', '45 Obafemi Awolowo Way, Ikeja'),
    (park_id, 'Lagos', 'Oshodi Hub', '23 Oshodi-Apapa Expressway'),
    (park_id, 'Lagos', 'Lekki Office', 'Admiralty Way, Lekki Phase 1'),
    (park_id, 'Lagos', 'Surulere Branch', '78 Adeniran Ogunsanya Street'),
    (park_id, 'Lagos', 'Ikorodu Terminal', '12 Lagos Road, Ikorodu');

  -- FCT locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'FCT', 'Wuse 2 Office', 'Plot 234, Adetokunbo Ademola Crescent'),
    (park_id, 'FCT', 'Kubwa Terminal', 'Gado Nasko Road, Kubwa'),
    (park_id, 'FCT', 'Gwarinpa Hub', '5th Avenue, Gwarinpa Estate');

  -- Rivers locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Rivers', 'PHC Main Terminal', '45 Aba Road, Port Harcourt'),
    (park_id, 'Rivers', 'Eliozu Branch', 'East-West Road, Eliozu');

  -- Oyo locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Oyo', 'Ibadan Terminal', 'Challenge, Ring Road'),
    (park_id, 'Oyo', 'Bodija Office', 'UI-Bodija Road');

  -- Other major cities
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Kano', 'Kano Terminal', 'Murtala Mohammed Way, Sabon Gari'),
    (park_id, 'Kaduna', 'Kaduna Office', 'Constitution Road, Kaduna'),
    (park_id, 'Enugu', 'Enugu Terminal', 'Ogui Road, Enugu'),
    (park_id, 'Anambra', 'Onitsha Terminal', 'Upper Iweka, Onitsha'),
    (park_id, 'Anambra', 'Awka Office', 'Enugu-Onitsha Expressway, Awka'),
    (park_id, 'Abia', 'Aba Terminal', 'Asa Road, Aba'),
    (park_id, 'Abia', 'Umuahia Office', 'Bende Road, Umuahia'),
    (park_id, 'Delta', 'Asaba Terminal', 'Nnebisi Road, Asaba'),
    (park_id, 'Edo', 'Benin Terminal', 'Sapele Road, Benin City'),
    (park_id, 'Imo', 'Owerri Terminal', 'Wetheral Road, Owerri'),
    (park_id, 'Akwa Ibom', 'Uyo Office', 'Ikot Ekpene Road, Uyo'),
    (park_id, 'Cross River', 'Calabar Terminal', 'Murtala Mohammed Highway, Calabar'),
    (park_id, 'Plateau', 'Jos Office', 'Bauchi Road, Jos'),
    (park_id, 'Benue', 'Makurdi Terminal', 'Gboko Road, Makurdi'),
    (park_id, 'Osun', 'Osogbo Office', 'Gbongan Road, Osogbo'),
    (park_id, 'Ondo', 'Akure Terminal', 'Oba Adesida Road, Akure'),
    (park_id, 'Ekiti', 'Ado-Ekiti Office', 'Iworoko Road, Ado-Ekiti'),
    (park_id, 'Kwara', 'Ilorin Terminal', 'Taiwo Road, Ilorin'),
    (park_id, 'Ogun', 'Abeokuta Office', 'Ibara, Abeokuta'),
    (park_id, 'Ogun', 'Sagamu Terminal', 'Lagos-Ibadan Expressway, Sagamu');

END $$;
