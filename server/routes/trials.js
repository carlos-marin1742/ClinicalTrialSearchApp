
import express from 'express';
import fetch from 'node-fetch';
import { normalizeTrials } from '../utils/normalizer.js';



const router = express.Router();


router.get('/', async (req, res) => {
  const { condition } = req.query

  try {
    const apiEndpoint = new URL('https://clinicaltrials.gov/api/v2/studies')
    apiEndpoint.searchParams.set('query.cond', condition || 'diabetes')
    apiEndpoint.searchParams.set('pageSize', 20)

    const apiResponse = await fetch(apiEndpoint)
    const raw = await apiResponse.json()
    const clean = normalizeTrials(raw.studies ?? [])
    res.json(clean)
  } catch (error) {
    console.error('Error fetching clinical trials:', error)
    res.status(500).json({ error: error.message })
  }
})
export default router;
