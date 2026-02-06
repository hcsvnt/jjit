## Plan: Pokemon Trainer Registration Implementation

### Backend (API Routes)

- [x] /search - Fuzzy search for Pokemon names with caching\*
    - leverage Fuse.js
    - validate query parameter `name` using Zod schema
    - read available names from provided pokemon.json file
    - cache results to minimize file reads\*\*
    - return 200 with suggestions for valid input
    - return 404 if no matches found
    - tests:
        - don't test the schema itself, it's straightforward enough to be trusted
        - test that valid queries trigger mocked file read
        - test that results are cached after first read

- [x] /details - proxy for PokeAPI with caching\*
    - validate query parameter `id` using Zod schema
    - fetch Pokemon details from PokeAPI by id
    - cache results to minimize external API calls
    - return 200 with Pokemon details for valid id
    - return 404 if Pokemon not found
    - tests:
        - test that valid queries trigger mocked fetch to PokeAPI
        - test that results are cached after first fetch

* Assuming the application runs on a single server instance, in-memory caching should suffice for this task. In a real production environment, a distributed cache like Redis could be used.
  Either way this is better than an on-client caching like SWR or React Query, because it centralizes the cache for all users.

\*\* Pretend it is not feasible to keep the entire pokemon.json in memory constantly.

- [x] submit - Handle form submissions in a server action\*\*\*
    - validate request body ('name', 'age', 'pokemonId') using Zod schema
    - this endpoint does no business logic
    - return 200 with success message for valid submissions
    - return 400 with error details for invalid submissions
    - tests:
        - test that valid submissions return 200
        - test that invalid submissions return 400 with appropriate error messages

\*\*\* Using a server action here allows us to leverage Next.js's built-in form handling capabilities, simplifying the implementation and potentially enhancing security (if using the right Next.js version...), as well as enabling both javascript-free submissions and client-side validation.

#### Frontend (Next.js App)

- Registration Form Page
    - Display current date in the top right corner by fetching from Time API on server side
    - Form fields:
        - Trainer's Name (text input)
        - Age (number input)
        - Pokemon (autocomplete input)
        - no unit tests are necessary for these components, we shouldn't need to test external libraries like MUI
    - Form validation:
        - Name: required, 2-20 characters
        - Age: required, 16-99
        - Pokemon: required, must be selected from suggestions
    - Autocomplete functionality:
        - pretend the underlying dataset is too large to load initially
        - fetch suggestions from /api/search as user types
        - debounce input to limit API calls (200ms)\*\*\*\*
        - cache suggestions to improve performance
        - keep pokemon id to fetch details on selection
        - integration tests:
            - test that typing in the pokemon input triggers API calls to /api/search with debounce
            - ??? test that selecting a suggestion updates the input value and fetches details from /api/details
    - Once selected, in a separate fetch to PokeAPI, retrieve Pokemon details by id and display them in a preview box below the input
    - Submit button:
        - on click, validate form fields using the same zod schema as backend
        - if valid, send data to /api/submit and show success message, reset button
        - if invalid, show error messages below respective fields
    - Reset button:
        - on click, clear all form fields and error messages
        - integration tests:
            - test that clicking reset button clears the form and error messages
    - Integration tests:
        - test that form validation works and shows error messages for invalid inputs
        - test that valid form submission triggers server action and shows success message
        - test that clicking reset button clears the form and error messages

- UI Page
    - a page to display ui elements and their variants and states for review
    - like a super-simple storybook (which would be overkill for this)

\*\*\*\* 200ms is below typical human reaction time, so it should feel instantaneous while still reducing API calls. This is always a trade-off, the more we want to spare API calls, the longer the debounce delay used,
but here the backend lookup is quite fast and cached, so we can afford better UX.

# Development notes

- [x] add favicon
- [x] not explicitly required and missing in the design file, but adjust for mobile devices
- [x] add metadata for seo
- [] dockerize
- [] add README with instructions to run the app and tests etc
- [] deploy
