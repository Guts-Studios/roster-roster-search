-- Insert a few test records first to verify the structure works
INSERT INTO public.personnel (
  last_name, first_name, classification, badge_number, division,
  regular_pay, premiums, overtime, payout, other_pay, health_dental_vision
) VALUES
('Test', 'User', 'Police Officer', '1234', 'Patrol', 50000.00, 5000.00, 2000.00, 1000.00, 500.00, 10000.00),
('Sample', 'Officer', 'Police Sergeant', '5678', 'Traffic', 60000.00, 6000.00, 3000.00, 2000.00, 800.00, 12000.00);

-- Check if the test records were inserted
SELECT COUNT(*) as record_count FROM personnel;