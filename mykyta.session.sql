-- SELECT * FROM accounts WHERE user_id = '15230c93-4c13-4a71-baa1-77f11408684d';
 SELECT * FROM transactions;

INSERT INTO transactions (account_id, date, payee, category, memo, amount, cleared)  
VALUES ('a5776bd3-701e-4248-878f-b5c6b8045c8e', '2025-12-20', 'FGRG', 'Groceries', 'Weekly groceries', -5000, true);  