## Hello!

Below is a small task. Please complete it and place
your solution in a Git repository available on GitHub/BitBucket/GitLab etc.

## Task

Create a Next.js application containing a registration form for a new Pokemon trainer (trainer's name and age, and one starting Pokemon) according to the design available HERE.

## Requirements

- Please use Next.js and TypeScript in the implementation;
- You may use the new app router, but the “old” pages router is also fine;
- Choose the tools that suit you best;
- We also suggest using MUI and Styled Components (e.g. Emotion), but this is not mandatory. We simply use them in our current projects;
- All other libraries/tools/helpers are up to you — pick what makes your work easier;
- The application should work at least in Firefox and Chrome browsers;
- The provided resources include the IBM VGA font. Load it and use it across all elements of the application;
- On the Next.js server side, fetch information from the API about today's date (see: links at the bottom) and display it in the top-right corner of the page;
- The `Name of trainer` field should not be empty and must contain 2–20 characters;
- The `Age` field should accept numbers in the range 16–99;
- The `Pokemon name` field should be an autocomplete field and behave as follows:
    - When the user starts typing a name, the autocomplete sends a request to the endpoint `/api/search?name=<input value>`, which returns suggestions of starter Pokemon for the trainer;
    - The endpoint must be implemented by you as an API Route. Use the provided `.json` file as the data source;
    - Suggested Pokemon should be selected using fuzzy search — you may use the Fuse.js library for this;
    - Remember debounce and caching — the functionality should behave as if it were going to production;
    - When a Pokemon is selected from the list, its name becomes the input value and its preview is displayed in the window below;
    - Data about the selected Pokemon can be fetched from the PokeAPI (see links at the bottom);
- The Submit button should behave as follows:
    - If there are invalid values in the form do nothing and show error messages under the form fields;
        - If the fields are valid show a box with the text “Sukces!” and a button to reset the form;
- The Reset button should reset the entire form;
- Cover the whole application with appropriate tests;
- Don't forget to provide a README describing how to run your code.

## Nice to have

- Prepare scripts to run the development version (with hot reload) and the production version of the application using Docker.

    We want to learn how you work day-to-day.
    Don't boast about everything you can do, but choose appropriate tools for the situation.
    Implement the task as if you were working on a real project intended for production. Work without restrictions — everything is allowed (using helpers like Chat GPT is also allowed).

    If you don't know how to do something, or feel that a part takes too much time, still send us what you have. Not completing the task 100% will not disqualify you from the recruitment process.

    You have one week from today to submit the task, and we will get back to you with feedback within a maximum of 3 business days.
    Good luck!

## Links to necessary APIs

- [Pokemon API](https://pokeapi.co/docs/v2#pokemon)
- [Time API](https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Warsaw)

# Development notes
- [x] add favicon
- [ ] add metadata for seo
