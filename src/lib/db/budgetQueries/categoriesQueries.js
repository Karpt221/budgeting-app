import pool from '../pool.js';

export const getCategories = async () => {
  try {
    const { rows } = await pool.query(
      `  
        SELECT *   
        FROM categories   
        ORDER BY created_at ASC   
        `,
      [],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching categories for group:', error);
    throw error;
  }
};

export const createCategory = async (category_name) => {
  try {
    const { rows } = await pool.query(
      `  
        INSERT INTO categories (category_name)  
        VALUES ($1)  
        RETURNING *  
        `,
      [category_name],
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, category_name, assigned) => {
  try {
    const { rows } = await pool.query(
      `  
          UPDATE categories  
          SET category_name = $1,
          SET assigned = $2
          WHERE category_id = $3  
          RETURNING *  
          `,
      [category_name, assigned, categoryId],
    );

    return rows[0];
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const { rows } = await pool.query(
      `  
        DELETE FROM categories  
        WHERE category_id = $1  
        RETURNING *;  
        `,
      [categoryId],
    );
    if (rows.length === 0) {
      throw new Error(`Ctegory with ID ${categoryId} not found`);
    }

    return rows[0];
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
