# Style Guide: Fluid Booking Form SCSS Analysis

This document provides a detailed explanation of every section in `src/style.scss`, explaining the purpose and functionality of each code block.

---

## 1. SCSS Variables (Lines 1-11)

```scss
$hue: 241;
$distance: 0;
$color: hsl($hue, 100%, 59%);
$accent: hsl( ($hue + $distance) , 100%, 50%);
$grey: #ddd;
$sans: 'Alegreya Sans', sans-serif;
$ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1.000);
$short: 300ms;
$mid: 500ms;
$long: 800ms;
```

**Purpose**: Define global variables for consistent theming and timing across the application.

- `$hue`: Base color hue value (241 = blue-purple)
- `$distance`: Color variation offset (currently 0, not used)
- `$color`: Primary brand color using HSL color space
- `$accent`: Accent color (currently same as primary due to $distance: 0)
- `$grey`: Neutral color for disabled states and labels
- `$sans`: Font family for all text
- `$ease-in-out`: Custom cubic-bezier easing function for smooth animations
- `$short`, `$mid`, `$long`: Animation duration constants for consistent timing

---

## 2. HTML Base Styles (Lines 14-19)

```scss
html{
  font-size: 1.3px;
  *{
    box-sizing: border-box;
  }
}
```

**Purpose**: Set up the foundation for the rem-based sizing system and box model.

- `font-size: 1.3px`: Establishes base unit for rem calculations (1rem = 1.3px). This allows precise control over all dimensions throughout the app.
- `box-sizing: border-box`: Ensures padding and borders are included in element width/height calculations, preventing layout issues.

---

## 3. Body Styles (Lines 21-29)

```scss
body{
  width: 100vw;
  height: 100vh;
  background: linear-gradient(60deg, darken(adjust-hue($color,5),10%), lighten(adjust-hue($color,-5), 10%));
  background: white;
  font-family: $sans;
  font-size: 40rem;
  overflow: hidden;
}
```

**Purpose**: Configure the main viewport container.

- `width: 100vw; height: 100vh`: Full viewport coverage
- `background: linear-gradient(...)`: Creates a gradient background (commented out by next line)
- `background: white`: Overrides gradient with solid white background
- `font-family: $sans`: Applies Alegreya Sans font globally
- `font-size: 40rem`: Sets base font size (40 × 1.3px = 52px)
- `overflow: hidden`: Prevents scrollbars from appearing

---

## 4. Main Wrapper Container (Lines 31-38)

```scss
.wrap{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%,-50%,0);
  color: $color;
  width: 500rem;
  height: 450rem;
```

**Purpose**: Center the booking form container on screen.

- `position: absolute` + `top: 50%; left: 50%`: Position from center
- `transform: translate3d(-50%,-50%,0)`: Perfect centering by offsetting 50% of its own dimensions. Uses 3D transform for GPU acceleration.
- `color: $color`: Default text color
- `width: 500rem; height: 450rem`: Fixed container dimensions (650px × 585px)

---

## 5. State Management: Member Selected (Lines 39-48)

```scss
&.member-selected{
  .member:not(.selected){
    opacity: 0;
    pointer-events: none;
    transform: perspective(100rem) translatez(-50rem);
    transition: opacity $short $ease-in-out, transform $long $ease-in-out, height $mid $ease-in-out;
  }
  .instructions .first{
    opacity: 0;
  }
```

**Purpose**: When a member/test is selected, hide non-selected members and instructions.

- `.member:not(.selected)`: Targets all unselected member cards
- `opacity: 0`: Fades them out
- `pointer-events: none`: Disables click interactions
- `transform: perspective(100rem) translatez(-50rem)`: Creates 3D depth effect, pushing cards "backward" in space
- `transition`: Smooth animation with different timings for each property
- `.instructions .first`: Hides the "Choose a medical test" instruction

---

## 6. State Management: Date Selected (Lines 49-76)

