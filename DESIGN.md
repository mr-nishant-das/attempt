# AssamRoots Design Brief

## Purpose & Context
Assamese-first e-commerce discovery platform celebrating heritage products with trust-focused, mobile-first interface inspired by Flipkart and Blinkit. Now includes vendor management, OTP-based authentication for customers and vendors, and two-factor admin login.

## Tone & Aesthetic
Warm, authentic, editorial, heritage-first, security-conscious. Deep Gamosa crimson + muga gold + forest green embody Assamese cultural identity. Trust-driven e-commerce emphasizing verified sellers, secure authentication, and transparent vendor management.

## Color Palette (OKLCH)

| Role | OKLCH | Hex | Usage |
|---|---|---|---|
| Primary | 0.48 0.18 30 | #C0392B | Gamosa Red — CTAs, authentication, vendor pending status |
| Secondary | 0.70 0.12 50 | #D4A017 | Muga Gold — Heritage accent, premium tier |
| Accent | 0.42 0.10 145 | #2D6A4F | Forest Green — Verified vendors, active states, secondary actions |
| Background | 0.98 0.02 60 | #FDF6E3 | Ivory/Cream — Form backgrounds, authentication pages |
| Card | 1.0 0 0 | #FFFFFF | Pure white for forms, vendor cards |
| Foreground | 0.22 0.08 25 | #3E1F00 | Earthy Brown — Warm text, form labels |
| Border | 0.94 0.02 60 | #F0EBE3 | Soft warm neutral — Form input borders |
| Muted | 0.92 0.03 60 | #E8E1D7 | Category tiles, inactive states, vendor list headers |

## Typography
- **Display**: Bricolage Grotesque (bold geometric, distinctly Assamese-rooted identity)
- **Body**: Plus Jakarta Sans (warm, accessible, heritage-friendly personality)
- **Mono**: JetBrains Mono (technical elements, OTP inputs, secure key fields)
- **Scale**: Display 2xl–lg for hero/sections, Body sm–base for forms/content, Mono for OTP/keys

## Shape Language
- **OTP digit input**: 48px square with 8px radius — distinct, monospace-friendly
- **Form fields**: 8px radius — slightly tighter for secure forms
- **Vendor cards**: 10px radius — soft, approachable
- **Buttons**: 10px radius — rounded CTAs match cards
- **Icon sizes**: 24–32px for vendor badges, 16–20px for status dots

## Elevation & Depth

| Zone | Background | Border | Shadow |
|---|---|---|---|
| Auth form (form-auth) | card | border-border | shadow-subtle |
| Two-factor form (auth-two-factor) | card | border-border | shadow-elevated |
| Vendor card (vendor-card) | card | border-border | shadow-subtle, hover shadow-elevated |
| Vendor list (vendor-list-container) | card | border-border | shadow-subtle |
| OTP input (otp-input) | input | border-border, focus primary | ring-primary/50 |

## Structural Zones
1. **Auth pages**: Centered form containers (max-width 448px) on cream background with soft shadows
2. **OTP verification**: 6-digit input grid with monospace font, clear digit spacing, green accent badge for secure context
3. **Vendor registration**: Multi-step form with same warm aesthetic as customer signup, clear progress indicators
4. **Admin two-factor**: Complex key input field with monospace font, followed by OTP entry, elevated shadow to signal security
5. **Vendor management**: List view with filterable vendor cards, status badges (active=green, pending=crimson, rejected=destructive)
6. **Dark mode**: Forest green form backgrounds, reduced brightness, Muga gold accents for active states

## Spacing & Rhythm
- **Micro**: 2px (borders, status dots)
- **Small**: 8px (button padding, OTP digit gaps, form field spacing)
- **Medium**: 16px (card padding, form section spacing)
- **Large**: 24px (form container padding, section margins)
- **XL**: 32px (page margins, vendor list section spacing)
- **Density**: Tight on mobile, relaxed on desktop; form fields stack vertically on mobile, inline on desktop where possible

## Component Patterns
- **OTP input**: Monospace digits in bordered squares, auto-advance on digit entry, focus border in crimson, disabled state in muted
- **Form fields**: Label above (small bold brown text), input below (cream background, soft border, crimson focus), error text in destructive color
- **Vendor badges**: Inline flex with icon + status text, three states — active (green bg/text), pending (crimson), rejected (destructive)
- **Secure badge**: Forest green background with accent color, "2FA Enabled" or "Verified" label, used in two-factor context
- **Vendor card**: Vendor name (bold), contact info, status badge, product count, action buttons (edit/suspend inline)
- **Status indicator**: Dot (2px circle) + label, three color states matching badge colors

## Motion
- **Smooth transitions**: All form fields and vendor cards use cubic-bezier(0.4, 0, 0.2, 1) over 300ms
- **OTP digit focus**: 200ms border color transition
- **Form validation**: Shake animation (100ms, ±2px) on error, red flash on invalid input
- **Vendor list hover**: Shadow elevation 200ms
- **Button press**: Scale 95% on active, return on release (active:scale-95)

## Constraints
- **Gamosa red (primary) for all auth CTAs** — every login, registration, and verification button uses Gamosa crimson for cultural authenticity and trust
- **Forest green for verified/active states** — vendor approval badges and active status indicators use forest green
- **Monospace for OTP and secure keys** — ensures clarity and technical association
- **Two-factor forms use shadow-elevated** — signals heightened security context
- **Vendor cards always show status badge** — no ambiguity about vendor approval state
- **Form errors in destructive red** — clear visual distinction from secondary actions

## Signature Detail
**Authentication Trust Signals**: OTP inputs use monospace font to convey security. Secure badges (forest green with checkmark) appear on two-factor screens. Vendor approval status badges are always visible and color-coded (green=active, crimson=pending, red=rejected) for instant clarity. Status indicator dots (2px circles) reinforce status at a glance. Form fields use subtle shadows to lift off background, creating a sense of interaction safety.

## Dark Mode Overrides
- **Background**: 0.20 0.06 145 (forest green base — tea garden darkness)
- **Card**: 0.25 0.05 145 (slightly lighter forest green for form containers)
- **Primary**: 0.55 0.16 30 (brightened Gamosa red for readability)
- **Secondary**: 0.75 0.12 50 (brightened Muga gold)
- **Accent**: 0.48 0.10 145 (brightened forest green for active states)
- **Foreground**: 0.96 0.02 60 (ivory/cream text for contrast)
- **Muted**: 0.32 0.04 145 (dark forest for disabled/inactive states)
- **Form input backgrounds**: 0.30 0.04 145 (slightly lighter than card for input distinction)
