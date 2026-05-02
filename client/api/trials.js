import axios from 'axios';

/**
 * Search clinical trials by condition.
 * @param {string} condition  - e.g. "diabetes", "breast cancer"
 * @returns {Promise<Array>}  - normalised trial objects from the server
 */


const BASE = '/api/trials';

export async function fetchTrials(condition = 'heart failure') {
    const { data } = await axios.get(BASE, { params: { condition } });
    return data;
}