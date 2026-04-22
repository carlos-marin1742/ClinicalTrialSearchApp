import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

// Get all bookmarks for a user
router.get('/', async (req, res) => {
    try{
        const { rows } = await pool.query('SELECT * FROM bookmarks ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookmarks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// POST A NEW BOOKMARK
router.post('/', async (req, res) => {
    try{
        const { nct_id, title } = req.body;
        const { rows } = await pool.query(
            'INSERT INTO bookmarks (nct_id, title) VALUES ($1, $2) ON CONFLICT (nct_id) DO NOTHING RETURNING *',
            [nct_id, title]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating bookmark:', error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE a bookmark
router.delete('/:nctId', async (req, res) => {
  try {
    const { nctId } = req.params;
    await pool.query('DELETE FROM bookmarks WHERE nct_id = $1', [nctId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;