```scss
&.date-selected{
  .deselect-date{
    opacity: 1;
    pointer-events: auto;
  }
  .calendar{
    .date{
      transform: scale(0.5) translateY(-5rem) translateX(0rem);
      opacity: 1;
    }
    .month {
      transform: scale(0.5) translateY(-5rem) translateX(100rem);
    }
    .year{
      transform: scale(0.5) translateY(-5rem) translateX(200rem);
    }

    table{
      pointer-events: none;
      transform: translateY(50rem);
      border-top: 1px solid rgba($grey,0.8);
    }
    td:not(.selected), th:not(.selected){
      opacity: 0;
      transform: perspective(100rem) translatez(-50rem);
      transition: opacity $short $ease-in-out, transform $short $ease-in-out;
    }
  }
```

**Purpose**: After date selection, compress calendar and show selected date prominently.

- `.deselect-date`: Shows the "change" button for date
- `.date`, `.month`, `.year`: Scale down to 50% and reposition horizontally to form a compact date display
- `table`: Shifts down and adds top border
- `td:not(.selected), th:not(.selected)`: Hides all calendar cells except the selected date using 3D transforms

---

## 7. State Management: Showing Time Slots (Lines 77-114)

```scss
.slots{
  opacity: 1;
  transform: translatey(0%);
  pointer-events: auto;
  li{
    transform: translatey(0);
    opacity: 1;
    color: $color;
    &:nth-child(1){
      transition-delay: $mid * 0/6;
      transform: translateY(0rem) perspective(100rem) translateZ(0);
    }
    &:nth-child(2){
      transition-delay: $mid * 1/6;
      transform: translateY(50rem) perspective(100rem) translateZ(0);
    }
    // ... continues for children 3-7
  }
}
```

**Purpose**: Reveals time slots with staggered animation after date selection.

- `opacity: 1; transform: translatey(0%)`: Makes slots container visible and moves it into position
- `pointer-events: auto`: Enables clicking on time slots
- `&:nth-child(n)`: Each slot has a unique Y position (0rem, 50rem, 100rem, etc.)
- `transition-delay`: Creates cascading animation effect (slots appear sequentially)
- Time slots fade in and "fly forward" in 3D space from bottom to top

---

## 8. State Management: Slot Selected (Lines 115-134)

```scss
&.slot-selected{
  .form{
    opacity: 1;
    transform: translatey(0%);
    pointer-events: auto;
    transition: opacity $mid $ease-in-out, transform $long $ease-in-out;
    *{
        transform: translatey(0);
        &:nth-child(1){transition-delay: $short * 1/6;}
        &:nth-child(2){transition-delay: $short * 2/6;}
        &:nth-child(3){transition-delay: $short * 3/6;}
        &:nth-child(4){transition-delay: $short * 4/6;}
        &:nth-child(5){transition-delay: $short * 5/6;}
        &:nth-child(6){transition-delay: $short * 6/6;}
    }
  }
  .deselect-slot{
    opacity: 1;
    pointer-events: auto;
  }
```

**Purpose**: Shows booking form with staggered animation after time slot selection.

- `.form`: Fades in and slides into position
- `*`: All form children (labels, inputs, buttons) animate with staggered delays
- `.deselect-slot`: Shows "change" button for time slot
- Creates a smooth cascade effect where form fields appear one after another

---

## 9. State Management: Hiding Unselected Slots (Lines 135-173)

```scss
.slots{
  pointer-events: none;
}
.slots li:not(.selected){
  opacity: 0;
  &:nth-child(1){
    transition-delay: $mid * 0/6;
    transform: translateY(0rem) perspective(100rem) translateZ(-50rem);
  }
  // ... continues for children 2-7
}
.slots li.selected{
  transform: translateY(0rem) perspective(100rem) translateZ(0rem);
  transition-delay: 0s;
  border-bottom: 1px solid rgba($grey,0.8);
}
```

**Purpose**: When a slot is selected, hide all other slots and emphasize the selected one.

- `pointer-events: none`: Disables clicking on slots (selection is locked)
- `.slots li:not(.selected)`: Unselected slots fade out and recede in 3D space (translateZ -50rem)
- `.slots li.selected`: Selected slot stays visible, moves to top position (Y: 0), gets bottom border
- Staggered delays create smooth exit animation

---

## 10. State Management: Booking Complete (Lines 174-211)

