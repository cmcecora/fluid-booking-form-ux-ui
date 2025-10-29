# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a fluid booking form UX/UI concept originally created on CodePen. It demonstrates a multi-step booking flow with animated transitions for selecting staff members (or medical tests), dates, time slots, and completing bookings. The project is a front-end prototype focused on creating a frictionless user experience through smooth animations.

## Technology Stack

- **HTML**: Generated from Pug templates
- **CSS**: Generated from SCSS/Sass
- **JavaScript**: jQuery-based interactive functionality
- **Build**: Manual compilation (Pug → HTML, SCSS → CSS)
- **APIs**: Google Maps Places API, ipapi.co for IP geolocation

## API Configuration & Setup

This project uses two external APIs for location services:

### 1. Google Maps Places API (Required)

**Purpose**: Provides autocomplete suggestions for US cities when users type in the location search box.

**Setup Instructions**:

1. **Get Your API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Enable the **Places API**:
     - Navigate to "APIs & Services" > "Library"
     - Search for "Places API"
     - Click "Enable"
   - Create credentials:
     - Go to "APIs & Services" > "Credentials"
     - Click "Create Credentials" > "API Key"
     - Copy your API key

2. **Configure Your API Key**:
   - Open `src/script.js`
   - Replace `YOUR_API_KEY_HERE` on line 6 with your actual API key:
     ```javascript
     const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
     ```
   - Open `src/index.pug`
   - Replace `YOUR_API_KEY_HERE` in the Google Maps script tag (line 11):
     ```pug
     script(src='https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY_HERE&libraries=places&callback=initGoogleMaps' async defer)
     ```

3. **Restrict Your API Key** (Important for Security):
   - In Google Cloud Console, click on your API key to edit it
   - Under "Application restrictions":
     - Choose "HTTP referrers (web sites)"
     - Add your allowed domains:
       - `localhost:*` (for local development)
       - `yourdomain.com/*` (for production)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose "Places API"
   - Click "Save"

4. **Recompile After Changes**:
   ```bash
   pug src/index.pug -o dist/
   cp src/script.js dist/script.js
   ```

**Pricing**:
- **Free tier**: $200/month credit (approximately 40,000 autocomplete requests)
- **Paid tier**: $2.83 per 1,000 requests after free tier
- For most use cases, the free tier should be sufficient

### 2. ipapi.co IP Geolocation API (Free, No Key Required)

**Purpose**: Automatically detects the user's city and state based on their IP address when they click the location icon.

**Configuration**: No setup required! This API is free and doesn't need an API key for basic usage.

**Limits**: 1,000 requests per day (free tier)

**Alternative**: If you need more requests or prefer a different service, you can replace `IP_GEOLOCATION_API` in `src/script.js` (line 9) with:
- `https://ipapi.co/json/` (current, 1,000 req/day)
- `http://ip-api.com/json/` (free, 45 req/minute, doesn't support HTTPS)

### Location Search Features

**How It Works**:
1. **Autocomplete**: When users type 2+ characters in the location search box, it queries Google Places API for US city suggestions
2. **IP Geolocation**: When users click the location icon, it fetches their approximate location via IP address
3. **Results**: Shows up to 6 city suggestions formatted as "City, State"
4. **Debouncing**: API calls are debounced to 500ms to reduce unnecessary requests

**Error Handling**:
- If Google Places API fails to load, users see "Location service not available"
- If IP geolocation fails, users get an alert and can enter location manually
- Network errors display user-friendly messages

### Troubleshooting

**"Location service not available" Error**:
- Check that your Google Maps API key is valid
- Verify that the Places API is enabled in Google Cloud Console
- Check browser console for specific error messages
- Ensure the Google Maps script loads before `script.js`

**IP Geolocation Not Working**:
- Check browser console for CORS errors
- Verify you haven't exceeded the daily request limit (1,000/day)
- Try the alternative API: `http://ip-api.com/json/`

**API Key Restrictions Too Strict**:
- Make sure you've added `localhost:*` for local development
- Check that HTTP referrer restrictions match your domain exactly

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
- **Google Maps API key required** for location autocomplete to work
- Location services use external APIs (Google Places, ipapi.co)
- Time slots are randomly generated, not connected to a backend
- Testing center data is generated dynamically with mock information
- The calendar generation is basic and assumes 30-day months
- jQuery is a dependency loaded via CDN in the HTML
- Medical test cards are dynamically generated (500 tests with infinite scroll)
- The dist/index.html file may be out of sync with src files after user reverts - always check src/ files for the source of truth
