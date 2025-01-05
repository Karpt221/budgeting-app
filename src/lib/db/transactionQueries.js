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

    // Insert the transaction
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

    // Fetch category_name for the category_id
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
      // Fetch user_id associated with the account
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

    // Retrieve the old transaction details
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

    // Update the transaction
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

    // Retrieve category_name for the new category_id
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

    // Handle 'Ready to Assign' category
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
      // Update activity for the updated category if the amount has changed
      await updateActivityForCategories([updatedTransaction.category_id]);
      await updateAvailableForCategories([updatedTransaction.category_id]);
      // If the category_id has changed, update activity for the old category
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
    // Fetch category_ids and user_id for the provided transactions
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

    // Identify categories that are not 'Ready to Assign'
    const nonReadyToAssignCategoryIds = [
      ...new Set(
        transactionDetails
          .filter(({ category_name }) => category_name !== 'Ready to Assign')
          .map(({ category_id }) => category_id)
      ),
    ];

    // Identify if there are any 'Ready to Assign' transactions
    const readyToAssignTransactions = transactionDetails.filter(
      ({ category_name }) => category_name === 'Ready to Assign'
    );
    const hasReadyToAssign = readyToAssignTransactions.length > 0;
    const userId = readyToAssignTransactions[0]?.user_id;

    // Delete the transactions
    const deleteQuery = `
      DELETE FROM transactions
      WHERE transaction_id = ANY($1::uuid[])
      RETURNING *;
    `;
    const { rows } = await pool.query(deleteQuery, [transaction_ids]);

    if (rows.length === 0) {
      throw new Error(`No transactions found for the provided IDs`);
    }

    // Update activity for categories that are not 'Ready to Assign'
    if (nonReadyToAssignCategoryIds.length > 0) {
      await updateActivityForCategories(nonReadyToAssignCategoryIds);
      await updateAvailableForCategories(nonReadyToAssignCategoryIds);
    }

    // Update 'Ready to Assign' for the user if applicable
    if (hasReadyToAssign && userId) {
      await updateReadyToAssign(userId);
    }

    return rows;
  } catch (error) {
    console.error('Error deleting transactions:', error);
    throw error;
  }
};