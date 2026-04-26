import express from 'express';
import pool from '../db/client.js';
import { getGroqSummary } from '../services/groq.js';

const router = express.Router();

router.get('/:nctId', async (req, res) => {
  const { nctId } = req.params;
  const { eligibility } = req.query;

  if (!eligibility) {
    return res.status(400).json({ error: 'eligibility query param is required' });
  }

  try {
    // 1. Cache check
    const cached = await pool.query(
      'SELECT summary FROM summaries WHERE nct_id = $1',
      [nctId]
    );

    if (cached.rows.length > 0) {
      return res.json({ summary: cached.rows[0].summary, cached: true });
    }

    // 2. Cache miss — call Groq
    const summary = await getGroqSummary(eligibility);

    // 3. Persist to DB for next time
    await pool.query(
      'INSERT INTO summaries (nct_id, summary) VALUES ($1, $2) ON CONFLICT (nct_id) DO NOTHING',
      [nctId, summary]
    );

    res.json({ summary, cached: false });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;