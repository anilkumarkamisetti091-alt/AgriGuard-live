# AgriGuard

A farmer-support website with crop scanning UI, weather information, market-price display, fertilizer planning, scheme links, and specialist enquiries.

## Field Desk: practical tools for day-to-day farming

Open [`field-desk.html`](field-desk.html) for the new installable, offline-ready Field Desk:

- Private field diary for crop, field, growth stage, observed symptoms, and actions taken.
- Farm task planner for farmer-entered reminders, with optional browser notifications where supported.
- Local income and expense book with recorded totals and balance.
- Seed quantity calculator using the farmer's own seed rate, plus a water-depth-to-volume conversion. Neither tool prescribes agronomic rates.
- Download/import backup and clear locally stored Field Desk records.
- English, Hindi, and Telugu interface; responsive layout and accessibility focus/assistive status.
- Service-worker app shell for reopening the Field Desk after its first successful online visit.

Records are stored in browser `localStorage` on the current device only. They are not uploaded, synced, or shared. Download a backup before clearing site data or changing devices. Browser storage may be removed by the device/browser, so it is not a substitute for paper records or a separate backup.

### Offline and installation

Deploy the site over HTTPS (or run it on `localhost` for development), open `field-desk.html` once while connected, and allow the service worker to finish installing. Then the Field Desk page and its core tools can open offline in the same browser. On supported browsers, use the browser's **Install app** / **Add to Home Screen** option. Offline support does not make weather forecasts, external government sites, or specialist enquiry submission available without internet.

To test locally, serve the repository directory rather than opening the HTML file directly:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/field-desk.html`. Service workers do not work from a `file://` URL. The existing main site's live weather and server contact form continue to require network access.

## Existing Farmer Support Tools

Open [`farmer-tools.html`](farmer-tools.html) for regional weather, an illustrative irrigation estimate, farmer-entered market comparisons, contact notes, an insurance checklist, soil-health guidance, learning links, and private field notes. Its locally entered records are stored in the browser on the current device.
