# Google Calendar Order Reminders Setup

Every submitted order (from the website order form, or manually added in `/admin`) creates an event on a Google Calendar you choose, with a **popup + email reminder 24 hours before delivery**. It reuses the same service account as the [Google Sheets integration](08-Google-Sheets-Setup.md) — no separate credentials to manage — with one extra scope and one extra env var.

## 1. Enable the Calendar API

1. Go to [console.cloud.google.com](https://console.cloud.google.com), select the **same project** you used for Google Sheets.
2. Go to **APIs & Services → Library**, search for **Google Calendar API**, and click **Enable**.

No new service account is needed — the existing one (`GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`) is reused automatically.

## 2. Share your calendar with the service account

1. Open [calendar.google.com](https://calendar.google.com) (use whichever Google account's calendar you want order events to appear on — this can be your personal calendar).
2. On the left sidebar, hover your calendar under "My calendars" → click the **⋮** menu → **Settings and sharing**.
3. Under **Share with specific people or groups**, click **Add people**, paste in the same `client_email` you used for Sheets, and set permission to **Make changes to events**.
4. Scroll up to **Integrate calendar** and copy the **Calendar ID** — for your primary calendar this is usually just your Gmail address (e.g. `you@gmail.com`); for a secondary calendar it looks like `abc123@group.calendar.google.com`.

Without step 3, the service account can authenticate but will get a "permission denied" error trying to create events.

## 3. Add the value to EasyPanel

In your EasyPanel service's **Environment** tab, add:

```
GOOGLE_CALENDAR_ID=<the Calendar ID from step 2>
```

Redeploy. From then on:
- Every order (site or manual admin entry) creates a calendar event titled `🍽️ <reference> — <name> (<package>)` with the full order details in the description, at the chosen delivery date/time (or as an all-day event if no time was given).
- Google Calendar's own reminder system fires a **popup and email notification 24 hours before** — make sure notifications are enabled on whichever device/account you shared the calendar to.
- `/admin` shows a live connection status banner for Calendar, same as Sheets, so you can tell at a glance if it's working.

## Notes

- This is fully independent of Sheets/email — if it's not configured, orders are still accepted and logged normally, they just won't get a calendar event.
- Delivery-time parsing only understands the site's own time-slot format (e.g. `2:00 PM – 4:00 PM`, `12:00 NN – 2:00 PM`). Manual admin orders don't currently collect a delivery time, so they always create an all-day event on the delivery date.
