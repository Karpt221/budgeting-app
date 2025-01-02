-- ALTER TABLE users  
-- ADD currency_code CHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency_code IN ('USD', 'EUR', 'UAH'));
-- ALTER TABLE categories  
-- ADD CONSTRAINT unique_name UNIQUE (name);
-- ALTER TABLE accounts
-- RENAME COLUMN name to account_name;
-- ALTER TABLE transactions
-- RENAME COLUMN date to transaction_date;
-- ALTER TABLE categories  
-- DROP CONSTRAINT unique_name;  
-- ALTER TABLE categories
-- ADD COLUMN  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE;
-- ALTER TABLE categories  
-- ADD CONSTRAINT unique_user_category UNIQUE (user_id, category_name);  
-- ALTER TABLE accounts  
-- ADD CONSTRAINT unique_user_account_name UNIQUE (user_id, account_name);  
-- ALTER TABLE accounts 
-- ALTER COLUMN user_id SET NOT NULL;  
-- ALTER TABLE categories 
-- ALTER COLUMN category_name SET DEFAULT 'Ready to Assign';  
-- INSERT INTO categories (category_name, user_id)
-- VALUES (
--         'Rent',
--         '4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c'
--     ),
--     (
--         'Groceries',
--         '4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c'
--     ),
--     (
--         'Car Maintenance',
--         '4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c'
--     ),
--     (
--         'Medical Treatment',
--         '4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c'
--     );

-- ALTER TABLE transactions
-- Add COLUMN category_id UUID REFERENCES categories(category_id) ON DELETE CASCADE

-- ALTER TABLE categories
-- ADD COLUMN category_color CHAR(7);

-- CREATE OR REPLACE FUNCTION generate_random_color()  
-- RETURNS CHAR(7) AS $$  
-- BEGIN  
--     RETURN '#' || LPAD(TO_HEX(FLOOR(RANDOM() * 16777215)::INT), 6, '0');  
-- END;  
-- $$ LANGUAGE plpgsql;  

-- ALTER TABLE categories  
-- ALTER COLUMN category_color SET DEFAULT generate_random_color();  


-- INSERT INTO categories (category_name, assigned, activity, available)  
-- VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT);  