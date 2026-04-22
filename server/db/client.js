import pg from 'pg';
import { Pool } from 'pg';


// pool manages multiple clients and connections to the database, allowing for efficient query
// This is important when managing multiple users are trying to bookmark trials
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false       
});
export default pool;