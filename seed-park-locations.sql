-- Seed PARK Logistics pickup locations across Nigeria
-- Get PARK company ID
DO $$
DECLARE
  park_id INTEGER;
BEGIN
  SELECT id INTO park_id FROM logistics_companies WHERE code = 'PARK';
  
  -- Lagos locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Lagos', 'Ikeja Terminal', '45 Obafemi Awolowo Way, Ikeja'),
    (park_id, 'Lagos', 'Oshodi Hub', '23 Oshodi-Apapa Expressway'),
    (park_id, 'Lagos', 'Lekki Office', 'Admiralty Way, Lekki Phase 1'),
    (park_id, 'Lagos', 'Surulere Branch', '78 Adeniran Ogunsanya Street'),
    (park_id, 'Lagos', 'Ikorodu Terminal', '12 Lagos Road, Ikorodu');

  -- FCT (Abuja) locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'FCT', 'Wuse 2 Office', 'Plot 234, Adetokunbo Ademola Crescent'),
    (park_id, 'FCT', 'Kubwa Terminal', 'Gado Nasko Road, Kubwa'),
    (park_id, 'FCT', 'Gwarinpa Hub', '5th Avenue, Gwarinpa Estate');

  -- Rivers (Port Harcourt) locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Rivers', 'PHC Main Terminal', '45 Aba Road, Port Harcourt'),
    (park_id, 'Rivers', 'Eliozu Branch', 'East-West Road, Eliozu');

  -- Oyo (Ibadan) locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Oyo', 'Ibadan Terminal', 'Challenge, Ring Road'),
    (park_id, 'Oyo', 'Bodija Office', 'UI-Bodija Road');

  -- Kano location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Kano', 'Kano Terminal', 'Murtala Mohammed Way, Sabon Gari');

  -- Kaduna location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Kaduna', 'Kaduna Office', 'Constitution Road, Kaduna');

  -- Enugu location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Enugu', 'Enugu Terminal', 'Ogui Road, Enugu');

  -- Anambra locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Anambra', 'Onitsha Terminal', 'Upper Iweka, Onitsha'),
    (park_id, 'Anambra', 'Awka Office', 'Enugu-Onitsha Expressway, Awka');

  -- Abia locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Abia', 'Aba Terminal', 'Asa Road, Aba'),
    (park_id, 'Abia', 'Umuahia Office', 'Bende Road, Umuahia');

  -- Delta location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Delta', 'Asaba Terminal', 'Nnebisi Road, Asaba');

  -- Edo location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Edo', 'Benin Terminal', 'Sapele Road, Benin City');

  -- Imo location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Imo', 'Owerri Terminal', 'Wetheral Road, Owerri');

  -- Akwa Ibom location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Akwa Ibom', 'Uyo Office', 'Ikot Ekpene Road, Uyo');

  -- Cross River location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Cross River', 'Calabar Terminal', 'Murtala Mohammed Highway, Calabar');

  -- Plateau location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Plateau', 'Jos Office', 'Bauchi Road, Jos');

  -- Benue location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Benue', 'Makurdi Terminal', 'Gboko Road, Makurdi');

  -- Osun location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Osun', 'Osogbo Office', 'Gbongan Road, Osogbo');

  -- Ondo location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Ondo', 'Akure Terminal', 'Oba Adesida Road, Akure');

  -- Ekiti location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Ekiti', 'Ado-Ekiti Office', 'Iworoko Road, Ado-Ekiti');

  -- Kwara location
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Kwara', 'Ilorin Terminal', 'Taiwo Road, Ilorin');

  -- Ogun locations
  INSERT INTO pickup_locations (company_id, state, location_name, address) VALUES
    (park_id, 'Ogun', 'Abeokuta Office', 'Ibara, Abeokuta'),
    (park_id, 'Ogun', 'Sagamu Terminal', 'Lagos-Ibadan Expressway, Sagamu');

END $$;
