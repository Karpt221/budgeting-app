import pool from './pool.js';

export const getAccountsByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1',
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching accounts for user:', error);
    throw error;
  }
};

export const createBankingAccount = async (user_id, name, balance = 0, is_closed = false) => {  
  try {  
    const query = `  
      INSERT INTO accounts (user_id, name, balance, is_closed)  
      VALUES ($1, $2, $3, $4)  
      RETURNING *;  
    `;  
    const values = [user_id, name, balance, is_closed];  

    const { rows } = await pool.query(query, values);  
    return rows[0];
  } catch (error) {  
    console.error('Error inserting new account:', error);  
    throw error; 
  }  
};  


export const deleteBankingAccountById = async (account_id) => {  
  try {  
    const query = `  
      DELETE FROM accounts  
      WHERE account_id = $1  
      RETURNING *;  
    `;  
    const values = [account_id];  

    const { rows } = await pool.query(query, values);  

    if (rows.length === 0) {  
      throw new Error(`Account with ID ${account_id} not found`);  
    }  

    return rows[0]; 
  } catch (error) {  
    console.error('Error deleting account:', error);  
    throw error;
  }  
};  

export const updateBankingAccountById = async (account_id, name, balance) => {  
  try {  
    const query = `  
      UPDATE accounts  
      SET  
        name = COALESCE($2, name),  
        balance = COALESCE($3, balance)
      WHERE account_id = $1  
      RETURNING *;  
    `;  
    const values = [account_id, name, balance];  

    const { rows } = await pool.query(query, values);  

    if (rows.length === 0) {  
      throw new Error(`Account with ID ${account_id} not found`);  
    }  

    return rows[0];
  } catch (error) {  
    console.error('Error updating account:', error);  
    throw error; 
  }  
};