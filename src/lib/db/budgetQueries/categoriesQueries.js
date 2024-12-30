import pool from '../pool.js';

export const getCategoriesByGroupId = async (groupId) => {
  try {
    const { rows } = await pool.query(
      `  
        SELECT *   
        FROM categories  
        WHERE group_id = $1  
        ORDER BY created_at DESC   
        `,
      [groupId],
    );
    return rows;
  } catch (error) {
    console.error('Error fetching categories for group:', error);
    throw error;
  }
};

export const createCategory = async (groupId, name, assigned = 0) => {
  try {
    const { rows } = await pool.query(
      `  
        INSERT INTO categories (group_id, name, assigned)  
        VALUES ($1, $2, $3)  
        RETURNING *  
        `,
      [groupId, name, assigned],
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId, name, assigned) => {
  try {
    const { rows } = await pool.query(
      `  
        UPDATE categories  
        SET name = $1, assigned = $2  
        WHERE category_id = $3  
        RETURNING *  
        `,
      [name, assigned, categoryId],
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
