
# Hero Banner

A static hero banner block with background image, headline, and CTA button.

## Block Type
Static

## Authoring (Universal Editor)
Add the Hero block to any section. Configure the headline (richtext), background image (reference), CTA label (text), and CTA link (aem-content). Select a visual variant (light overlay or dark overlay) from the style options.

## Fields
| Field | Type | Description |
|-------|------|-------------|
| style | multiselect | Visual style for the hero banner (light-overlay, dark-overlay) |
| headline | richtext | Main headline text for the hero banner |
| background-image | reference | Background image for the hero banner |
| cta-label | text | Text displayed on the CTA button |
| cta-link | aem-content | Link for the CTA button |

## Block Items
No repeating items.

## Variants
- `light-overlay`: Light text overlay with semi-transparent white background
- `dark-overlay`: Dark text overlay with semi-transparent dark background

## Dependencies
- `createOptimizedPicture` from `aem.js`
- `moveInstrumentation` from `scripts.js`
- `decorateButtons` from `aem.js`
  