```scss
&.booking-complete{
  .deselect-member, .deselect-date, .deselect-slot{
    opacity: 0;
    pointer: none;
  }
  .form{
    transition: opacity $mid $ease-in-out, transform $long $ease-in-out;
    &:before, &:after{
      transform: scalex(0);
    }
    label{
      opacity: 0;
      transition: opacity $short $ease-in-out;
    }
    input{
      border-bottom: 1px solid rgba($grey,0.8);
      pointer-events: none;
      &[name="name"]{
        padding: 10rem 70rem;
        transform: translatey(-33rem);
      }
      &[name="email"]{
        padding: 10rem 70rem;
        transform: translatey(-60rem);
      }
      &[type="submit"]{
        transform: translatey(-60rem);
        opacity: 0;
        transition: transform $mid $ease-in-out, opacity $short $ease-in-out;
      }
    }
  }
  .confirm-message{
    opacity: 1;
    transform: translatey(0%);
    pointer-events: auto;
  }
}
```

**Purpose**: Final state after form submission - shows confirmation message.

- `.deselect-*`: Hides all "change" buttons
- `.form:before, :after`: Collapses side padding elements (pseudo-elements used for form styling)
- `label`: Fades out form labels
- `input[name="name"]`, `input[name="email"]`: Slides input fields upward to compact the form
- `input[type="submit"]`: Hides submit button
- `.confirm-message`: Reveals "Booking Complete!" message with slide-up animation

---

## 11. Instructions Section (Lines 217-226)

```scss
.instructions{
  margin-bottom: 25rem;
  text-align: center;
  height: 80vh;
  font-weight: 300;
  color: $color;
    > *{
      transition: opacity $short $ease-in-out;
    }
}
```

**Purpose**: Styles the initial instruction text.

- `margin-bottom: 25rem`: Spacing below instructions
- `text-align: center`: Centers text horizontally
- `height: 80vh`: Takes up most of viewport height
- `font-weight: 300`: Light font weight for elegant look
- `> *`: Smooth opacity transitions for all direct children

---

## 12. Deselect Buttons (Lines 227-246)

```scss
.deselect-member, .deselect-date, .deselect-slot{
  position: absolute;
  color: $grey;
  top: 35rem;
  right: 25rem;
  z-index: 10;
  display: inline-block;
  font-size: 20rem;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity $short $ease-in-out;
  font-weight: 100;
}
.deselect-date{
  top: 95rem;
}
.deselect-slot{
  top: 145rem;
}
```

**Purpose**: "Change" buttons that allow users to go back to previous steps.

- `position: absolute`: Positioned relative to `.member` card
- `top: 35rem; right: 25rem`: Initial position for member deselect button
- `z-index: 10`: Ensures buttons appear above other elements
- `cursor: pointer`: Shows hand cursor on hover
- `opacity: 0; pointer-events: none`: Hidden by default (revealed when appropriate state is active)
- `.deselect-date`: Lower position (below member name)
- `.deselect-slot`: Even lower position (below calendar header)

---

## 13. Member Cards Base Styles (Lines 248-291)

```scss
.member{
  background: white;
  width: 100%;
  padding: 20rem;
  height: 100rem;
  cursor: pointer;
  position: absolute;
  top: 0;
  transition: opacity $long $ease-in-out, transform $mid $ease-in-out, height $short $ease-in-out, box-shadow $long $ease-in-out;
  box-shadow: 5rem 5rem 20rem rgba($color, 0.15);
  overflow: hidden;
  .name{
    display: inline-block;
    margin-left: 85rem;
    line-height: 60rem;
    transform-origin: 0% 0%;
    transition: transform $mid $ease-in-out;
    font-weight: 100;
    font-size: 40rem;
  }
  .avatar{
    transform-origin: 100% 0%;
    width: 70rem;
    height: 70rem;
    border-radius: 100rem;
    display: inline-block;
    position: absolute;
    top: 15rem;
    left: 15rem;
    background-size: cover;
    filter: saturate(50%) contrast(120%);
    transition: transform $mid $ease-in-out;
    &:after{
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 100rem;
      background-color: $color;
      mix-blend-mode: lighten;
    }
  }
```

**Purpose**: Styles the clickable member/test cards.

