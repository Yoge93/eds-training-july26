
# Carousel

A responsive, accessible carousel block with navigation arrows, dot indicators, and optional auto-play functionality. Supports touch gestures and keyboard navigation.

## Block Type
Interactive

## Authoring (Universal Editor)
1. Add the Carousel block to your page
2. Configure the variant (Dark, Light, Full Width) in the Properties panel
3. Enable Auto Play and set the interval (in milliseconds) if desired
4. Add Carousel Slide items and populate each with:
   - Slide Image (with alt text)
   - Title
   - Description
   - Optional Link (entire slide becomes clickable)

## Fields
| Field | Type | Description |
|-------|------|-------------|
| style | multiselect | Visual variant: Dark, Light, or Full Width |
| autoplay | boolean | Enable automatic slide advancement |
| autoplay-interval | number | Time between slides in milliseconds (default: 5000) |

## Block Items
Carousel Slide items contain:
- **image** (reference): Background image for the slide
- **imageAlt** (text): Alt text for the slide image
- **title** (text): Slide title
- **description** (richtext): Slide description text
- **link** (aem-content): Optional link for the entire slide
- **linkText** (text): Custom link text (defaults to title if empty)

## Variants
- `dark`: Dark theme with light text and controls
- `light`: Light theme with dark text and controls
- `full-width`: Full-width carousel with no rounded corners

## Dependencies
- `createOptimizedPicture` from `../../scripts/aem.js`
- `decorateButtons` from `../../scripts/aem.js`
- `decorateIcons` from `../../scripts/aem.js`
- `moveInstrumentation` from `../../scripts/scripts.js`
  