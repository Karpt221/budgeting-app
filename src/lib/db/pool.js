import pkg from 'pg';  
const { Pool } = pkg;  

const pool = new Pool({  
  connectionString: 'postgresql://mykyta:12345@localhost:5432/budgeting',  
});  

export default pool;