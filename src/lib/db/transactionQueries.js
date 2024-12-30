import pool from './pool.js';

export const getTransactionsByUserId = async (userId) => {
  try {
    const { rows } = await pool.query(
      `  
          SELECT t.*  
          FROM transactions t  
          INNER JOIN accounts a ON t.account_id = a.account_id  
          WHERE a.user_id = $1  
          ORDER BY created_at DESC
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
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY created_at DESC',
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
    const { account_id, date, payee, category, memo, amount } = transactionData;
    console.log(transactionData);
    const query = `  
        INSERT INTO transactions (account_id, date, payee, category, memo, amount)  
        VALUES ($1, $2, $3, $4, $5, $6)  
        RETURNING *;  
      `;
    const values = [account_id, date, payee, category, memo, amount];

    const { rows } = await pool.query(query, values);

    return rows[0];
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const deleteTransactionsByIds = async (transaction_ids) => {
  try {
    const query = `  
      DELETE FROM transactions  
      WHERE transaction_id = ANY($1::uuid[])  
      RETURNING *;  
    `;
    const values = [transaction_ids];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`No transactions found for the provided IDs`);
    }

    return rows;
  } catch (error) {
    console.error('Error deleting transactions:', error);
    throw error;
  }
};

export const updateTransactionById = async (transaction_id, updates) => {
  try {
    const { account_id, date, payee, category, memo, amount } = updates;

    const query = `  
      UPDATE transactions  
      SET  
        account_id = COALESCE($2, account_id),
        date = COALESCE($3, date),  
        payee = COALESCE($4, payee),  
        category = COALESCE($5, category),  
        memo = COALESCE($6, memo),  
        amount = COALESCE($7, amount)
      WHERE transaction_id = $1  
      RETURNING *;  
    `;

    console.log(transaction_id, account_id);
    const values = [
      transaction_id,
      account_id,
      date,
      payee,
      category,
      memo,
      amount
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
