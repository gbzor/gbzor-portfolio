# CLAUDE.md

## Project Overview

Personal portfolio website for Jason Gabriel M. Azor (gbzor). A single-page static site built with vanilla HTML, CSS, and JavaScript — no build tools, no frameworks, no package manager.

## File Structure

```
/
  index.html    -- Entire page structure (hero, about, skills, projects, contact, footer)
  styles.css    -- All styles including theming, responsive breakpoints, animations
  script.js     -- Interactivity: typewriter, theme toggle, dock nav, scroll effects, contact form
```

## Tech Stack

- **HTML5** — single `index.html`, semantic sections with `id` anchors
- **CSS3** — CSS custom properties for theming, no preprocessor
- **Vanilla JS** — no dependencies, no bundler, ES5-compatible patterns (`var`, `function`, no arrow functions)

## Architecture & Conventions

### Theming

Two color themes controlled by `data-theme` attribute on `<html>`:
- **Dark** (default): warm ink palette — terracotta accent (`#cf8e6d`), sage secondary (`#8aaa96`)
- **Light**: warm cream — deep teal accent (`#1a7a63`), amber secondary (`#c4862a`)

All colors use CSS custom properties defined in `styles.css:1-75`. Theme persists via `localStorage.getItem('theme')`.

### Fonts

- **DM Sans** — body text (`--font-main`)
- **Space Mono** — monospace elements, section labels, stats (`--font-mono`)

Both loaded from Google Fonts in `index.html:12-14`.

### Navigation

macOS-style dock navbar fixed at the bottom of the viewport. Items link to section `id` anchors (`#hero`, `#about`, `#skills`, `#projects`, `#contact`). Active state updated on scroll via `IntersectionObserver`-style logic in `script.js`. Dock has a magnification hover effect on pointer devices only.

### Sections

Each content section follows the pattern:
```html
<section id="name" class="section name">
  <div class="container">
    <div class="section-label">## / Label</div>
    <h2 class="section-title">Title</h2>
    <!-- content -->
  </div>
</section>
```

Sections fade in on scroll via `IntersectionObserver` (`.section` -> `.section.visible`).

### JavaScript Patterns

- Uses `var` and `function` declarations (ES5 style) — maintain this convention
- `throttle()` utility for scroll handlers
- Typewriter effect cycles through `roles` array in `script.js:3-8`
- Contact form has a placeholder handler — no backend connected yet
- Respects `prefers-reduced-motion` for animations

### Responsive Breakpoints

Defined in `styles.css` at the bottom:
- `1440px+` — large desktop (`--max-width: 1200px`)
- `1024px` — tablet landscape
- `768px` — tablet portrait (single-column layouts)
- `480px` — mobile (stacked CTAs, smaller dock)
- `360px` — very small phones
- `max-height: 500px` landscape — compact hero
- Supports `safe-area-inset-*` for notched devices

### Accessibility

- `prefers-reduced-motion` disables all animations
- `prefers-color-scheme` sets default theme
- Touch device optimizations (`hover: none`, `pointer: coarse`)
- Minimum tap target sizes (44px)
- Print stylesheet hides floating UI

## Development

### Running Locally

No build step required. Open `index.html` directly in a browser, or use any static file server:
```bash
python3 -m http.server 8000
npx serve .
```

### Editing Content

The HTML contains `<!-- EDIT: ... -->` comments marking placeholder content that should be personalized:
- **Hero photo** — `index.html:81-82`
- **About photo** — `index.html:98-103`
- **About stats** (project count, years coding) — `index.html:124-133`
- **Typewriter roles** — `script.js:3-8`
- **Project cards** — `index.html:237-301` (titles, descriptions, tags, links)
- **Contact email** — `index.html:335-336`
- **Contact form backend** — `script.js:180`
- **Additional skill categories** — `index.html:224`

### Adding a New Project Card

Copy an existing `<article class="project-card">` block inside `.projects-grid` and update the title, description, tags, and links. Replace the placeholder SVG with an `<img>` tag for the screenshot.

### Adding a New Skill

Add a `.skill-card` div inside the appropriate `.skill-cards` container, or create a new `.skill-category` block. Set `--skill-color` on the icon for brand color.

## Code Style

- **CSS**: kebab-case class names, BEM-like but not strict (e.g., `.project-card`, `.project-title`)
- **JS**: ES5 syntax, `var` over `let`/`const`, named functions over arrows
- **HTML**: inline SVG icons throughout (no icon library dependency)
- No external JS dependencies — keep it dependency-free
- No CSS preprocessor — plain CSS with custom properties

## Common Pitfalls

- The dark theme overrides `.skill-icon` color for black icons (`styles.css:650-652`) — check this when adding new skills with dark brand colors
- Dock magnification is disabled on touch devices — UI changes for hover effects should be gated behind `@media (hover: hover)`
- The contact form currently only logs to console and shows an alert — it needs a backend service (Formspree, EmailJS, etc.) to actually send messages
- All SVG icons are inline in the HTML — there is no icon sprite or font
