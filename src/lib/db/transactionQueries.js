import pool from './pool.js';

export const getTransactionsByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      `  
          SELECT t.*  
          FROM transactions t  
          INNER JOIN accounts a ON t.account_id = a.account_id  
          WHERE a.user_id = $1  
          `,
      [userId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching transactions for user:', error);
    throw error;
  }
};

export const getTransactionsByAccountId = async (accountId) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE account_id = $1',
      [accountId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching transactions for account:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const { account_id, date, payee, category, memo, amount, cleared } =
      transactionData;

    const query = `  
        INSERT INTO transactions (account_id, date, payee, category, memo, amount, cleared)  
        VALUES ($1, $2, $3, $4, $5, $6, $7)  
        RETURNING *;  
      `;
    const values = [account_id, date, payee, category, memo, amount, cleared];

    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const deleteTransactionById = async (transaction_id) => {
  try {
    const query = `  
      DELETE FROM transactions  
      WHERE transaction_id = $1  
      RETURNING *;  
    `;
    const values = [transaction_id];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Transaction with ID ${transaction_id} not found`);
    }

    return rows[0];
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const updateTransactionById = async (transaction_id, updates) => {
  try {
    const { date, payee, category, memo, amount, cleared } = updates;

    const query = `  
      UPDATE transactions  
      SET  
        date = COALESCE($2, date),  
        payee = COALESCE($3, payee),  
        category = COALESCE($4, category),  
        memo = COALESCE($5, memo),  
        amount = COALESCE($6, amount),  
        cleared = COALESCE($7, cleared)  
      WHERE transaction_id = $1  
      RETURNING *;  
    `;
    const values = [
      transaction_id,
      date,
      payee,
      category,
      memo,
      amount,
      cleared,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Transaction with ID ${transaction_id} not found`);
    }

    return rows[0];
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};
