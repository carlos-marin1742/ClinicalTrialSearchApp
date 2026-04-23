import pg from 'pg';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../../.env') });


// pool manages multiple clients and connections to the database, allowing for efficient query
// This is important when managing multiple users are trying to bookmark trials
import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false       
});
export default pool;