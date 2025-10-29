# Fluid Booking Form UX/UI – Code Summary

## Project Layout
- `src/index.pug` holds the full markup for the booking widget. Each `.member` block predefines avatar, name, calendar placeholder, slots list, booking form, and completion message. Wrapper `.wrap` and state classes (`.member-selected`, `.date-selected`, `.slot-selected`, `.booking-complete`) drive UI transitions.
- `src/style.scss` defines the UI theme and all motion. A rem-based sizing system and nested selectors animate visibility, transforms, and pointer-events for each interaction state. Compiled CSS is shipped in `dist/style.css` alongside the static `dist/index.html` and `dist/script.js` assets.
- `src/script.js` (jQuery) attaches client-only behavior: selecting staff, generating the calendar, populating random time slots, handling slot selection, and toggling booking completion. Interaction relies on mutating classes on `.wrap` and the active `.member`.

## Interaction Flow
1. Clicking a staff `.member` should add `.selected`, toggle `.wrap.member-selected`, and call `addCalendar` to build that member’s calendar.
2. `addCalendar` renders the current month, disables weekends and past days, and rebinds date listeners (`invokeCalendarListener`).
3. Selecting a date triggers `addSlots`, which produces 1–6 random time slots, shows the slots list (`.wrap.date-selected`), and wires `invokeSlotsListener`.
4. Choosing a slot marks `.slot-selected`, focusing the active form. Submitting the form toggles `.booking-complete`, displaying the confirmation panel; `.deselect-*` and `.restart` links reset state.

## Key Observations
- Bug: `src/script.js:1` references `e.preventDefault()` and `e.stopPropagation()` inside the `.member` click handler without an `e` parameter, causing a `ReferenceError` on the first click. Pass the event argument to resolve it.
- Calendar scope is limited to the current month; there is no month navigation or real data integration. Slot availability is random per click and not persisted.
- The project assumes an external tool (e.g., CodePen) to compile Pug/SCSS; no local build scripts are present.

## Suggested Next Steps
1. Fix the missing click-handler event argument so selection works.
2. Replace the random slot generator with deterministic availability driven by actual data or configuration.
3. Add compilation tooling (Pug/SCSS build) or migrate to a modern component framework if the concept evolves beyond a demo.
