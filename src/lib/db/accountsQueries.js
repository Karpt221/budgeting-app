import pool from './pool.js';
import { createTransaction } from './transactionQueries.js';
import {
  updateReadyToAssign,
  updateActivityForCategories,
  updateAvailableForCategories
} from './budgetQueries/categoriesQueries.js';

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

export const createBankingAccount = async (user_id, name, balance = 0) => {
  try {
    const query = `  
      INSERT INTO accounts (user_id, account_name)  
      VALUES ($1, $2)   
      RETURNING *;  
    `;

    const { rows } = await pool.query(query, [user_id, name]);
    const query_category_id = `  
      SELECT category_id  
      FROM categories  
      WHERE category_name = $1  
      LIMIT 1;  
    `;
    const values = ['Ready to Assign'];

    const { rows: rows_query_category_id } = await pool.query(
      query_category_id,
      values,
    );

    if (rows_query_category_id.length === 0) {
      throw new Error('Ready to Assign category not found');
    }

    const category_id = rows_query_category_id[0].category_id;

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    await createTransaction({
      account_id: rows[0].account_id,
      transaction_date: formattedDate,
      payee: 'Starting Balance',
      category_id: category_id,
      memo: '',
      amount: balance,
    });

    await updateReadyToAssign(user_id);

    return rows[0];
  } catch (error) {
    console.error('Error inserting new account:', error);
    throw error;
  }
};

export const deleteBankingAccountById = async (account_id) => {
  try {
    // Retrieve user_id for the account
    const { rows: userRows } = await pool.query(
      `
      SELECT user_id
      FROM accounts
      WHERE account_id = $1;
      `,
      [account_id]
    );

    if (userRows.length === 0) {
      throw new Error(`No user found for account_id: ${account_id}`);
    }

    const userId = userRows[0].user_id;

    // Retrieve distinct category_ids for transactions associated with the account
    const { rows: categoryRows } = await pool.query(
      `
      SELECT DISTINCT category_id
      FROM transactions
      WHERE account_id = $1;
      `,
      [account_id]
    );

    const categoryIds = categoryRows.map((row) => row.category_id);

    // Delete the account
    const { rows } = await pool.query(
      `
      DELETE FROM accounts  
      WHERE account_id = $1  
      RETURNING *;
      `,
      [account_id]
    );

    if (rows.length === 0) {
      throw new Error(`Account with ID ${account_id} not found`);
    }

    // Update activity for the selected categories if any category_ids exist
    if (categoryIds.length > 0) {
      await updateActivityForCategories(categoryIds);
      await updateAvailableForCategories(categoryIds);
    }

    // Update Ready to Assign for the user
    await updateReadyToAssign(userId);

    return rows[0];
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};


export const updateBankingAccountById = async (account_id, account_name) => {
  try {
    const query = `  
      UPDATE accounts  
      SET  
        account_name = COALESCE($2, account_name)
      WHERE account_id = $1  
      RETURNING *;  
    `;
    const values = [account_id, account_name];

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
