# AssamRoots Design Brief

## Purpose & Context
Assamese-first e-commerce discovery platform celebrating heritage products with trust-focused, mobile-first interface inspired by Flipkart and Blinkit.

## Tone & Aesthetic
Warm, authentic, editorial, heritage-first. Deep Gamosa crimson + muga gold + forest green embody Assamese cultural identity. Trust-driven e-commerce emphasizing verified sellers, ratings, community heritage.

## Color Palette (OKLCH)

| Role | OKLCH | Hex | Usage |
|---|---|---|---|
| Primary | 0.48 0.18 30 | #C0392B | Gamosa Red — CTAs, bottom nav active, trust badges |
| Secondary | 0.70 0.12 50 | #D4A017 | Muga Gold — Heritage accent, premium tier |
| Accent | 0.42 0.10 145 | #2D6A4F | Forest Green — Tea gardens, secondary actions |
| Background | 0.98 0.02 60 | #FDF6E3 | Ivory/Cream — Gamosa white, warm neutral |
| Card | 1.0 0 0 | #FFFFFF | Pure white for product cards |
| Foreground | 0.22 0.08 25 | #3E1F00 | Earthy Brown — Tea soil, warm text |
| Border | 0.94 0.02 60 | #F0EBE3 | Soft warm neutral |
| Muted | 0.92 0.03 60 | #E8E1D7 | Category tiles, inactive states |

## Typography
- **Display**: Bricolage Grotesque (bold geometric, distinctly Assamese-rooted identity)
- **Body**: Plus Jakarta Sans (warm, accessible, heritage-friendly personality)
- **Mono**: JetBrains Mono (technical elements, pricing/inventory displays)
- **Scale**: Display 2xl–lg for hero/sections, Body sm–base for content, Mono for cart/pricing

## Shape Language
- **Card radius**: 10px (lg, `0.625rem`) — soft, approachable
- **Input radius**: 8px (md) — slightly tighter for controls
- **Button radius**: 10px — rounded CTAs match cards
- **Icon sizes**: 24–32px with 2px stroke weight for warmth

## Elevation & Depth

| Zone | Background | Border | Shadow |
|---|---|---|---|
| Sticky header (sticky-header) | background/80 backdrop blur | border-b | none |
| Product card (card-product) | card | border-border | shadow-xs, hover shadow-md |
| Category tile (category-tile) | muted | none | none |
| Bottom nav | background | border-t | shadow-elevated |
| Popover/modal | popover | border-border | shadow-elevated |

## Structural Zones
1. **Top sticky header**: Ivory cream background with search bar, Gamosa red accents
2. **Hero section**: Muga gold gradient + category tile grid (8 tiles: Tea, Spices, Handloom, Crafts, Food, Books, Attire, Kitchen)
3. **Product grid**: White cards on cream background, 2–3 column responsive, Gamosa red trust badges
4. **Bottom unified nav**: 5-item navigation with deep crimson active state, persistent across pages
5. **Dark mode**: Forest green backgrounds (tea garden darkness), reduced brightness, Muga gold accents

## Spacing & Rhythm
- **Micro**: 2px, 4px (borders, gaps)
- **Small**: 8px (button padding, icon margins)
- **Medium**: 16px (card padding, section spacing)
- **Large**: 24px (section margins, hero padding)
- **XL**: 32px+ (full-screen sections)
- **Density**: Tight on mobile, relaxed on desktop; product grids flow with system rhythm

## Component Patterns
- **Buttons**: Primary (Gamosa red bg, ivory text, sharp hovers), Secondary (muted bg, brown text), Accent (forest green, used sparingly)
- **Search input**: 2px border on focus (primary crimson), placeholder in muted, clear icon on right
- **Product card**: Image top, title 2-line, price in bold (Gamosa red), rating badge with star (forest green), add-to-cart bottom
- **Badge verified**: Accent green bg with ivory text, icon + "Verified Seller" label
- **Category tile**: Icon (48px), label below, muted bg on default, hover state darkens 10%

## Motion
- **Smooth transitions**: All interactive elements use cubic-bezier(0.4, 0, 0.2, 1) over 300ms
- **Page enter**: Fade-in 400ms
- **Card hover**: Shadow elevation 200ms
- **Button press**: Scale 95% on active, return on release
- **Bottom nav switch**: Fade-in 200ms on label change

## Constraints
- **Gamosa red (primary) for all CTAs** — every critical action uses Gamosa crimson for cultural authenticity
- **Forest green sparingly** — accent only on secondary elements and verified badges
- **Muga gold accents** — used for premium tier, special highlights, hero section gradients
- **Dark mode uses forest green base** — preserves tea garden aesthetic and Assamese cultural identity
- **Bottom nav persistent** — always accessible, Gamosa red active state
- **Search always sticky** — searchable product index available on every page

## Signature Detail
**Trust Signal Integration**: Verified seller badges (gold accent + icon) appear on product cards and seller profiles. Delivery promise ("Fast delivery", "Same-day") integrated as small badges below price. Star ratings and review count displayed prominently. Order tracking uses milestone icons with warm accent colors. These details reinforce confidence in transactions without cluttering the interface.

## Dark Mode Overrides
- **Background**: 0.20 0.06 145 (forest green base — tea garden darkness)
- **Card**: 0.25 0.05 145 (slightly lighter forest green)
- **Primary**: 0.55 0.16 30 (brightened Gamosa red for readability)
- **Secondary**: 0.75 0.12 50 (brightened Muga gold)
- **Accent**: 0.48 0.10 145 (brightened forest green)
- **Foreground**: 0.96 0.02 60 (ivory/cream text for contrast)
- **Muted**: 0.32 0.04 145 (dark forest for disabled states)
