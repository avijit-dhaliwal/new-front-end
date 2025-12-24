# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project. Primary locations:
- `app/`: route segments and layouts (e.g., `app/ai-suites`, `app/api/chadis`), plus `app/globals.css`.
- `components/`: shared React components; `components/ui/` contains reusable primitives.
- `lib/`: utilities and shared helpers (e.g., `lib/utils.ts`).
- `types/`: TypeScript declaration files.
- `public/`: static assets served at the site root.
- `cloudflare-workers/`: worker scripts and Wrangler configs for serverless endpoints.

## Build, Test, and Development Commands
Run these from the repo root:
- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create the production build.
- `npm run start`: serve the production build locally.
- `npm run lint`: run Next.js ESLint checks.
For worker deployment/testing, follow `cloudflare-workers/deploy.md` and use `wrangler deploy ...`.

## Coding Style & Naming Conventions
- TypeScript + React with 2-space indentation, single quotes, and no semicolons (follow existing patterns).
- Components use PascalCase filenames (e.g., `components/LandingHero.tsx`).
- Route directories use kebab-case (e.g., `app/get-started`).
- Styling is primarily Tailwind CSS; keep shared styles in `app/globals.css` and avoid custom CSS unless needed.
- Run `npm run lint` before submitting changes.

## Testing Guidelines
There is no dedicated test runner configured in `package.json`. Current expectations:
- Run `npm run lint` for static checks.
- Perform manual smoke tests for critical routes you touched.
- For worker endpoints, use `cloudflare-workers/test-voice-worker.js` or the curl examples in `cloudflare-workers/deploy.md`.
If you add tests, follow framework defaults and document how to run them.

## Commit & Pull Request Guidelines
Recent commits use short, imperative summaries (e.g., "Fix mobile UI issues", "Update homepage tagline"). Keep messages concise and single-line.
Pull requests should include:
- A brief summary and testing notes.
- Linked issue or task, if applicable.
- Screenshots or GIFs for UI changes.

## Configuration & Secrets
Use `.env.local` for local secrets. Start from `.env.example` or `.env.local.example`, and follow `env.md` plus `GOOGLE_SHEETS_SETUP.md` for required values. Never commit real API keys.
