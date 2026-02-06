# JJIT — Pokémon Trainer Registration (Next.js)

This repository contains a small Next.js + TypeScript app implementing a Pokémon Trainer registration form used for demonstration and interview purposes.

## What this project implements

- A registration form for a trainer (name, age, Pokémon selection).
- Autocomplete search backed by an API route that performs fuzzy search over the provided `pokemon.json` dataset (Fuse.js + server-side caching + debounce on the client).
- Pokémon details preview fetched via a server-side proxy route to the PokeAPI with caching.
- Server action to handle form submission with shared Zod validation (same schema on client and server).
- Lightweight component and integration tests using Vitest + React Testing Library.

The original task and requirements are documented in `TODO.md` and `PLAN.md` at the repository root.

## Quickstart

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Run tests:

```bash
pnpm test
```

Run coverage:

```bash
pnpm test:coverage
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

ANALYZE_BUNDLE - set to `true` to enable bundle analysis with `next-bundle-analyzer`
SERVER_URL e.g. http://localhost:3000. In production, this should be set to the actual URL where the app is hosted.
POKEAPI_BASE_URL - base URL for the PokeAPI as provided for the task.
TIME_API_URL= URL for the Time API as provided for the task.

## Deployment

You can see [the live version of the app](https://jjit.coolify.hallala.work) deployed to my VPS in a docker container.
But the app can be easily deployed anywhere Node runs.

## Requirements (summary)

- Use Next.js + TypeScript.
- Trainer `name` must be 2–20 characters.
- Trainer `age` must be between 16 and 99.
- `Pokemon name` is an autocomplete that queries `/api/search` (fuzzy search + debounce + caching) and requires selection from suggestions.
- Selected Pokémon details are displayed below the input (fetched through `/api/details`).
- Submitting validates via Zod; valid submissions show a success dialog; reset clears the form.

Refer to `TODO.md` for the full original checklist and acceptance criteria.

## Project structure (relevant files)

- `app/(frontend)/...` - all the frontend pages and components:`
- `app/api/` - API routes for search and details (form submission is a server action colocated with the form component).

- `src/components/` — reusable UI components and primitives (buttons, inputs, etc).
- `src/utils/` — utility functions shared across the app
- `src/tests/` — global test setup and utilities.

## Routes

- `/` — registration form page
- `/ui` — a simple page showcasing UI components and their states (not explicitly required, but useful for review and testing, like a super simple Storybook)

## Testing

- Tests use Vitest + @testing-library/react. Global test setup is in `src/tests/setup.ts`.
- Test files are colocated with their respective components or routes (e.g. `register_form.test.tsx` next to `register_form.tsx`).
- to run tests: `pnpm test`
- to run tests with coverage: `pnpm test:coverage`

---
