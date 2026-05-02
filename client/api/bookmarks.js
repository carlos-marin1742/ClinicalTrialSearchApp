import axios from "axios";
const BASE = '/api/bookmarks';
/**
 * Fetch all saved bookmarks.
 * @returns {Promise<Array>}  - rows from the bookmarks table
 */

export async function getBookmarks() {
    const { data } = await axios.get(BASE);
    return data;
}
/**
 * Add a bookmark.
 * @param {string} nct_id  - NCT identifier, e.g. "NCT04321234"
 * @param {string} title   - human-readable trial title
 * @returns {Promise<Object>} - the newly inserted row (or undefined on conflict)
 */
export async function addBookmark(nct_id, title) {
    const { data } = await axios.post(BASE, { nct_id, title });
    return data;
}
/**
 * Remove a bookmark by NCT ID.
 * @param {string} nctId
 * @returns {Promise<{success: boolean}>}
 */
export async function removeBookmark(nctId) {
    const { data } = await axios.delete(`${BASE}/${nctId}`);
    return data;
}