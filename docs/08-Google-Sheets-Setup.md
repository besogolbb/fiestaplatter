# Google Sheets Order Log + Admin Dashboard Setup

Every submitted order is written to a Google Sheet via the real Google Sheets API, authenticated with a **service account** (Google's server-to-server OAuth 2.0 flow — no interactive sign-in, no refresh tokens to babysit, no consent screen shown to anyone). The same credentials both **write** new orders (called by the website) and **read** them back (called by the `/admin` dashboard).

## 1. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet. Name it something like "Fiesta Platter Orders".
2. Rename the first tab to **Orders**.
3. Grab the **Spreadsheet ID** from the URL — it's the long string between `/d/` and `/edit`:
   `https://docs.google.com/spreadsheets/d/`**`1AbCdEfGhIjKlMnOpQrStUvWxYz`**`/edit`
   Save that value, you'll need it in step 4.

## 2. Create a Google Cloud service account

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (top-left project picker → New Project). Name it "Fiesta Platter" or similar.
2. With that project selected, go to **APIs & Services → Library**, search for **Google Sheets API**, and click **Enable**.
3. Go to **APIs & Services → Credentials → Create Credentials → Service account**.
4. Give it a name (e.g. "fiesta-platter-sheets"), click through the remaining steps with defaults, and click **Done**.
5. Click into the service account you just created → **Keys** tab → **Add Key → Create new key → JSON**. This downloads a `.json` file — **keep it private, treat it like a password.**
6. Open that JSON file. You need two values from it:
   - `client_email` — looks like `fiesta-platter-sheets@your-project.iam.gserviceaccount.com`
   - `private_key` — a long block starting with `-----BEGIN PRIVATE KEY-----`

## 3. Share the sheet with the service account

1. Back in your Google Sheet, click **Share** (top right).
2. Paste in the `client_email` value from step 2 and give it **Editor** access. Uncheck "Notify people" (it's not a real inbox).
3. Click **Share**.

Without this step, the service account can authenticate but will get a "permission denied" error trying to read/write the sheet.

## 4. Add the values to EasyPanel

In your EasyPanel service's **Environment** tab, add:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=<client_email from the JSON file>
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=<private_key from the JSON file>
GOOGLE_SHEETS_SPREADSHEET_ID=<the Spreadsheet ID from step 1>
```

**For the private key:** copy the entire value from the JSON file exactly as it appears there — the JSON file already has it formatted with `\n` escape sequences (e.g. `-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n`). Paste that whole thing as one line into the EasyPanel field; don't try to convert the `\n`s into real line breaks.

Then also set the admin login credentials (unrelated to the sheet — these protect the dashboard itself):

```
ADMIN_PASSWORD=<a password you'll type in at fiestaplatter.com/admin>
ADMIN_SESSION_SECRET=<a long random string, used only to sign the session cookie>
```

Redeploy. From then on:
- Every order submitted on the site appends a row to the **Orders** tab (the header row is written automatically the first time).
- `fiestaplatter.com/admin` shows a password-gated dashboard (stats, a calendar of delivery dates, and a searchable table) reading live from that same sheet.

## Notes

- **Never commit the JSON key file or the private key to git.** It only belongs in EasyPanel's Environment tab and your own local `.env.local` (already gitignored).
- **If a key ever leaks**, go back to the service account's **Keys** tab in Google Cloud Console and delete it, then create a new one and update EasyPanel.
- The sheet is the only place order history lives — there is no separate database. Don't delete rows you want to keep; the admin dashboard has no undo.
- `/admin` is excluded from search engines (`robots.txt`) and password-protected, but the URL itself isn't secret — don't post a link to it publicly.
