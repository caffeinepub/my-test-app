# Specification

## Summary
**Goal:** Build a simple multiple-choice quiz app (“My Test App”) with three screens, question loading from Airtable (with safe server-side token handling), and a local fallback dataset.

**Planned changes:**
- Create Home, Quiz, and Result screens with navigation: Home → Quiz via “Start Test”, and Result → Home via “Restart Test” (resetting score and progress).
- Implement Quiz flow to show one question at a time with exactly four options (A–D), record the selected answer once per question, and increment score by +1 only when the selected option matches `CorrectAnswer`.
- Add a “Next” button to advance through questions; after the last question, navigate to Result and display “Your Score: X/Y”.
- Add Airtable-backed loading using columns `Question`, `OptionA`, `OptionB`, `OptionC`, `OptionD`, `CorrectAnswer`, with configurable Base ID, Table name/ID, and API token handled server-side (not bundled in the frontend).
- Provide a bundled local fallback question set used when Airtable is not configured or fails to load, with an understandable error/fallback state.
- Apply simple styling: white background, large readable text, colorful option buttons, and responsive mobile-friendly layout.

**User-visible outcome:** Users can start a quiz, answer multiple-choice questions one-by-one, navigate through them with “Next”, see a final “Your Score: X/Y” result, and restart the test; questions load from Airtable when configured, otherwise the app uses a built-in fallback set.