- `height: 100rem`: Collapsed height (130px) when not selected
- `cursor: pointer`: Indicates clickable
- `position: absolute; top: 0`: All cards stack at same top position, offset by transforms
- `box-shadow`: Subtle depth shadow
- `overflow: hidden`: Clips calendar/slots/form until card expands
- `.name`: Test/member name text, positioned beside avatar
- `.avatar`: Circular profile image
  - `border-radius: 100rem`: Perfect circle
  - `filter: saturate(50%) contrast(120%)`: Desaturates and enhances contrast
  - `&:after`: Color overlay using blend mode for consistent theming

---

## 14. Member Card Positioning (Lines 293-304)

```scss
&:nth-child(1){
  transform: translatey(70rem) perspective(100rem) translatez(-10rem);
}
&:nth-child(2){
  transform: translatey(170rem) perspective(100rem) translatez(-10rem);
}
&:nth-child(3){
  transform: translatey(270rem) perspective(100rem) translatez(-10rem);
}
&:nth-child(4){
  transform: translatey(370rem) perspective(100rem) translatez(-10rem);
}
```

**Purpose**: Stacks cards vertically with 3D depth effect.

- Each card is offset by 100rem (130px) vertically
- `translatez(-10rem)`: Slight backward push in 3D space
- `perspective(100rem)`: Defines the distance from viewer for 3D transforms
- Creates a stacked card layout with subtle depth perception

---

## 15. Selected Member Card (Lines 305-325)

```scss
&.selected{
  transform: translatey(0rem) perspective(100rem) translatez(0rem);
  height: 450rem;
  cursor: default;
  z-index: 2;
  box-shadow: 10rem 10rem 60rem rgba(darken($color,20%), 0.1);
  transition: opacity $short $ease-in-out, transform $long $ease-in-out, height $mid $ease-in-out, box-shadow $long $ease-in-out;
  .deselect-member{
    opacity: 1;
    pointer-events: auto;
  }
  .name, .avatar{
    transform: scale(0.7) translatex(-30rem);
  }
  .calendar{
    height: 340rem;
    transform: translatey(0rem);
    transition: opacity $mid $ease-in-out, transform $mid $ease-in-out, height $long $ease-in-out;
    opacity: 1;
  }
}
```

**Purpose**: Transforms selected card to expanded state.

- `transform: translatey(0rem)`: Moves to top position
- `height: 450rem`: Expands to full height (585px) to accommodate calendar/form
- `cursor: default`: No longer clickable
- `z-index: 2`: Brings to front
- `box-shadow`: Stronger shadow for emphasis
- `.name, .avatar`: Scale down to 70% and shift left to make room for calendar
- `.calendar`: Expands and becomes visible

---

## 16. Calendar Base Styles (Lines 328-354)

```scss
.calendar{
  width: 100%;
  margin-top: 0rem;
  height: 0;
  opacity: 0;
  transition: opacity $short $ease-in-out, transform $short $ease-in-out, height $short $ease-in-out;
  font-size: 17rem;
  border-top: 1px solid rgba($grey,0.8);
  .date, .month, .year{
    position: absolute;
    top: 15rem;
    left: 65rem;
    font-size: 50rem;
    display: inline-block;
    font-weight: 100;
    transition: opacity $short $ease-in-out, transform $mid $ease-in-out;
    transform-origin: 100% 0%;
    transform: translateX(0) scale(1);
  }
  .year{
    transform: translateX(80rem) scale(1);
  }
  .date{
    opacity: 0;
    transform-origin: 0% 0%;
    transform: translateX(-100rem) scale(1);
  }
```

**Purpose**: Calendar container and date header elements.

- `height: 0; opacity: 0`: Hidden by default
- `border-top`: Separates calendar from member name
- `.date, .month, .year`: Positioned absolutely to allow independent animation
  - `.month`: Initially at center (will show first)
  - `.year`: Offset to right
  - `.date`: Hidden and offset to left (will appear after selection)
- `transform-origin`: Sets pivot point for scaling animations

---

## 17. Calendar Table (Lines 355-390)

