import pool from './pool.js';
import {
  updateReadyToAssign,
  updateActivityForCategories,
  updateAvailableForCategories,
} from './budgetQueries/categoriesQueries.js';

export const getTransactionsByUserId = async (userId) => {
  try {
    const query = `
      SELECT t.*, c.category_name AS category
      FROM transactions t
      INNER JOIN accounts a ON t.account_id = a.account_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      WHERE a.user_id = $1
      ORDER BY t.created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
  } catch (error) {
    console.error('Error fetching transactions for user:', error);
    throw error;
  }
};

export const getTransactionsByAccountId = async (accountId) => {
  try {
    const query = `
      SELECT t.*, c.category_name AS category
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.category_id
      WHERE t.account_id = $1
      ORDER BY t.created_at DESC;
    `;
    const { rows } = await pool.query(query, [accountId]);
    return rows;
  } catch (error) {
    console.error('Error fetching transactions for account:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const { account_id, transaction_date, payee, category_id, memo, amount } =
      transactionData;

    const query = `
      INSERT INTO transactions (account_id, transaction_date, payee, category_id, memo, amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      account_id,
      transaction_date,
      payee,
      category_id,
      memo,
      amount,
    ];
    const { rows } = await pool.query(query, values);

    const { rows: categoryRows } = await pool.query(
      `
      SELECT category_name
      FROM categories
      WHERE category_id = $1;
      `,
      [category_id]
    );

    if (categoryRows.length === 0) {
      throw new Error(`No category found for category ID: ${category_id}`);
    }

    const categoryName = categoryRows[0].category_name;

    if (categoryName === 'Ready to Assign') {
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

      await updateReadyToAssign(userId);
    } else {
      await updateActivityForCategories([category_id]);
      await updateAvailableForCategories([category_id]);
    }

    return rows[0];
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};


export const updateTransactionById = async (transaction_id, updates) => {
  try {
    const { account_id, transaction_date, payee, category_id, memo, amount } =
      updates;

    const { rows: oldTransactionRows } = await pool.query(
      `
      SELECT amount, category_id
      FROM transactions
      WHERE transaction_id = $1;
      `,
      [transaction_id]
    );

    if (oldTransactionRows.length === 0) {
      throw new Error(
        `No transaction found for transaction_id: ${transaction_id}`
      );
    }

    const oldTransaction = oldTransactionRows[0];
    const oldAmount = oldTransaction.amount;
    const oldCategoryId = oldTransaction.category_id;

    const query = `
      UPDATE transactions
      SET
        account_id = COALESCE($2, account_id),
        transaction_date = COALESCE($3, transaction_date),
        payee = COALESCE($4, payee),
        category_id = COALESCE($5, category_id),
        memo = COALESCE($6, memo),
        amount = COALESCE($7, amount)
      WHERE transaction_id = $1
      RETURNING *;
    `;
    const values = [
      transaction_id,
      account_id,
      transaction_date,
      payee,
      category_id,
      memo,
      amount,
    ];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error(`Transaction with ID ${transaction_id} not found`);
    }

    const updatedTransaction = rows[0];

    const { rows: categoryRows } = await pool.query(
      `
      SELECT category_name
      FROM categories
      WHERE category_id = $1;
      `,
      [updatedTransaction.category_id]
    );

    if (categoryRows.length === 0) {
      throw new Error(`No category found for category ID: ${updatedTransaction.category_id}`);
    }

    const categoryName = categoryRows[0].category_name;

    if (categoryName === 'Ready to Assign' && oldAmount !== amount) {
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
      await updateReadyToAssign(userId);
    } else if (oldAmount !== amount) {
      await updateActivityForCategories([updatedTransaction.category_id]);
      await updateAvailableForCategories([updatedTransaction.category_id]);
      if (updatedTransaction.category_id !== oldCategoryId) {
        await updateActivityForCategories([oldCategoryId]);
        await updateAvailableForCategories([oldCategoryId]);
      }
    }

    return updatedTransaction;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransactionsByIds = async (transaction_ids) => {
  try {
    const { rows: transactionDetails } = await pool.query(
      `
      SELECT t.category_id, c.category_name, c.user_id
      FROM transactions t
      INNER JOIN categories c ON t.category_id = c.category_id
      WHERE t.transaction_id = ANY($1::uuid[]);
      `,
      [transaction_ids]
    );

    if (transactionDetails.length === 0) {
      throw new Error(`No transactions found for the provided IDs`);
    }

    const nonReadyToAssignCategoryIds = [
      ...new Set(
        transactionDetails
          .filter(({ category_name }) => category_name !== 'Ready to Assign')
          .map(({ category_id }) => category_id)
      ),
    ];

    const readyToAssignTransactions = transactionDetails.filter(
      ({ category_name }) => category_name === 'Ready to Assign'
    );
    const hasReadyToAssign = readyToAssignTransactions.length > 0;
    const userId = readyToAssignTransactions[0]?.user_id;

    const deleteQuery = `
      DELETE FROM transactions
      WHERE transaction_id = ANY($1::uuid[])
      RETURNING *;
    `;
    const { rows } = await pool.query(deleteQuery, [transaction_ids]);

    if (rows.length === 0) {
      throw new Error(`No transactions found for the provided IDs`);
    }

    if (nonReadyToAssignCategoryIds.length > 0) {
      await updateActivityForCategories(nonReadyToAssignCategoryIds);
      await updateAvailableForCategories(nonReadyToAssignCategoryIds);
    }

    if (hasReadyToAssign && userId) {
      await updateReadyToAssign(userId);
    }

    return rows;
  } catch (error) {
    console.error('Error deleting transactions:', error);
    throw error;
  }
};