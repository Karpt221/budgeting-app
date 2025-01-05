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

-- ALTER TABLE categories 
-- ALTER COLUMN category_name DROP NOT NULL;

-- ALTER TABLE categories 
-- ALTER COLUMN assigned DROP NOT NULL;

-- ALTER TABLE categories 
-- ALTER COLUMN activity DROP NOT NULL;

-- ALTER TABLE categories 
-- ALTER COLUMN available DROP NOT NULL;


-- DELETE FROM categories WHERE category_name = 'New cat';

-- ALTER TABLE transactions  
-- DROP CONSTRAINT transactions_category_id_fkey; 

-- ALTER TABLE transactions  
-- ADD CONSTRAINT transactions_category_id_fkey  
-- FOREIGN KEY (category_id)  
-- REFERENCES categories (category_id)  
-- ON DELETE CASCADE;  

-- ALTER TABLE transactions  
-- ADD CONSTRAINT transactions_category_id_fkey  
-- FOREIGN KEY (category_id)  
-- REFERENCES categories (category_id);

-- CREATE OR REPLACE FUNCTION sync_categories_with_transactions()
-- RETURNS TRIGGER AS $$
-- DECLARE
--   ready_to_assign_id UUID;
-- BEGIN

--   IF (TG_OP = 'DELETE') THEN
--     SELECT category_id
--     INTO ready_to_assign_id
--     FROM categories
--     WHERE category_name = 'Ready to Assign'
--     AND user_id IS NULL;

--     IF ready_to_assign_id IS NOT NULL THEN
--       UPDATE transactions
--       SET category = 'Ready to Assign',
--           category_id = ready_to_assign_id
--       WHERE category_id = OLD.category_id;
--     ELSE
--       UPDATE transactions
--       SET category = NULL,
--           category_id = NULL
--       WHERE category = OLD.category;
--     END IF;

--   ELSIF (TG_OP = 'UPDATE') THEN
--     UPDATE transactions
--     SET category = NEW.category_name
--     WHERE category_id = NEW.category_id;

--   ELSIF (TG_OP = 'INSERT') THEN
--     NULL;
--   END IF;

--   RETURN NULL; 
-- END;
-- $$ LANGUAGE plpgsql;


-- CREATE OR REPLACE TRIGGER sync_categories_trigger
-- AFTER INSERT OR UPDATE OR DELETE
-- ON categories
-- FOR EACH ROW
-- EXECUTE FUNCTION sync_categories_with_transactions();


-- CREATE OR REPLACE FUNCTION update_category_activity()  
-- RETURNS TRIGGER AS $$  
-- DECLARE  
--     v_category_id UUID;  
-- BEGIN  
--     IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN  
--         v_category_id := NEW.category_id;  
--         UPDATE categories  
--         SET activity = (  
--             SELECT COALESCE(SUM(amount), 0)  
--             FROM transactions  
--             WHERE category_id = v_category_id  
--         ),  
--         available = assigned + activity   
--         WHERE category_id = v_category_id;  

--     ELSIF (TG_OP = 'DELETE') THEN  
--         FOR v_category_id IN  
--             SELECT DISTINCT category_id  
--             FROM transactions  
--             WHERE transaction_id IN (SELECT OLD.transaction_id)
--         LOOP  
--             UPDATE categories  
--             SET activity = (  
--                 SELECT COALESCE(SUM(amount), 0)  
--                 FROM transactions  
--                 WHERE category_id = v_category_id  
--             ),  
--             available = assigned + activity
--             WHERE category_id = v_category_id;  
--         END LOOP;  
--     END IF;  

--     RETURN NULL;   
-- END;  
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_category_activity_trigger  
-- AFTER INSERT OR UPDATE OR DELETE  
-- ON transactions  
-- FOR EACH ROW  
-- EXECUTE FUNCTION update_category_activity();

-- CREATE OR REPLACE FUNCTION sync_categories_with_transactions()  
-- RETURNS TRIGGER AS $$  
-- BEGIN  
--     -- Only update transactions if the category_name has changed  
--     IF NEW.category_name IS DISTINCT FROM OLD.category_name THEN  
--         UPDATE transactions  
--         SET category = NEW.category_name  
--         WHERE category_id = NEW.category_id;  
--     END IF;  

--     RETURN NULL;   
-- END;  
-- $$ LANGUAGE plpgsql;

-- CREATE OR REPLACE TRIGGER sync_categories_trigger  
-- AFTER UPDATE  
-- ON categories  
-- FOR EACH ROW  
-- EXECUTE FUNCTION sync_categories_with_transactions();

-- -- Drop the trigger and function for sync_categories_with_transactions
-- DROP TRIGGER IF EXISTS sync_categories_trigger ON categories;
-- DROP FUNCTION IF EXISTS sync_categories_with_transactions;

-- -- Drop the trigger and function for update_category_activity
-- DROP TRIGGER IF EXISTS update_category_activity_trigger ON transactions;
-- DROP FUNCTION IF EXISTS update_category_activity;


