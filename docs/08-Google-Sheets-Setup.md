# Google Sheets Order Log + Admin Dashboard Setup

Every submitted order is sent to a Google Sheet via a small Apps Script "web app" — no Google Cloud project, no service account, no API keys to manage. The same webhook both **writes** new orders (called by the website) and **reads** them back (called by the `/admin` dashboard).

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet. Name it something like "Fiesta Platter Orders".
2. Rename the first tab to **Orders** (the script creates it automatically if you skip this, but naming it up front avoids confusion).

## 2. Add the script

1. In the spreadsheet, go to **Extensions → Apps Script**.
2. Delete anything in the default `Code.gs` file and paste this in full:

```javascript
// ── Change this to a long random string. Use the SAME value as
// GOOGLE_SHEETS_WEBHOOK_SECRET in your website's environment variables. ──
var SHARED_SECRET = "REPLACE_WITH_A_LONG_RANDOM_STRING";

var HEADERS = [
  "Submitted At", "Reference", "Name", "Phone", "Email", "Facebook",
  "Event Type", "Guests", "Delivery Date", "Delivery Time", "Address",
  "Package", "Add-ons", "Payment Method", "Special Instructions",
  "Estimated Total (PHP)"
];
var KEYS = [
  "submittedAt", "reference", "name", "phone", "email", "facebook",
  "eventType", "guests", "deliveryDate", "deliveryTime", "address",
  "packageName", "addOns", "paymentMethod", "specialInstructions",
  "estimatedTotal"
];

function getOrdersSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Orders");
  if (!sheet) sheet = ss.insertSheet("Orders");
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Called by the website's Server Action every time an order is submitted.
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.secret !== SHARED_SECRET) {
      return jsonOutput({ ok: false, error: "unauthorized" });
    }

    var sheet = getOrdersSheet();
    sheet.appendRow([
      new Date().toISOString(),
      data.reference || "", data.name || "", data.phone || "",
      data.email || "", data.facebook || "", data.eventType || "",
      data.guests || "", data.deliveryDate || "", data.deliveryTime || "",
      data.address || "", data.packageName || "", data.addOns || "",
      data.paymentMethod || "", data.specialInstructions || "",
      data.estimatedTotal || ""
    ]);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

// Called by the /admin dashboard to load all orders.
function doGet(e) {
  try {
    if (!e.parameter.secret || e.parameter.secret !== SHARED_SECRET) {
      return jsonOutput({ ok: false, error: "unauthorized" });
    }

    var sheet = getOrdersSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return jsonOutput({ ok: true, rows: [] });

    var values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
    var rows = values.map(function (row) {
      var obj = {};
      KEYS.forEach(function (key, i) {
        var v = row[i];
        obj[key] = (v instanceof Date) ? v.toISOString() : String(v);
      });
      return obj;
    });

    return jsonOutput({ ok: true, rows: rows });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}
```

3. Replace `REPLACE_WITH_A_LONG_RANDOM_STRING` on the first line with a long random string of your own (mash the keyboard, or use a password generator — 30+ characters). Keep this value, you'll need it again in step 4.
4. Save the project (File → Save, or Ctrl/Cmd+S). Name it "Orders Webhook" or similar.

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**. Google will ask you to authorize the script — approve it (it's your own script, only touching your own sheet).
5. Copy the **Web app URL** it gives you (looks like `https://script.google.com/macros/s/AKfycb.../exec`).

## 4. Add the two values to EasyPanel

In your EasyPanel service's **Environment** tab, add:

```
GOOGLE_SHEETS_WEBHOOK_URL=<the Web app URL from step 3>
GOOGLE_SHEETS_WEBHOOK_SECRET=<the same random string from step 2>
```

Then also set the admin login credentials (these are separate from the sheet secret):

```
ADMIN_PASSWORD=<a password you'll type in at fiestaplatter.com/admin>
ADMIN_SESSION_SECRET=<another long random string, different from the sheet secret>
```

Redeploy. From then on:
- Every order submitted on the site appends a row to the **Orders** tab.
- `fiestaplatter.com/admin` shows a password-gated dashboard (stats, a calendar of delivery dates, and a searchable table) reading live from that same sheet.

## Notes

- **If you ever change `SHARED_SECRET` in the Apps Script**, update `GOOGLE_SHEETS_WEBHOOK_SECRET` in EasyPanel to match, or the webhook will start rejecting requests.
- **If you edit the Apps Script code later**, you must create a **new deployment** (Deploy → Manage deployments → Edit → New version) for changes to take effect — editing the code alone does not update the live web app.
- The sheet is the only place order history lives — there is no separate database. Don't delete rows you want to keep; the admin dashboard has no undo.
- `/admin` is excluded from search engines (`robots.txt`) and password-protected, but the URL itself isn't secret — don't post a link to it publicly.
