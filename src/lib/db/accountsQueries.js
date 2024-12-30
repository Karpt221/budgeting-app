import pool from './pool.js';
import { createTransaction } from './transactionQueries.js';

export const getAccountsByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at ASC',
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching accounts for user:', error);
    throw error;
  }
};

export const createBankingAccount = async (
  user_id,
  name,
  balance = 0,
  is_closed = false,
) => {
  try {
    const query = `  
      INSERT INTO accounts (user_id, name)  
      VALUES ($1, $2) 
      RETURNING *;  
    `;

    const { rows } = await pool.query(query, [user_id, name]);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    createTransaction({
      account_id: rows[0].account_id,
      date: formattedDate,
      payee: 'Starting Balance',
      category: 'Ready to Assign',
      memo: '',
      amount: balance,
      cleared: false,
    });

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

export const updateBankingAccountById = async (account_id, name) => {
  try {
    const query = `  
      UPDATE accounts  
      SET  
        name = COALESCE($2, name)
      WHERE account_id = $1  
      RETURNING *;  
    `;
    const values = [account_id, name];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Account with ID ${account_id} not found`);
    }
    //return await getAccountsByUserId();
    return rows[0];
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};
