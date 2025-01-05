CREATE DATABASE budgeting;  

-- \c budgeting;  

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (  
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,  
    balance INTEGER DEFAULT 0,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,  
    UNIQUE (user_id, account_name)
);  

CREATE TABLE transactions (  
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    account_id UUID REFERENCES accounts(account_id) ON DELETE CASCADE,  
    transaction_date DATE NOT NULL,  
    payee VARCHAR(255),  
    memo TEXT,  
    amount INTEGER,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
    category_id UUID REFERENCES categories(category_id) ON DELETE CASCADE,
);  

CREATE OR REPLACE FUNCTION generate_random_color()  
RETURNS CHAR(7) AS $$  
BEGIN  
    RETURN '#' || LPAD(TO_HEX(FLOOR(RANDOM() * 16777215)::INT), 6, '0');  
END;  
$$ LANGUAGE plpgsql;  


CREATE TABLE categories (  
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
    user_id UUID REFERENCES users(user_id) NOT NULL ON DELETE CASCADE,
    category_name VARCHAR(255) DEFAULT 'Ready to Assign',  
    assigned INTEGER DEFAULT 0,  
    activity INTEGER DEFAULT 0,   
    available INTEGER  DEFAULT 0,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,  
    UNIQUE (user_id, category_name),
    category_color CHAR(7) DEFAULT generate_random_color()
);  

CREATE OR REPLACE FUNCTION update_account_balance()  
RETURNS TRIGGER AS $$  
DECLARE  
    total_amount INT := 0; 
BEGIN  
    IF TG_OP = 'INSERT' THEN  
        total_amount := NEW.amount;  
    ELSIF TG_OP = 'DELETE' THEN  
        total_amount := -OLD.amount;
    ELSIF TG_OP = 'UPDATE' THEN  
        total_amount := NEW.amount - OLD.amount;
    END IF;  
    UPDATE accounts  
    SET balance = balance + total_amount  
    WHERE account_id = COALESCE(NEW.account_id, OLD.account_id);
    RETURN NEW;  
END;  
$$ LANGUAGE plpgsql;  

CREATE TRIGGER trigger_update_account_balance  
AFTER INSERT OR UPDATE OR DELETE ON transactions  
FOR EACH ROW  
EXECUTE FUNCTION update_account_balance();


-- CREATE TABLE category_targets (
--     target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     category_id UUID REFERENCES categories(category_id) ON DELETE CASCADE,
--     target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('weekly', 'monthly', 'yearly')),
--     need INTEGER NOT NULL,
--     target_date VARCHAR(50) NOT NULL,
--     next_goal VARCHAR(50) NOT NULL CHECK (next_goal IN ('set aside another', 'refill up to')),
--     created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT chk_target_date CHECK (
--         (target_type = 'weekly' AND target_date IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) OR
--         (target_type = 'monthly' AND target_date ~ '^(0?[1-9]|[12][0-9]|3[01]|last day)$') OR
--         (target_type = 'yearly' AND target_date ~ '^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$')
--     )
-- );