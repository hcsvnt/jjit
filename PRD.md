# PRD: Pokemon Trainer Registration

## 1. Product overview

### 1.1 Document title and version

- PRD: Pokemon Trainer Registration
- Version: 0.1

### 1.2 Product summary

- Brief overview: A small Next.js + TypeScript application that lets a user register a new Pokemon trainer by entering a trainer name, age, and selecting one starter Pokemon. The form enforces validation rules, uses a server-backed fuzzy-search autocomplete for Pokemon selection, and displays the current date fetched on the server.
- Scope: Single-page registration flow, server API route for fuzzy search (using a provided JSON), client-side autocomplete with debounce & cache, Pokemon preview via PokeAPI, tests, and an optional Docker setup for development and production runs.

## 2. Goals

### 2.1 Business goals

- Provide a production-like candidate submission demonstrating frontend and full-stack skills.
- Validate candidate ability to build a small, tested, and well-structured Next.js app with TypeScript.
- Show competence with API integration, UX, and performance-minded client code (debounce, cache).

### 2.2 User goals

- Quickly create a trainer profile with minimal friction.
- Reliably find and preview starter Pokemon using fuzzy search suggestions.
- Receive clear validation feedback and successful confirmation when the form is valid.

### 2.3 Non-goals

- Authenticated multi-user management (beyond optional security considerations).
- Full backend persistence or production-ready DB integration — app can use temporary in-memory or file-based data for the exercise.

## 3. User personas

### 3.1 Key user types

- Hiring reviewer (frontend engineer)
- Hiring reviewer (full-stack engineer)
- Candidate (developer implementing the task)

### 3.2 Basic persona details

- **Hiring reviewer (frontend)**: Evaluates UI, accessibility, validation, tests, and component structure.
- **Hiring reviewer (full-stack)**: Evaluates API route design, server-side fetching, caching, and code organization.

### 3.3 Role-based access

- **Reviewer**: read-only access to the repository and can run the app locally or in Docker.

## 4. Functional requirements

- **Registration form (Priority: High)**
    - Collect trainer name, age, and starter Pokemon.
    - `Name of trainer`: required, 2–20 characters.
    - `Age`: required, integer 16–99.
    - `Pokemon name`: autocomplete input with suggestions from `/api/search`.
    - Submit button: validates fields; on success shows modal/box with “Sukces!” and reset button; on error shows field-level errors.
    - Reset button: clears all fields and preview.

- **Autocomplete API route (Priority: High)**
    - Endpoint: `/api/search?name=<query>` implemented as Next.js API Route.
    - Use the provided `.json` as the data source.
    - Use fuzzy search (e.g., Fuse.js) to score and return suggestions.
    - Implement server-side caching for repeated queries.

- **Client autocomplete behavior (Priority: High)**
    - Debounce user input (e.g., 250–400ms) before calling `/api/search`.
    - Implement client-side cache for recent queries.
    - Selecting a suggestion sets the input and triggers display of Pokemon preview.

- **Pokemon preview (Priority: Medium)**
    - Fetch selected Pokemon details from PokeAPI for a preview (sprite, types, short info).
    - Gracefully handle network errors and show fallback UI.

- **Server-side date (Priority: Low)**
    - On server render, fetch the current date from Time API and render it in the top-right corner.

- **Tests (Priority: High)**
    - Unit tests for validation logic and key components.
    - Integration tests for autocomplete flow and API route behavior.

## 5. User experience

### 5.1 Entry points & first-time user flow

- User opens the app (root page). Top-right shows current date (server-rendered). Form is centered and displays inputs: `Name`, `Age`, `Pokemon name` (autocomplete), preview area, and Submit/Reset buttons.

### 5.2 Core experience

- **type name**: User types a name; inline validation shows length requirements.
- **enter age**: Numeric input restricts values and shows errors if out of range.
- **search pokemon**: Typing triggers debounced suggestions from `/api/search`; selecting populates the input and shows preview below.
- **submit**: If invalid — show errors; if valid — show success box with reset.

### 5.3 Advanced features & edge cases

- Handle empty autocomplete results with a friendly “no matches” state.
- Handle slow or failing PokeAPI responses with a retry option or graceful fallback preview.
- Prevent duplicate requests using debounce + cache; rate-limit server-side if necessary.

### 5.4 UI/UX highlights

- Use IBM VGA font across the app.
- Clear visual hierarchy: form labels, input fields, helper/error texts, prominent Submit primary action, secondary Reset action.

## 6. Narrative

The user lands on a focused registration page, supplies a valid trainer name and age, uses a responsive autocomplete to pick a starter Pokemon, previews the Pokemon, and submits the form. The system validates input, displays clear feedback, and confirms success with a reset option.

## 7. Success metrics

### 7.1 User-centric metrics

- Time to complete registration (target: < 60s for first-time users).
- % of successful submissions without support (target: > 95%).

