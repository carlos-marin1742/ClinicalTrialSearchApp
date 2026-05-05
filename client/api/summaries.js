import axios from 'axios';
const BASE = 'api/summaries';

/**
 * Fetch a plain-English eligibility summary for a trial.
 * The server checks its cache first; if missed it calls Groq and stores the result.
 *
 * @param {string} nctId          - NCT identifier, e.g. "NCT04321234"
 * @param {string} eligibilityText - raw eligibility criteria text from the trial
 * @returns {Promise<{ summary: string, cached: boolean }>}
 */

export async function getSummary(nctID, eligibilityCriteria) {
  const response = await axios.get(`${BASE}/${nctID}`, {
    params: { eligibilityCriteria: eligibilityCriteria }
  });
  return response.data;
}