-- Create the database  
CREATE DATABASE budgeting;  

-- Connect to the newly created database  
\c budgeting;  

-- Create the accounts table  
CREATE TABLE accounts (  
    account_id UUID PRIMARY KEY,  
    user_id UUID,  
    name CHARACTER VARYING(255),  
    balance INTEGER,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);  

-- Create the categories table  
CREATE TABLE categories (  
    category_id UUID PRIMARY KEY,  
    name CHARACTER VARYING(255),  
    assigned INTEGER,  
    activity INTEGER,  
    available INTEGER,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);  

-- Create the category_targets table  
CREATE TABLE category_targets (  
    target_id UUID PRIMARY KEY,  
    target_type CHARACTER VARYING(50),  
    need INTEGER,  
    target_date CHARACTER VARYING(50),  
    next_goal CHARACTER VARYING(50),  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,  
    category_id UUID REFERENCES categories(category_id)  
);  

-- Create the transactions table  
CREATE TABLE transactions (  
    transaction_id UUID PRIMARY KEY,  
    account_id UUID REFERENCES accounts(account_id),  
    date DATE,  
    payee CHARACTER VARYING(255),  
    memo TEXT,  
    amount INTEGER,  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);  

-- Create the users table  
CREATE TABLE users (  
    user_id UUID PRIMARY KEY,  
    email CHARACTER VARYING(255),  
    password_hash CHARACTER VARYING(255),  
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP  
);