### 7.2 Business metrics

- Candidate implementation completeness (manual review checklist pass rate).

### 7.3 Technical metrics

- Autocomplete latency (p95 target < 300ms after debounce and cache).
- Test coverage for core logic (target: unit + integration for key flows).

## 8. Technical considerations

### 8.1 Integration points

- `/api/search` — Next.js API Route using provided `.json`.
- PokeAPI — external API for selected Pokemon details.
- Time API — external API to fetch current date/time for server render.

### 8.2 Data storage & privacy

- No persistent user storage required; if implemented, treat trainer data as non-sensitive.

### 8.3 Scalability & performance

- Server-side caching for frequent `/api/search` queries.
- Client-side debounce and query caching to reduce network calls.

### 8.4 Potential challenges

- Handling PokeAPI outages.
- Ensuring fuzzy search returns helpful starter suggestions.

## 9. Milestones & sequencing

### 9.1 Project estimate

- Size: Small — Time estimate: 2–3 days for a complete candidate submission (including tests).

### 9.2 Team size & composition

- Team size: 1 developer (candidate) — Roles: frontend + backend (Next.js).

### 9.3 Suggested phases

- **Phase 1**: core form and validation (1 day)
    - Deliverables: inputs, validation rules, Submit/Reset behavior, tests for validation.
- **Phase 2**: autocomplete API route + client (0.5–1 day)
    - Deliverables: `/api/search` using provided `.json`, Fuse.js fuzzy search, debounce + client cache, tests.
- **Phase 3**: Pokemon preview and server date (0.5 day)
    - Deliverables: PokeAPI integration, server-side Time API fetch and top-right display.
- **Phase 4**: polish, tests, Docker (0.5 day)
    - Deliverables: styling (IBM VGA), accessibility checks, Docker dev/prod scripts, final tests.

## 10. User stories

### 10.1 Fill trainer name

- **ID**: GH-001
- **Description**: As a user, I want to enter my trainer name so the app saves my identity.
- **Acceptance criteria**:
    - Input accepts text between 2 and 20 characters.
    - If empty or out of range, a clear error message is shown.

### 10.2 Fill trainer age

- **ID**: GH-002
- **Description**: As a user, I want to enter my age so the app records my trainer age.
- **Acceptance criteria**:
    - Input accepts integers only in range 16–99.
    - If invalid, an inline error is shown.

### 10.3 Select starter pokemon via autocomplete

- **ID**: GH-003
- **Description**: As a user, I want to search and select a starter Pokemon using autocomplete suggestions.
- **Acceptance criteria**:
    - Typing triggers a debounced request to `/api/search?name=<query>`.
    - Results are fuzzy-matched and ordered by relevance.
    - Selecting a result sets the input value and shows a Pokemon preview below.

### 10.4 Preview pokemon details

- **ID**: GH-004
- **Description**: As a user, I want to preview the selected Pokemon's sprite and types.
- **Acceptance criteria**:
    - After selection, the app fetches PokeAPI details and displays at least a sprite and types.
    - If the fetch fails, a friendly error or fallback is displayed.

### 10.5 Submit form

- **ID**: GH-005
- **Description**: As a user, I want to submit the form and receive confirmation when data is valid.
- **Acceptance criteria**:
    - If any field is invalid, submission is blocked and field-level errors are shown.
    - If all fields are valid, show a confirmation box with text “Sukces!” and a reset button.

### 10.6 Reset form

- **ID**: GH-006
- **Description**: As a user, I want to reset the form to start over.
- **Acceptance criteria**:
    - Clicking Reset clears all inputs and the Pokemon preview.

### 10.7 API route fuzzy search

- **ID**: GH-007
- **Description**: As a reviewer, I want an API route that performs fuzzy search over the provided `.json` dataset.
- **Acceptance criteria**:
    - `/api/search` returns JSON suggestions for a query parameter `name`.
    - Server uses fuzzy matching (Fuse.js or equivalent).
    - Queries are cached server-side for repeated requests.

### 10.8 Testing

- **ID**: GH-008
- **Description**: As a reviewer, I want automated tests that validate key behaviors.
- **Acceptance criteria**:
    - Unit tests for validation logic exist.
    - Integration tests cover autocomplete flow and selection.

### 10.9 Authentication and security

- **ID**: GH-009
- **Description**: As a reviewer, I want basic security considerations documented even if auth is not implemented.
- **Acceptance criteria**:
    - PRD documents that no sensitive data is collected and that any future persistence should protect personal data.
    - If auth is added, it must use secure storage and avoid exposing secrets in client bundles.

## Final checklist

- All user stories are testable and listed (GH-001 through GH-009).
- Acceptance criteria are specific and measurable.
- Server-side date and `/api/search` integration points are documented.
- Docker is marked as nice-to-have and included in phase 4 if implemented.

---

Please review and confirm if you want me to create GitHub issues for the user stories.
