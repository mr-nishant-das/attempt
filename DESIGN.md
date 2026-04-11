# AssamRoots Design Brief

## Purpose & Context
Assamese-first e-commerce discovery platform celebrating heritage products with trust-focused, mobile-first interface inspired by Flipkart and Blinkit.

## Tone & Aesthetic
Warm, authentic, editorial, premium-casual. Assamese cultural identity woven throughout. Trust-driven e-commerce patterns emphasizing verified sellers, ratings, delivery confidence.

## Color Palette (OKLCH)

| Role | OKLCH | Hex | Usage |
|---|---|---|---|
| Primary | 0.68 0.24 55 | #F39C12 | Saffron — CTAs, bottom nav, trust badges |
| Secondary | 0.40 0.15 155 | #1B5E20 | Forest Green — Heritage accent, dark mode background |
| Accent | 0.75 0.18 65 | #E8C547 | Gold — Highlights, verified badges, premium tier |
| Background | 0.98 0.01 60 | #FAF7F2 | Warm cream, not white |
| Card | 1.0 0 0 | #FFFFFF | Pure white for product cards |
| Foreground | 0.12 0.02 40 | #1F1613 | Warm charcoal, text |
| Border | 0.94 0.02 55 | #F0EBE3 | Soft warm neutral |
| Muted | 0.92 0.02 50 | #E8E1D7 | Category tiles, inactive states |

## Typography
- **Display**: Satoshi (modern, geometric, Assamese-friendly)
- **Body**: Plus Jakarta Sans (readable, accessible, warm personality)
- **Mono**: JetBrains Mono (technical elements, data displays)
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
1. **Top sticky header**: Warm cream background with search bar, transparent navigation indicators
2. **Hero section**: Saffron-tinted gradient + category tile grid (8 tiles: Tea, Spices, Handloom, Crafts, Food, Books, Attire, Kitchen)
3. **Product grid**: Alternating card backgrounds (white cards on warm cream), 2–3 column responsive, trust signals integrated (badges, ratings)
4. **Bottom unified nav**: 5-item navigation (Home, Categories, Search, Cart, Account) with saffron active state, persistent across pages
5. **Dark mode**: Forest green backgrounds, reduced brightness, warm gold accents maintained

## Spacing & Rhythm
- **Micro**: 2px, 4px (borders, gaps)
- **Small**: 8px (button padding, icon margins)
- **Medium**: 16px (card padding, section spacing)
- **Large**: 24px (section margins, hero padding)
- **XL**: 32px+ (full-screen sections)
- **Density**: Tight on mobile, relaxed on desktop; product grids flow with system rhythm

## Component Patterns
- **Buttons**: Primary (saffron bg, white text, sharp hovers), Secondary (muted bg, foreground text), Accent (gold, used sparingly for premium/verified)
- **Search input**: 2px border on focus (primary color), placeholder in muted, clear icon on right
- **Product card**: Image top, title 2-line, price in bold (primary), rating badge with star (accent), add-to-cart button bottom
- **Badge verified**: Tiny accent bg with foreground text, icon + "Verified Seller" or "Certified" label
- **Category tile**: Icon (48px), label below, muted bg on default, hover state darkens 10%

## Motion
- **Smooth transitions**: All interactive elements use cubic-bezier(0.4, 0, 0.2, 1) over 300ms
- **Page enter**: Fade-in 400ms
- **Card hover**: Shadow elevation 200ms
- **Button press**: Scale 95% on active, return on release
- **Bottom nav switch**: Fade-in 200ms on label change

## Constraints
- **No pure white backgrounds** in light mode — use warm cream (#FAF7F2) to reduce eye strain and reinforce Assamese warmth
- **Saffron never pure on small text** — check AA+ contrast; use on large elements, buttons, badges
- **Dark mode forest green base** — preserve Assamese cultural identity in both themes
- **Bottom nav persistent** — never hidden, always reachable
- **Search always sticky** — visible across all pages, searchable product/category index
- **No burger menu** — all navigation via bottom bar + content drawers

## Signature Detail
**Trust Signal Integration**: Verified seller badges (gold accent + icon) appear on product cards and seller profiles. Delivery promise ("Fast delivery", "Same-day") integrated as small badges below price. Star ratings and review count displayed prominently. Order tracking uses milestone icons with warm accent colors. These details reinforce confidence in transactions without cluttering the interface.

## Dark Mode Overrides
- **Background**: 0.18 0.05 155 (forest green base)
- **Card**: 0.22 0.04 155 (slightly lighter forest green)
- **Primary**: 0.72 0.20 55 (brightened saffron for readability)
- **Accent**: 0.78 0.15 65 (brightened gold)
- **Foreground**: 0.95 0.02 50 (warm off-white text)
- **Muted**: 0.28 0.03 155 (dark forest for disabled/secondary elements)
