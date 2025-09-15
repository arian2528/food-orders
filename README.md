# food-orders
A food order full stack app

---

## Documentation & Architecture

- For full project instructions, see `.github/instructions.md`.
- UI/UX preferences and code snippets: `ui-preference-code-snippet.ts`.
- Database, migrations, and schema: see `database/` and `.github/database/`.
- Authentication options and setup: see `.github/auth/`.

## Quick Start

1. **Install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```
2. **Start PostgreSQL (Docker):**
   ```sh
   docker-compose up -d
   ```
3. **Run database migrations:**
   ```sh
   yarn db:migrate
   # or
   npx prisma migrate dev
   ```
4. **Start the app:**
   ```sh
   yarn dev
   # or
   npm run dev
   ```

## Scripts
- `yarn dev` — Start Next.js app in development mode
- `yarn build` — Build for production
- `yarn start` — Start production server
- `yarn lint` — Lint code
- `yarn db:migrate` — Run Prisma migrations
- `yarn db:push` — Push schema to database
- `yarn db:studio` — Open Prisma Studio

## Environment Variables
- Copy `.env.example` to `.env` and fill in required values (DB, auth, etc).

## Features & Best Practices
- **API timeouts:** All API calls should timeout after 5 seconds (see `.github/instructions.md`).
- **Caching:** Uses SSG, ISR, SSR, and SWR/React Query for optimal caching (see `.github/instructions.md`).
- **Event-driven design:** Supports pub/sub and event-driven workflows (see `.github/instructions.md`).
- **CI/CD:** GitHub Actions for testing, linting, and deployment (see `.github/instructions.md`).
- **Multithreading/parallelism:** Use worker threads, Promise.all, and background jobs for efficiency (see `.github/instructions.md`).

## Validation & Messaging

- **Schema Validation:** Uses [Zod](https://zod.dev/) for robust server-side and API input validation. All API endpoints validate incoming data with Zod schemas for type safety and security. See `.github/instructions.md` for best practices and examples.
- **Email & SMS:** Integrates with [Mailgun](https://www.mailgun.com/) for sending transactional emails and SMS notifications (e.g., order confirmations, status updates, notifications). Configure your Mailgun API keys in `.env` and see `.github/instructions.md` for usage patterns.

---

For detailed architecture, testing, and advanced usage, always refer to `.github/instructions.md`.
