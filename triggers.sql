CREATE OR REPLACE FUNCTION update_account_balance()  
RETURNS TRIGGER AS $$  
DECLARE  
    total_amount INT := 0;  -- Variable to accumulate the total amount for multiple transactions  
BEGIN  
    -- If it's an INSERT, add the transaction amount  
    IF TG_OP = 'INSERT' THEN  
        total_amount := NEW.amount;  
    ELSIF TG_OP = 'DELETE' THEN  
        total_amount := -OLD.amount;  -- Subtract the amount if deleting  
    ELSIF TG_OP = 'UPDATE' THEN  
        total_amount := NEW.amount - OLD.amount;  -- Calculate the difference  
    END IF;  
    -- Update the account balance  
    UPDATE accounts  
    SET balance = balance + total_amount  
    WHERE account_id = COALESCE(NEW.account_id, OLD.account_id);  -- Use COALESCE for both INSERT/DELETE  
    RETURN NEW;  -- Return the new row  
END;  
$$ LANGUAGE plpgsql;  

CREATE TRIGGER trigger_update_account_balance  
AFTER INSERT OR UPDATE OR DELETE ON transactions  
FOR EACH ROW  
EXECUTE FUNCTION update_account_balance();