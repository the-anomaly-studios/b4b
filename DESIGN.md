# Band for Band Design System

## Direction

A bright, editorial product experience that feels like a culture publication covering a live competition. The interface should foreground performance imagery, school identity, and rankings without resembling a sportsbook or a generic dashboard.

## Theme

Default to a light, warm-neutral theme suited to daytime discovery and long browsing sessions. Use dark surfaces selectively around video playback, never as the default page background.

## Color

- Strategy: restrained platform palette with school colors used as contextual identity.
- Canvas: warm, lightly tinted near-white.
- Ink: deep warm charcoal, never pure black.
- Muted: warm gray for secondary text, rules, and inactive controls.
- Platform accent: vivid, accessible red reserved for primary actions, active states, and vote feedback.
- School colors: appear in logos, small identity fields, and profile moments. They must never be the only indicator of rank or state.
- Define production colors as OKLCH custom properties and validate text/action combinations to WCAG 2.2 AA.

## Typography

- Headlines: a strong condensed display face with the cadence of editorial sports coverage.
- Interface and body: a highly legible sans serif.
- Display type is limited to page titles, rank numerals, and major editorial statements. Buttons, labels, metadata, filters, and body copy always use the sans serif.
- Keep body lines between 65 and 75 characters.

## Layout

- Use strong horizontal rules, asymmetric editorial groupings, and ranked lists instead of repetitive equal-sized card grids.
- Performance media should carry the most visual weight.
- Keep navigation familiar: a top-level header, clear route labels, standard controls, and predictable responsive collapse.
- Desktop feeds may pair a dominant feature with compact supporting rows. Mobile becomes a single, media-first stream.

## Components

- Buttons: one consistent shape and hierarchy with complete hover, focus, active, disabled, and loading states.
- Performance items: image-led editorial modules that vary by prominence, not identical cards.
- Leaderboard: numbered rows with school mark, score, movement/status, and an obvious route to the school profile.
- Filters: native-feeling controls with explicit labels and keyboard support.
- Loading: stable skeletons matching final content geometry.
- Empty states: explain how to discover, filter, or contribute content.

## Motion

Use restrained 150–250 ms state transitions with ease-out curves. Motion communicates interaction feedback, filter changes, and vote state only. Honor `prefers-reduced-motion`; do not use orchestrated page-load animation.

## Media

Use curated remote HBCU marching-band imagery for initial sample content, retaining source and attribution metadata in the sample-data layer. Provide meaningful alt text. Performance video records should support caption availability and poster imagery.

## Accessibility

Target WCAG 2.2 AA, semantic landmarks, visible focus, full keyboard navigation, descriptive labels, non-color state indicators, reduced motion, and sufficient touch targets. Video surfaces must expose captions when available and must not autoplay with sound.
