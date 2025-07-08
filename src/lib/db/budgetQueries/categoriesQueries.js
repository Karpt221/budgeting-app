import pool from '../pool.js';

export const getAllCategories = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `  
         SELECT *   
        FROM categories   
        WHERE user_id = $1  
         ORDER BY created_at DESC;    
        `,
      [user_id],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching categories for group:', error);
    throw error;
  }
};

export const getCategoriesByUserId = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `  
        SELECT *   
        FROM categories   
        WHERE user_id = $1 AND category_name != 'Ready to Assign'  
         ORDER BY created_at DESC;    
        `,
      [user_id],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching categories for group:', error);
    throw error;
  }
};

export const createCategory = async (user_id, category_name) => {
  try {
    const { rows } = await pool.query(
      `  
        INSERT INTO categories (user_id, category_name)  
        VALUES ($1, $2)  
        RETURNING *  
        `,
      [user_id, category_name],
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, category_name, assigned) => {
  try {
    if (assigned === null) {
      assigned = 0;
    }

    const { rows: userRows } = await pool.query(
      `
      SELECT user_id
      FROM categories
      WHERE category_id = $1;
      `,
      [categoryId],
    );

    if (userRows.length === 0) {
      throw new Error(`No user found for category ID: ${categoryId}`);
    }

    const userId = userRows[0].user_id;

    const { rows } = await pool.query(
      `  
          UPDATE categories  
          SET category_name = $1,  
              assigned = $2  
          WHERE category_id = $3  
          RETURNING *  
      `,
      [category_name, assigned, categoryId],
    );

    await updateReadyToAssign(userId);
    await updateAvailableForCategories([categoryId]);

    return rows[0];
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategories = async (categoryIds) => {
  try {
    const { rows: userRows } = await pool.query(
      `
      SELECT user_id
      FROM categories
      WHERE category_id = $1;
      `,
      [categoryIds[0]],
    );

    if (userRows.length === 0) {
      throw new Error(`No user found for category ID: ${categoryIds[0]}`);
    }

    const userId = userRows[0].user_id;

    const { rows } = await pool.query(
      `  
        DELETE FROM categories  
        WHERE category_id = ANY($1::uuid[])    
        RETURNING *;  
        `,
      [categoryIds],
    );
    if (rows.length === 0) {
      throw new Error(`Ctegories with IDs ${categoryIds} not found`);
    }

    await updateReadyToAssign(userId);

    return rows;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const getReadyToAssign = async (user_id) => {
  try {
    const { rows } = await pool.query(
      `  
      SELECT assigned 
      FROM categories
      WHERE user_id = $1 AND category_name = 'Ready to Assign';    
    `,
      [user_id],
    );

    console.log('getReadyToAssign',rows);
    return rows[0].assigned || 0;
  } catch (error) {
    console.error('Error calculating ready_to_assign:', error);
    throw error;
  }
};

export const updateReadyToAssign = async (userId) => {
  try {
    await pool.query('BEGIN');

    const { rows: readyToAssignTransactions } = await pool.query(
      `
      SELECT COALESCE(SUM(t.amount), 0) AS total_ready_to_assign
      FROM transactions t
      INNER JOIN categories c ON t.category_id = c.category_id
      WHERE c.user_id = $1 AND c.category_name = 'Ready to Assign';
      `,
      [userId],
    );

    const totalReadyToAssign =
      readyToAssignTransactions[0].total_ready_to_assign;

    const { rows: otherCategoriesAssigned } = await pool.query(
      `
      SELECT COALESCE(SUM(assigned), 0) AS total_assigned
      FROM categories
      WHERE user_id = $1 AND category_name != 'Ready to Assign';
      `,
      [userId],
    );

    const totalAssigned = otherCategoriesAssigned[0].total_assigned;

    const { rowCount } = await pool.query(
      `
      UPDATE categories
      SET assigned = $1
      WHERE user_id = $2 AND category_name = 'Ready to Assign';
      `,
      [totalReadyToAssign - totalAssigned, userId],
    );

    if (rowCount === 0) {
      throw new Error(
        `No "Ready to Assign" category found for user with ID: ${userId}`,
      );
    }

    await pool.query('COMMIT');
    console.log('Updated "Ready to Assign" successfully for user:', userId);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating "Ready to Assign":', error);
    throw error;
  }
};


export const updateActivityForCategories = async (categoryIds) => {
  try {
    await pool.query('BEGIN');

    for (const categoryId of categoryIds) {
      const { rows: activityRows } = await pool.query(
        `
        SELECT COALESCE(SUM(amount), 0) AS activity
        FROM transactions
        WHERE category_id = $1;
        `,
        [categoryId]
      );

      const activity = activityRows[0].activity;

      await pool.query(
        `
        UPDATE categories
        SET activity = $1
        WHERE category_id = $2;
        `,
        [activity, categoryId]
      );
    }

    await pool.query('COMMIT');
    console.log('Activity fields updated successfully');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating activity fields:', error);
    throw error;
  }
};


export const updateAvailableForCategories = async (categoryIds) => {
  try {
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      throw new Error('Invalid input: categoryIds must be a non-empty array.');
    }
    await pool.query('BEGIN');
    const query = `
      UPDATE categories
      SET available = assigned + activity
      WHERE category_id = ANY($1::uuid[])
      RETURNING category_id, available;
    `;

    const { rows } = await pool.query(query, [categoryIds]);

    if (rows.length === 0) {
      throw new Error(`No categories found for the provided IDs: ${categoryIds}`);
    }
    await pool.query('COMMIT');
    console.log('Updated categories:', rows);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error updating available field for categories:', error);
    throw error;
  }
};
