# AgriGuard

A farmer-support website with crop scanning UI, weather information, market-price display, fertilizer planning, scheme links, and specialist enquiries.

## Farmer Support Tools

Open [`farmer-tools.html`](farmer-tools.html) for a dedicated set of practical tools:

- Regional or approximate-location weather forecast and basic weather-risk reminders (Open-Meteo).
- A clearly labeled, illustrative irrigation planning estimate.
- Farmer-entered market offer comparisons with links to e-NAM and AGMARKNET. Submitted prices are not live market data.
- Local storage, transport, buyer, equipment, and farm-labour contact notebook.
- Crop-insurance claim reminder checklist and official scheme/soil-health links.
- Soil-health actions, trusted ICAR/KVK learning links, and a private field-notes notebook.
- English, Hindi, and Telugu interface text for the new tools.

Entries in these new tools use browser `localStorage` on the current device only; there is no shared marketplace or public community backend. Browser data can be cleared with the page's **Clear saved data** button. Weather requires an internet connection and is not an official warning service. Irrigation figures are illustrative estimates, not agronomic prescriptions. Always verify prices, insurance deadlines, scheme eligibility, and crop advice with official sources or qualified local agricultural staff.

## Run locally

Serve the repository directory using a local web server (for example, `python -m http.server`) and open `farmer-tools.html`. Weather/geolocation features may require HTTPS or localhost. The existing Flask API in `app.py` is used for specialist contact requests from the main site.