```scss
table{
  width: 100%;
  text-align: center;
  transition: transform $mid $ease-in-out;
  transform: translatey(80rem);
  border-top: 1px solid white;

  td, th{
    width: 13%;
    padding: 10rem;
    cursor: pointer;
    font-weight: 200;

    &.today{
      background: $color;
      color: white;
    }
    &.disabled{
      color: $grey;
      pointer-events: none;
      &.today{
        background: $grey;
        color: white;
      }
    }
    &.selected{
      transform: perspective(100rem) translateZ(80rem);
      transition: opacity $long $ease-in-out, transform $long $ease-in-out;
      opacity: 0;
    }
  }
  th{
    padding-top: 20rem;
  }
}
```

**Purpose**: Styles the calendar grid.

- `transform: translatey(80rem)`: Initial position below calendar header
- `width: 13%`: 7 columns (days of week) ≈ 14.28% each, but using 13% for tighter layout
- `.today`: Highlights current date with brand color background
- `.disabled`: Grays out past dates and weekends, prevents clicking
- `.selected`: When a date is clicked, it "pops forward" (translateZ 80rem) then fades out
- `th`: Header row (day letters) gets extra top padding

---

## 18. Time Slots Base Styles (Lines 393-424)

```scss
.slots{
  position: absolute;
  left: 15rem;
  width: calc(100% - 20rem);
  height: 320rem;
  top: 135rem;
  opacity: 0;
  transform: translatey(50%);
  pointer-events: none;
  transition: opacity $short $ease-in-out, transform $mid $ease-in-out;
  font-size: 25rem;
  font-weight: 100;
  li{
    background: white;
    display: block;
    transition: color $mid $ease-in-out, transform $long $ease-in-out, opacity $mid $ease-in-out, border $long $ease-in-out;
    transform-origin: 100% 50%;
    color: transparent;
    border-bottom: 1px solid rgba($grey,0);
    padding: 10rem 70rem;
    cursor: pointer;
    position: absolute;
    width: calc(100% - 20rem);
    &:nth-child(1){transform: translatey(0rem) perspective(100rem) translatez(30rem);}
    &:nth-child(2){transform: translatey(50rem) perspective(100rem) translatez(30rem);}
    &:nth-child(3){transform: translatey(100rem) perspective(100rem) translatez(30rem);}
    &:nth-child(4){transform: translatey(150rem) perspective(100rem) translatez(30rem);}
    &:nth-child(5){transform: translatey(200rem) perspective(100rem) translatez(30rem);}
    &:nth-child(6){transform: translatey(250rem) perspective(100rem) translatez(30rem);}
    &:nth-child(7){transform: translatey(300rem) perspective(100rem) translatez(30rem);}
  }
}
```

**Purpose**: Styles the available time slot buttons.

- `position: absolute; top: 135rem`: Positioned below calendar
- `opacity: 0; transform: translatey(50%)`: Hidden and offset downward initially
- `li`: Each time slot is a list item
  - `color: transparent`: Text is invisible initially (revealed on state change)
  - `border-bottom: transparent`: Border appears on selection
  - `position: absolute`: All slots stack at same position, differentiated by transforms
  - `translatez(30rem)`: Initially pushed forward in 3D space (will animate to 0)
  - Each slot has unique Y position (0, 50rem, 100rem, etc.)

---

## 19. Booking Form Base Styles (Lines 426-453)

```scss
.form{
  position: absolute;
  left: 15rem;
  width: 460rem;
  height: 320rem;
  top: 200rem;
  opacity: 0;
  transform: translatey(50%);
  pointer-events: none;
  transition: opacity $short $ease-in-out, transform $mid $ease-in-out;
  &:before, &:after{
    content: '';
    position: absolute;
    top: 0;
    z-index: 2;
    width: 70rem;
    height: 100%;
    background: white;
    transition: transform $long $ease-in-out;
  }
  &:before{
    left: 0;
    transform-origin: 0% 50%;
  }
  &:after{
    right: 0;
    transform-origin: 100% 50%;
  }
```

**Purpose**: Container for the booking form with decorative side panels.

- `position: absolute; top: 200rem`: Positioned below slots
- `opacity: 0; transform: translatey(50%)`: Hidden and offset down initially
- `&:before, &:after`: Pseudo-elements create white panels on left/right sides
  - `width: 70rem`: Side margins to align with form content
  - `z-index: 2`: Appears above form background
  - These scale to 0 when booking is complete (reveal user inputs)

