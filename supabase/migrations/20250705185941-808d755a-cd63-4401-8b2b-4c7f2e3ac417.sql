-- First clear the test data
DELETE FROM personnel WHERE badge_number IN ('1234', '5678');

-- Insert the first batch of personnel data
INSERT INTO public.personnel (
  last_name, first_name, classification, badge_number, division,
  regular_pay, premiums, overtime, payout, other_pay, health_dental_vision
) VALUES
('Aceves', 'Javier', 'Police Sergeant', '2611', 'Patrol', 58313.38, 18107.92, 369.80, 54992.04, NULL, 7545.00),
('Achutegui', 'Maira', 'Police Officer', '3678', 'Patrol', 120942.53, 18141.45, 28951.18, 5260.80, NULL, 18108.00),
('Achziger', 'Clinton', 'Police Sergeant', '2978', 'Patrol', 149206.57, 47746.07, 4766.37, NULL, NULL, 18108.00),
('Acosta', 'Victor', 'Police Officer', '3710', 'Patrol', 119199.73, 11353.64, 5201.64, NULL, NULL, 18108.00),
('Aguilar', 'Kenney', 'Police Officer', '3024', 'Patrol', 120942.53, 33724.97, 27174.51, NULL, NULL, 18108.00),
('Ahearn', 'Connor', 'Police Officer', '3451', 'Patrol', 120942.53, 30582.56, 58010.30, 6026.95, NULL, 18108.00),
('Alatorre', 'Irene', 'Police Officer', '2875', 'Patrol', 120942.53, 42324.57, 332.25, 43247.11, 4213.07, 18108.00),
('Alcantar', 'Abel', 'Police Sergeant', '2580', 'Training/Human Resources', 149206.57, 50062.99, 7814.78, 8411.12, NULL, 18108.00),
('Alvaradejo', 'Jonathan', 'Police Officer', '3535', 'Operations Division', 120942.53, 29452.56, 52156.67, NULL, NULL, 18108.00),
('Alvarez', 'Mariel', 'Police Officer', '3458', 'Patrol', 120942.53, 18141.45, 28473.18, NULL, NULL, 18108.00);