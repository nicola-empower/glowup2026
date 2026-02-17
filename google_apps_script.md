# Google Apps Script Code ☁️

Copy all the code below into your Google Apps Script editor (`Extensions > Apps Script` in your Google Sheet).

This script handles:
1.  **GET**: Fetching your streak and history.
2.  **POST**: Saving your daily log, including the new **Evening Routine** and **Status** fields.

```javascript
/*
  Reclaim Backend Logic
  - Handles GET (Fetch History)
  - Handles POST (Save Daily Log)
*/

const SHEET_NAME_LOGS = "Logs";
const SHEET_NAME_SUMMARY = "Summary";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var rawData;
    try {
        rawData = JSON.parse(e.postData.contents);
    } catch (parseError) {
        // Fallback for form-data if JSON parse fails (less common in fetch but good for safety)
        rawData = e.parameter;
    }

    if (rawData.action === 'SAVE_DAY' || rawData.action === undefined) { // Allow unnamed actions if structure matches
      var date = rawData.date;
      var streak = rawData.streak;
      var data = rawData.data;
      
      var sheet = SpreadsheetApp.getActiveSpreadsheet();
      var logSheet = sheet.getSheetByName(SHEET_NAME_LOGS);
      
      // Create Logs sheet if missing
      if (!logSheet) {
        logSheet = sheet.insertSheet(SHEET_NAME_LOGS);
        logSheet.appendRow(["Timestamp", "Date", "Streak", "HP", "Status", "Water (ml)", "Vitamins", "Mood", "Routine Items", "Journal"]);
        logSheet.setFrozenRows(1);
      }
      
      // Format Routine Items (Array -> String)
      var routineString = "";
      if (data.eveningRoutine && Array.isArray(data.eveningRoutine)) {
        routineString = data.eveningRoutine.join(", ");
      } else if (data.eveningRoutine) {
        routineString = String(data.eveningRoutine);
      }

      // Append Row
      logSheet.appendRow([
        new Date(),       // Timestamp
        date,             // Date (YYYY-MM-DD)
        streak,           // Streak Count
        data.hp,          // HP (100)
        data.status,      // Status (evening/selfcare)
        data.water,       // Water
        data.vitamins,    // Vitamins (true/false)
        data.mood,        // Mood
        routineString,    // Evening Routine
        data.journal      // Journal Entry
      ]);
      
      // Update Summary Sheet (for GET requests)
      updateSummary(sheet, date, streak);
      
      return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var summarySheet = sheet.getSheetByName(SHEET_NAME_SUMMARY);
  
  // Default values if first time
  var history = [];
  var streak = 0;
  
  if (summarySheet) {
    // Assuming A2 is Streak, B2 is History JSON
    // Check if range has data
    if (summarySheet.getLastRow() >= 2) {
        var data = summarySheet.getRange("A2:B2").getValues();
        if (data[0][0] !== "") {
          streak = data[0][0];
          try {
            history = JSON.parse(data[0][1]);
          } catch (err) {
            history = [];
          }
        }
    }
  }

  // Return structure expected by App.jsx api.js
  var result = {
    status: 'success',
    history: history,
    streak: streak
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper to update the efficient summary for GET requests
function updateSummary(sheet, date, streak) {
  var summarySheet = sheet.getSheetByName(SHEET_NAME_SUMMARY);
  
  if (!summarySheet) {
    summarySheet = sheet.insertSheet(SHEET_NAME_SUMMARY);
    summarySheet.appendRow(["Current Streak", "History (JSON)"]);
    summarySheet.appendRow([0, "[]"]);
  }
  
  // Get existing history
  var history = [];
  var range = summarySheet.getRange("A2:B2");
  var existingData = range.getValues();
  
  if (existingData[0][1]) {
    try {
      history = JSON.parse(existingData[0][1]);
    } catch (e) {
        history = [];
    }
  }
  
  // Add new date if unique
  if (history.indexOf(date) === -1) {
    history.push(date);
  }
  
  // Write back
  range.setValues([[streak, JSON.stringify(history)]]);
}
```

## Setup Instructions

1.  Open your Google Sheet.
2.  **Extensions > Apps Script**.
3.  **Delete** any code currently in `Code.gs`.
4.  **Paste** the code above.
5.  Click **Deploy > New Deployment**.
6.  Select type: **Web app**.
7.  Description: "Update v2".
8.  Execute as: **Me** (your email).
9.  Who has access: **Anyone**.
10. Click **Deploy**.
11. **IMPORTANT:** If the URL changes (it might no longer end in `/exec` if you create a *new* one vs updating an existing deployment), copy the new URL and update `src/services/api.js`. Usually, if you hit "Manage Deployments" and edit the existing one to point to the "New Version", the URL stays the same. But "New Deployment" is safer.
