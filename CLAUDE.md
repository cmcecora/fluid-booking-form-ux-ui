# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fluid booking form UX/UI concept originally created on CodePen. It demonstrates a multi-step booking flow with animated transitions for selecting staff members (or medical tests), dates, time slots, and completing bookings. The project is a front-end prototype focused on creating a frictionless user experience through smooth animations.

## Technology Stack

- **HTML**: Generated from Pug templates
- **CSS**: Generated from SCSS/Sass
- **JavaScript**: jQuery-based interactive functionality
- **Build**: Manual compilation (Pug → HTML, SCSS → CSS)

## Project Structure

```
src/               # Source files
  ├── index.pug    # Pug template (compiles to dist/index.html)
  ├── style.scss   # Sass styles (compiles to dist/style.css)
  └── script.js    # JavaScript (copied to dist/script.js)
dist/              # Compiled/built files for deployment
  ├── index.html   # Compiled HTML
  ├── style.css    # Compiled CSS
  └── script.js    # JavaScript
```

## Build Commands

This project requires Pug and Sass compilers to be installed globally:

```bash
# Compile Pug template to HTML
pug src/index.pug -o dist/

# Compile SCSS to CSS
sass src/style.scss dist/style.css

# Copy JavaScript to dist (if modified)
cp src/script.js dist/script.js

# Preview the application
open dist/index.html
```

**Important**: There is no package.json or automated build system. All compilation must be done manually after editing source files.

## Architecture

### State Management

The application uses CSS classes on the `.wrap` container to manage the booking flow state:

- `member-selected`: A staff member/test has been selected
- `date-selected`: A date has been chosen from the calendar
- `slot-selected`: A time slot has been selected
- `booking-complete`: The booking form has been submitted

These states cascade, with each stage revealing new UI elements through CSS transitions.

### Animation System

The SCSS uses extensive CSS transforms and transitions to create fluid animations:

- **Timing variables**: `$short` (300ms), `$mid` (500ms), `$long` (800ms)
- **Easing**: Custom cubic-bezier easing stored in `$ease-in-out`
- **3D transforms**: `perspective()` and `translateZ()` create depth effects
- **Staggered transitions**: Sequential `transition-delay` on child elements creates cascading effects

### JavaScript Flow

1. **Member selection** (`src/script.js:1-9`): Clicking a `.member` triggers calendar generation via `addCalendar()`
2. **Calendar generation** (`src/script.js:89-144`): Dynamically creates a calendar table, disables weekends and past dates
3. **Date selection** (`src/script.js:38-51`): Clicking a calendar date triggers slot generation via `addSlots()`
4. **Slot generation** (`src/script.js:68-85`): Randomly creates 1-6 available time slots
5. **Slot selection** (`src/script.js:54-64`): Reveals the booking form
6. **Form submission** (`src/script.js:32-36`): Shows confirmation message

### Reset Functionality

Each step has a "change" button (`.deselect-member`, `.deselect-date`, `.deselect-slot`) that removes corresponding state classes, allowing users to step back in the flow.

## Customization Notes

### Modifying Content

To change the bookable items (staff members, medical tests, etc.):
1. Edit `src/index.pug` - modify `.member` blocks with new names and avatar images
2. Update the instruction text in `.instructions .first`
3. Recompile with `pug src/index.pug -o dist/`

Avatar images can use Unsplash URLs with this pattern:
```
https://images.unsplash.com/photo-{ID}?w=300&h=300&fit=crop
```

### Modifying Styles

All styling is in `src/style.scss`:
- Color scheme controlled by `$hue` variable (line 1)
- Animation timing via `$short`, `$mid`, `$long` variables
- Layout dimensions use `rem` units based on `html { font-size: 1.3px }`

After editing, recompile with: `sass src/style.scss dist/style.css`

## Important Notes

- This is a **prototype/concept**, not production code
- Time slots are randomly generated, not connected to a backend
- The calendar generation is basic and assumes 30-day months
- jQuery is a dependency loaded via CDN in the HTML
- All member/test data is hardcoded in the Pug template
- The dist/index.html file may be out of sync with src files after user reverts - always check src/ files for the source of truth
