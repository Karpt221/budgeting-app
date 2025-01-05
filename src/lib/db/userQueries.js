import pool from './pool.js';

export const findUserById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [
    id,
  ]);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);
  return rows[0];
};

export const createUser = async (email, hashedPassword) => {
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [
    email,
    hashedPassword,
  ]);

  const { rows: rows_creayed_user_id } = await pool.query(
    `  
  SELECT user_id  
  FROM users  
  WHERE email = $1  
  LIMIT 1;  
`,
    [email],
  );

  if (rows_creayed_user_id.length === 0) {
    throw new Error('User ID not found');
  }

  const user_id = rows_creayed_user_id[0].user_id;

  await pool.query(
    `
        INSERT INTO categories (user_id, category_name, assigned, activity, available)  
        VALUES ($1, DEFAULT, DEFAULT, DEFAULT, DEFAULT)`,
    [user_id],
  );
};
