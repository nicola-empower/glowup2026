const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxswB4sDqmL37OkfJVGhce236I_aTv1bF87tcgSZcgUSrVRObUbyWh8Oo5X_j3Z2OP6/exec';
/**
 * Fetches user history and streak from Google Sheets.
 */
export async function fetchUserData() {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const data = await response.json();
        if (data.status === 'success') {
            return {
                history: data.history,
                streak: parseInt(data.streak, 10)
            };
        }
    } catch (error) {
        console.error("Failed to fetch cloud data:", error);
    }
    return null;
}

/**
 * Saves daily result to Google Sheets.
 * @param {Object} payload { date: 'YYYY-MM-DD', streak: number, data: Object }
 */
export async function saveDailyLog(payload) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // 'no-cors' is required for Google Apps Script simple triggers to accept POST from browser
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'SAVE_DAY',
                ...payload
            })
        });
        // Note: With no-cors, we get an opaque response, so we can't check .json()
        // We assume success if no network error thrown.
        return true;
    } catch (error) {
        console.error("Failed to save to cloud:", error);
        return false;
    }
}
