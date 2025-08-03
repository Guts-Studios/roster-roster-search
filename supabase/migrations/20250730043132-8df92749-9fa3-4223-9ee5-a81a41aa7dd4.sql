-- Fix OTP expiry to recommended security threshold (1 hour instead of default 24 hours)
UPDATE auth.config SET value = '3600' WHERE parameter = 'otp_expiry';