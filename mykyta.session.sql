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

