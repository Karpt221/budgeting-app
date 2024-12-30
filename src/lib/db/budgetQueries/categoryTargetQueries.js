import pool from '../pool.js';

export const getTargetByCategoryId = async (categoryId) => {
  try {
    const { rows } = await pool.query(
      `  
        SELECT *   
        FROM category_targets  
        WHERE category_id = $1  
        `,
      [categoryId],
    );
    return rows[0];
  } catch (error) {
    console.error('Error fetching target for category:', error);
    throw error;
  }
};

export const createTarget = async (
  categoryId,
  targetType,
  need,
  targetDate,
  nextGoal,
) => {
  try {
    const { rows } = await pool.query(
      `  
        INSERT INTO category_targets (category_id, target_type, need, target_date, next_goal)  
        VALUES ($1, $2, $3, $4, $5)  
        RETURNING *  
        `,
      [categoryId, targetType, need, targetDate, nextGoal],
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating target:', error);
    throw error;
  }
};

export const updateTarget = async (
  categoryId,
  targetType,
  need,
  targetDate,
  nextGoal,
) => {
  try {
    const { rows } = await pool.query(
      `  
        UPDATE category_targets  
        SET target_type = $1, need = $2, target_date = $3, next_goal = $4  
        WHERE category_id = $5  
        RETURNING *  
        `,
      [targetType, need, targetDate, nextGoal, categoryId],
    );
    return rows[0];
  } catch (error) {
    console.error('Error updating target:', error);
    throw error;
  }
};

export const deleteTarget = async (categoryId) => {
  try {
    const { rows } = await pool.query(
      `  
        DELETE FROM category_targets  
        WHERE category_id = $1 
        RETURNING *;   
        `,
      [categoryId],
    );
    if (rows.length === 0) {  
      throw new Error(`Category with ID ${categoryId} not found`);  
    }  

    return rows[0]; 
  } catch (error) {
    console.error('Error deleting target:', error);
    throw error;
  }
};