---

## 20. Form Elements (Lines 454-489)

```scss
label{
  display: block;
  font-size: 15rem;
  font-weight: 300;
  color: $grey;
  margin-left: 70rem;
}
input[type="text"], input[type="email"]{
  font-size: 25rem;
  font-weight: 100;
  margin-bottom: 15rem;
  border: none;
  border-bottom: 1px solid $color;
  width: 100%;
  outline: none;
  padding: 0 70rem 5rem;
  color: $color;
  background: transparent;
}
input[type="submit"]{
  background: $color;
  border: none;
  color: white;
  font-weight: 100;
  padding: 15rem;
  font-size: 20rem;
  cursor: pointer;
  margin-top: 15rem;
  margin-left: 70rem;
  outline: none;
}
*{
  font-family: $sans;
  transition: transform $mid $ease-in-out, border $mid $ease-in-out, opacity $long $ease-in-out, padding $mid $ease-in-out;
  transform: translateY(100rem);
}
```

**Purpose**: Styles form inputs and labels.

- `label`: Small, light gray text above each input
- `input[type="text"], input[type="email"]`: Text inputs with minimal styling
  - `border: none; border-bottom: 1px solid $color`: Underline style
  - `background: transparent`: No background fill
  - `padding: 0 70rem 5rem`: Aligns with side panels
- `input[type="submit"]`: Primary button with brand color
- `*`: All form elements
  - `transform: translateY(100rem)`: Start position (below visible area)
  - Animates up to position with staggered delays (defined in slot-selected state)

---

## 21. Confirmation Message (Lines 492-514)

```scss
.confirm-message{
  position: absolute;
  left: 15rem;
  width: 460rem;
  text-align: center;
  height: 320rem;
  top: 320rem;
  font-size: 40rem;
  font-weight: 100;
  opacity: 0;
  transform: translatey(35%);
  pointer-events: none;
  transition: opacity $short $ease-in-out, transform $mid $ease-in-out;
  transition-delay: $short/2;
  .restart{
    display: block;
    text-align: center;
    margin-top: 15rem;
    color: $grey;
    font-size: 25rem;
    cursor: pointer;
  }
}
```

**Purpose**: "Booking Complete!" success message.

- `position: absolute; top: 320rem`: Positioned below form
- `opacity: 0; transform: translatey(35%)`: Hidden and offset down initially
- `text-align: center`: Centers message text
- `transition-delay: $short/2`: Slight delay before appearing (150ms)
- `.restart`: "Book Again?" link to reset the flow
  - `color: $grey`: Subtle appearance
  - `cursor: pointer`: Indicates clickable

---

## 22. Signature Link (Lines 515-525)

```scss
.sig{
  position: fixed;
  bottom: 8px;
  right: 8px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 100;
  font-family: sans-serif;
  color: rgba(0,0,0,0.4);
  letter-spacing: 2px;
}
```

**Purpose**: Small attribution link in corner.

- `position: fixed; bottom: 8px; right: 8px`: Anchored to bottom-right corner
- `color: rgba(0,0,0,0.4)`: Semi-transparent black (40% opacity)
- `letter-spacing: 2px`: Spaced-out text for minimalist aesthetic
- Does not interfere with main booking flow

---

## Summary of Animation System

The SCSS uses a sophisticated state-based animation system:

1. **States controlled by CSS classes**: `member-selected`, `date-selected`, `slot-selected`, `booking-complete`
2. **3D transforms for depth**: `perspective()` and `translateZ()` create forward/backward motion
3. **Staggered animations**: `transition-delay` with nth-child selectors create cascading effects
4. **Transform origins**: Carefully set to control scale/rotate pivot points
5. **Opacity + Transform combos**: Elements fade while moving for smooth transitions
6. **Timing variables**: Consistent use of `$short`, `$mid`, `$long` ensures cohesive feel
7. **Pointer events**: Disabled when elements aren't interactive to prevent accidental clicks

This creates a fluid, engaging user experience where each step flows naturally into the next.
