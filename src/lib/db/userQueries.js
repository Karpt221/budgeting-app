import pool from './pool.js';  

export const findUserById = async (id) => {  
  const { rows } = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);  
  return rows[0];  
};  

export const findUserByEmail = async (email) => {  
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];  
};  

export const createUser = async (email, hashedPassword) => {  
  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [  
    email,  
    hashedPassword,  
  ]);  
};  