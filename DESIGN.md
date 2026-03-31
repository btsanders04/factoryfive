# High-Performance Design System: Automotive Engineering Aesthetic

## 1. Overview & Creative North Star

### Creative North Star: "The Precision Blueprint"
This design system moves beyond the generic blog template to evoke the high-stakes, meticulously engineered world of performance automotive builds. It is a visual celebration of the Shelby Cobra’s heritage—blending the technical precision of a workshop manual with the premium finish of a modern supercar.

Instead of a standard flat layout, the system utilizes **Asymmetric Engineering**. Layouts should feel intentional and structured, yet dynamic—mirroring the balance of a chassis. We break the "template" look by using deep tonal layering, wide-scale typographic contrasts, and "glass" surfaces that suggest high-tech cockpit instrumentation.

---

## 2. Colors

The palette is anchored in deep, midnight hues to provide a sophisticated "garage at night" atmosphere, punctuated by high-visibility performance accents.

*   **Primary (#0A192F / `primary_container`):** Deep Midnight Blue. This is our foundation. It provides the heavy, structural feel of a reinforced frame.
*   **Secondary (#C0C0C2 / `secondary`):** Brushed Silver. Used for accents and data visualization to evoke raw aluminum and chrome components.
*   **Tertiary (#E31837 / `on_tertiary_container`):** Performance Red. A high-contrast highlight color reserved for critical actions, status alerts, and "Redline" performance markers.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are prohibited for sectioning.** Physical boundaries must be defined solely through background color shifts. For example, a card utilizing `surface_container_low` should sit on a `surface` background. The transition of color alone defines the edge, creating a cleaner, more sophisticated interface.

### Surface Hierarchy & Nesting
Treat the UI as a physical assembly of parts. Use the surface-container tiers to create nested depth:
*   **Base Layer:** `surface` (#0b1326)
*   **Section Layer:** `surface_container_low` (#131b2e)
*   **Interactive/Card Layer:** `surface_container_high` (#222a3d)
*   **Floating/Active Layer:** `surface_bright` (#31394d)

### Signature Textures
Avoid flat blocks of color on large components. Incorporate a **Metallic Gradient** for primary buttons and hero headers: a linear transition from `primary` (#b9c7e4) to `primary_container` (#0a192f) at a 135-degree angle. This mimics the light-catch on polished bodywork.

---

## 3. Typography

The typography strategy pairs technical precision with bold, editorial impact.

*   **Display & Headlines (Space Grotesk):** This typeface carries the "Technical" soul of the system. Its geometric construction and wide apertures feel like engineering schematics. Use **Display-LG (3.5rem)** for hero build milestones to create a sense of scale.
*   **Body & Titles (Inter):** Chosen for its exceptional readability at high speeds. It balances the "loudness" of Space Grotesk with a clean, functional neutrality.
*   **Hierarchy as Identity:** Use high-contrast sizing. A small `label-md` (0.75rem) in all-caps should often sit near a large `headline-lg` to create the "Blueprint" aesthetic—labeling components with precision.

---

## 4. Elevation & Depth

We eschew traditional drop shadows in favor of **Tonal Layering** and **Atmospheric Glass.**

*   **The Layering Principle:** Depth is achieved by stacking color tokens. To "lift" a component, move it one step up the `surface_container` scale.
*   **Ambient Shadows:** For floating modals, use a shadow with a blur of 40px and 4% opacity, tinted with the `on_surface` color. This creates a soft glow rather than a muddy grey smudge.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. This provides a hint of structure without interrupting the visual flow.
*   **Glassmorphism:** Navigation bars and floating action cards should use `surface_container_low` at 70% opacity with a `backdrop-blur` of 12px. This creates a "frosted glass" effect that allows the rich build photography to bleed through the UI subtly.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast gradient (Primary to Primary-Container). Roundedness: `sm` (0.125rem) for a sharp, machined look.
*   **Secondary:** Ghost style. No background, `outline_variant` ghost border (20% opacity).
*   **Action Red:** Used sparingly for "Delete" or "Hazard" states using the Performance Red (`tertiary`).

### Chips (Spec Tags)
*   Used for tagging car parts (e.g., "Suspension," "Drivetrain"). Use `surface_container_highest` with `label-sm` typography. No borders; use `0.25rem` spacing between chips.

### Inputs & Fields
*   **Field Style:** Filled background using `surface_container_lowest`. No bottom border. Focus state is indicated by a 2px vertical "Indicator bar" of `secondary_fixed` on the left edge of the input.

### Build Progress Cards
*   **Rules:** Forbid divider lines. Use `spacing.8` (2rem) of vertical whitespace to separate build logs. Use a `secondary` colored progress bar with a "brushed metal" CSS shimmer effect.

### Additional Component: "The Spec HUD"
*   A dedicated component for displaying engine or build specs. Use `spaceGrotesk` for numbers and `inter` for labels. The background should always be a glass-morphic `surface_bright` at 50% opacity to sit over build images.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use intentional asymmetry. Place a small technical label in the corner of a large image to give it an "engineering document" feel.
*   **Do** use `secondary` (Brushed Silver) for all icons. It reinforces the metallic theme.
*   **Do** use the `24` (6rem) spacing for major section gaps to give the build photos "room to breathe."

### Don't:
*   **Don't** use pure black or pure white. Use the `surface` and `on_surface` tokens to maintain the deep, midnight atmosphere.
*   **Don't** use standard `lg` or `xl` rounded corners. Keep it to `sm` (0.125rem) or `none`. Performance cars have sharp, aerodynamic edges; the UI should reflect that.
*   **Don't** use horizontal rules (`<hr>`). Use a background color shift between `surface` and `surface_container_low` to mark the end of a section.

### Accessibility Note:
Despite the dark theme, ensure all `on_surface` text meets a 4.5:1 contrast ratio against its respective `surface_container` level. The Performance Red must only be used for small accents or high-contrast buttons to ensure it doesn't fatigue the eye.