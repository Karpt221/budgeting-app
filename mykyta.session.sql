--SELECT * FROM categories WHERE group_id = 'a62fede7-17ed-4aff-8de9-d9476f794053';

--4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c
-- SELECT * FROM accounts;

-- INSERT INTO accounts (user_id, name, balance) VALUES
-- ('4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c', 'Checking', 10000)

--  INSERT INTO accounts (user_id, name)  
--       VALUES ('4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c', 'New Account');
-- ALTER TABLE categories  
-- DROP COLUMN group_id;  

DROP TABLE category_groups;

-- ALTER TABLE category_targets  
-- ADD COLUMN category_id UUID;  

-- ALTER TABLE category_targets  
-- ADD CONSTRAINT fk_category_id  
-- FOREIGN KEY (category_id) REFERENCES categories(category_id);  

-- CREATE TABLE categories (  
--     category_id UUID PRIMARY KEY,  
--     name CHARACTER VARYING(255) NOT NULL,  
--     assigned INTEGER,  
--     activity INTEGER,  
--     available INTEGER,  
--     created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,  
--     group_id UUID,  -- Add the group_id column  
--     FOREIGN KEY (group_id) REFERENCES category_groups(group_id)  -- Define the foreign key constraint  
-- );  

-- SELECT * FROM accounts WHERE user_id = '4bc5a1d7-16ed-4ed8-9a2e-6b4b8332e38c' ORDER BY created_at ASC

-- INSERT INTO categories (group_id, name, assigned, activity, available) VALUES  
-- ('37d24069-bb4f-430b-9fc0-5f4e06af77a6', 'Groceries', 50000, 20000, 30000),  
-- ('37d24069-bb4f-430b-9fc0-5f4e06af77a6', 'Rent', 100000, 100000, 0),  
-- ('37d24069-bb4f-430b-9fc0-5f4e06af77a6', 'Utilities', 30000, 15000, 15000);  

-- -- Insert categories into the "Entertainment" group (replace `group_id_entertainment` with the actual group ID)  
-- INSERT INTO categories (group_id, name, assigned, activity, available) VALUES  
-- ('bcb543c7-213e-48d4-8878-e41bd4b810d9', 'Movies', 20000, 5000, 15000),  
-- ('bcb543c7-213e-48d4-8878-e41bd4b810d9', 'Games', 30000, 10000, 20000);  

-- -- Insert categories into the "Savings" group (replace `group_id_savings` with the actual group ID)  
-- INSERT INTO categories (group_id, name, assigned, activity, available) VALUES  
-- ('a62fede7-17ed-4aff-8de9-d9476f794053', 'Emergency Fund', 100000, 0, 100000),  
-- ('a62fede7-17ed-4aff-8de9-d9476f794053', 'Vacation Fund', 50000, 0, 50000);

-- Insert targets for the categories (replace `<category_id>` with the actual IDs)  

-- Targets for "Essentials" group  
-- INSERT INTO category_targets (category_id, target_type, need, target_date, next_goal) VALUES  
-- ('41d81834-1285-466b-ac00-4392e43c98be', 'weekly', 5000, 'Friday', 'set aside another'),  
-- ('83f91ffb-c4e7-431a-952d-f2e187f655e1', 'monthly', 100000, 'last day', 'refill up to'),  
-- ('1a0eacb1-829a-431d-b075-c6f8aabb6bee', 'monthly', 30000, '15', 'set aside another');  

-- -- Targets for "Entertainment" group  
-- INSERT INTO category_targets (category_id, target_type, need, target_date, next_goal) VALUES  
-- ('01544e2b-9807-410a-a0d8-2f416961ef65', 'monthly', 20000, '15', 'set aside another'),  
-- ('d0a55fc5-6732-49f3-940c-23b0a5c53fc3', 'monthly', 30000, 'last day', 'refill up to');  

-- -- Targets for "Savings" group  
-- INSERT INTO category_targets (category_id, target_type, need, target_date, next_goal) VALUES  
-- ('ee6348ec-6815-4350-8d36-6f40b28c427d', 'yearly', 100000, '2024-12-31', 'refill up to'),  
-- ('69134177-4013-4fb5-8cf2-4d109663d6d4', 'yearly', 50000, '2024-06-30', 'set aside another');

-- SELECT* FROM category_targets;
-- INSERT INTO category_groups (user_id, name) VALUES  
-- ('15230c93-4c13-4a71-baa1-77f11408684d', 'Essentials'),  
-- ('15230c93-4c13-4a71-baa1-77f11408684d', 'Entertainment'),  
-- ('15230c93-4c13-4a71-baa1-77f11408684d', 'Savings');

--  SELECT * FROM accounts WHERE user_id = '15230c93-4c13-4a71-baa1-77f11408684d';
--  SELECT * FROM transactions;

-- INSERT INTO transactions (account_id, date, payee, category, memo, amount, cleared)  
-- VALUES ('a5776bd3-701e-4248-878f-b5c6b8045c8e', '2025-12-20', 'FGRG', 'Groceries', 'Weekly groceries', -5000, true);  

-- DROP TABLE category_targets;
-- DROP TABLE categories;
-- DROP TABLE category_groups;

-- CREATE TABLE category_groups (  
--     group_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
--     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,  
--     name VARCHAR(255) UNIQUE NOT NULL, -- Name of the category group  
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
-- );  

-- CREATE TABLE categories (  
--     category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
--     group_id UUID REFERENCES category_groups(group_id) ON DELETE CASCADE, -- Group is optional  
--     name VARCHAR(255) NOT NULL, -- Name of the category (e.g., "Groceries")  
--     assigned INTEGER NOT NULL DEFAULT 0, -- Amount assigned to the category (in cents)  
--     activity INTEGER NOT NULL DEFAULT 0, -- Total activity (transactions) in the category  
--     available INTEGER NOT NULL DEFAULT 0, -- Remaining balance in the category  
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
--     CONSTRAINT unique_group_name UNIQUE (group_id, name) -- Ensure name is unique within the same group  
-- );  

-- CREATE TABLE category_targets (  
--     target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
--     category_id UUID UNIQUE REFERENCES categories(category_id) ON DELETE CASCADE, -- Ensure category_id is unique  
--     target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('weekly', 'monthly', 'yearly')), -- Target type  
--     need INTEGER NOT NULL, -- Amount needed (in cents)  
--     target_date VARCHAR(50) NOT NULL, -- Target-specific representation (see constraints below)  
--     next_goal VARCHAR(50) NOT NULL CHECK (next_goal IN ('set aside another', 'refill up to')), -- Goal type  
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
--     CONSTRAINT chk_target_date CHECK (  
--         (target_type = 'weekly' AND target_date IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) OR  
--         (target_type = 'monthly' AND target_date ~ '^(0?[1-9]|[12][0-9]|3[01]|last day)$') OR  
--         (target_type = 'yearly' AND target_date ~ '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$')  
--     )  
-- ); 

-- INSERT INTO categories (name, assigned, activity, available)
-- VALUES ('Ready to Assign', 0, 0, 0);

-- SELECT * FROM categories


