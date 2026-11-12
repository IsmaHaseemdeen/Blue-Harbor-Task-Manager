# Engineering decisions

- **Separate `api` and `web` directories:** required submission layout; clear boundaries.
- **TypeScript throughout:** shared mental model for data contracts and stronger editor tooling.
- **API on port 3001 / web on 3000:** avoids a local port collision and makes CORS explicit.
- **SQLite with Prisma (planned):** persistent data with minimal local setup.
- **Deliver in incremental milestones:** smaller reviewable commits with meaningful changes.

## Definition of done for milestone 1
1. Run `npm install` inside `api` and `web` (generates package-lock.json files).
2. Run `npm run build` inside both folders.
3. Run the API and verify `GET http://localhost:3001/health` returns `{ "status": "ok" }`.
4. Run the web app and verify `http://localhost:3000` loads.
5. Only then commit the files; do not include `node_modules` or secrets.
