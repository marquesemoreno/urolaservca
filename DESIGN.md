---
name: Urolaser Especialidades Médicas
description: A team under one roof, set on a petrol-to-teal field with white rounded cards and one green.
colors:
  ink: "#0A2A33"
  muted: "#46616A"
  brand: "#006078"
  deep: "#00485A"
  teal: "#0A808A"
  soft: "#E4F1F0"
  mint: "#CFEBE6"
  green: "#2FBF8F"
  bg: "#F3F7F7"
  surface: "#FFFFFF"
  line: "#D6E3E5"
  on-dark: "#EAF4F5"
  on-dark-muted: "#BFD9DE"
  footer: "#06303B"
  whatsapp-float: "#0F7A3F"
typography:
  display:
    fontFamily: "Outfit, Manrope, system-ui, sans-serif"
    fontSize: "clamp(32px, 5.2vw, 62px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Outfit, Manrope, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 46px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Outfit, Manrope, system-ui, sans-serif"
    fontSize: "clamp(21px, 2vw, 25px)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.35
rounded:
  sm: "16px"
  md: "22px"
  lg: "24px"
  xl: "32px"
  hero: "36px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  lg: "36px"
  wrap: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "12px 26px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.deep}"
  button-white:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.deep}"
    rounded: "{rounded.pill}"
    padding: "12px 26px"
  button-green:
    backgroundColor: "{colors.green}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  info-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "20px 22px"
  specialty-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "24px"
  specialty-feature:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  stat-band:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.xl}"
---

# Design System: Urolaser Especialidades Médicas

## Overview

**Creative North Star: "The Team Under One Roof"**

The home page is a drenched petrol-to-teal panel on a pale cool ground, with white rounded cards laid over it. The point is to show a real team and the practical answers (hours, where, who) in one glance. Real doctor portraits are the only imagery. One green (#2FBF8F) is spent on numerals, rules, step markers and the primary action accents, so it stays rare against the petrol.

The voice is warm and orderly rather than clinical: large friendly Outfit headlines, Manrope at a generous 17px for older readers, 44px+ touch targets, and big radii everywhere. Depth comes from a single soft shadow plus tonal layering of dark petrol, soft mint and white.

The build was code-led (no comp). Finish review disposition was "fix"; eight fixes were applied and re-inspected on desktop and a 375px mobile viewport. The build shows the ground at #F3F7F7, slightly different from the brief's #F5F8F8; the build is recorded.

**Key Characteristics:**
- Petrol-to-teal 125deg gradient hero panel with an arch-framed lead portrait over a darker circle
- Three white info cards overlapping the hero's bottom edge
- Bento specialty grid with a dark feature tile; stat band in deep petrol
- Pill buttons and pill header; 16 to 36px radii on everything else
- Outfit display, Manrope body

## Colors

A cool petrol family (deep to teal) with mint tints, white cards, and one green accent.

### Primary
- **Deep Petrol** (#00485A, `--deep`): hero gradient start, stat band, contact section, hover state of primary button, dark text accents on light.
- **Clinic Petrol** (#006078, `--brand`): primary button, links, gradient midpoint (at 48%), feature tile gradient end.
- **Lagoon Teal** (#0A808A, `--teal`): hero gradient end only.

### Secondary
- **Signal Green** (#2FBF8F, `--green`): numerals in the stat band, step markers, focus ring, nav hover rule, feature-tile arrow, hover border on specialty cards, green CTA button.

### Neutral
- **Petrol Ink** (#0A2A33, `--ink`): body text on light, text on green.
- **Slate Teal Muted** (#46616A, `--muted`): secondary text on light.
- **Cool Mist** (#F3F7F7, `--bg`): page ground.
- **Soft Mint Wash** (#E4F1F0, `--soft`): steps section background, portrait placeholders, arrow discs, tag pill.
- **Mint** (#CFEBE6, `--mint`): white button hover.
- **Hairline** (#D6E3E5, `--line`): card borders, dividers.
- **On Dark / On Dark Muted** (#EAF4F5 / #BFD9DE): text on petrol.
- **Footer Petrol** (#06303B): footer ground.
- **WhatsApp Green** (#0F7A3F): the floating desktop WhatsApp button only, darkened for white-text contrast.

### Named Rules
**The One Green Rule.** Signal Green marks numerals, counters, rules and focus; never body text and never large fills outside the CTA band or button.
**The Drenched Hero Rule.** Petrol-to-teal appears as a gradient only in the hero and the feature tile; flat Deep Petrol is used for the stat band and contact.

## Typography

**Display Font:** Outfit (with Manrope, system-ui, sans-serif)
**Body Font:** Manrope (with system-ui, sans-serif)

**Character:** Outfit's geometric roundness gives headlines a human, approachable weight; Manrope keeps long reading text steady and legible.

### Hierarchy
- **Display** (700, clamp(32px, 5.2vw, 62px), 1.05, -0.03em): hero h1 only.
- **Headline** (700, clamp(30px, 3.6vw, 46px), 1.1): section h2s.
- **Title** (600, clamp(21px, 2vw, 25px), 1.15): specialty card h3; feature tile goes up to clamp(30px, 3.4vw, 42px); doctor names 18px.
- **Body** (400, 17px, 1.6): page text; lead copy clamp(17px, 1.5vw, 19px) capped at 50 to 60ch; muted text 15 to 16px.
- **Label** (700, 15px; 13px for tags and dt): buttons are 16px/700, nav is 15px/600. Stat numerals are Outfit 700 clamp(34px, 5vw, 56px) with tabular numbers.

### Named Rules
**The Tabular Facts Rule.** Hours, registrations and stats use tabular numerals.

## Layout

Single column, content wrapper max 1180px with 24px side padding. Section padding is clamp(48px, 6vw, 100px). The hero panel is a two-column grid (1.05fr / .95fr) from 960px, with the portrait first on mobile at about 64% width (max 230px). Info chips are 3 columns from 860px, stacked below, pulled up with a negative margin of about 76 to 96px. Stat band is always 3 columns. Specialty bento is 1 column, 2 from 700px, 4 from 1040px with the feature tile spanning 2x2. Team grid is 2 columns on mobile, auto-fill min 200px from 700px. Steps are 3 columns from 860px. Contact splits 1fr/1fr from 960px.

Mobile rules (375px verified): the name chip centers under the portrait; non-feature specialty cards collapse to a compact row (avatar, text, arrow) with only one avatar; the floating WhatsApp button is hidden below 960px and the header collapses to a details menu; stat numerals never wrap.

Spacing rhythm is 8, 12, 14, 16, 18, 20, 24, 28, 36, 40px steps; gaps of 14 to 16px between cards.

## Elevation & Depth

Hybrid: tonal layering (petrol, mint, white) does most of the work, with one soft, long, low-spread shadow for lifted white cards.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 22px 40px -28px rgba(0,0,0,.4)`): info chips, name chip, specialty card hover.
- **Header bar** (`0 14px 30px -22px rgba(0,0,0,.28)`) with a 10px backdrop blur on 92% white.
- **Menu popover** (`0 18px 40px -20px rgba(10,42,51,.3)`).
- **Float button** (`0 10px 24px -10px rgba(0,0,0,.45)`).

### Named Rules
**The Soft Lift Rule.** Shadows are negative-spread and neutral; they never offset hard and never tint.

## Shapes

Generous and soft. Pill (999px) for buttons, header, tags and menu. 36px for the hero panel, 32px for the stat band and lead-doctor card, 28px for the map, 24px for specialty and step cards, 22px for chips and team portraits, 16 to 20px for small cards and notes. The lead doctor sits in an arch (999px top corners, 28px bottom) over an oversized deep-petrol circle with a thin green arc. Specialty cards use a 1px hairline border; avatars are circles with 3px white rings, overlapping by 12px.

## Components

### Buttons
- **Shape:** full pill, min-height 50px (46px in the header), padding 12px 26px, 16px/700.
- **Primary:** Clinic Petrol fill, white text; hover deepens to Deep Petrol.
- **White:** on dark surfaces, Deep Petrol text; hover Mint.
- **Outline (ghost):** 1.5px white 55% border for use on the hero; hover adds a 14% white wash.
- **Green:** Signal Green with Petrol Ink text for the CTA band.
- Transition .25s on `cubic-bezier(.22,1,.36,1)`. Focus is a 3px green outline with 3px offset.

### Info Chips
White 22px-radius cards, 20x22px padding, Outfit 22px/700 headline, 15px muted sub, 44px-tall text link in Clinic Petrol. They carry hours, an avatar stack with the team count, and the address with route link.

### Specialty Cards (Bento)
White, hairline border, 24px radius, min 210px tall, title plus 15.5px muted copy plus the attending doctors' avatars and a 44px mint arrow disc. Hover (hover-capable devices only) lifts 4px, adds Lift shadow, a green border and a green disc. The feature tile is a Deep-to-Brand 150deg gradient with a three-portrait row.

### Stat Band
Deep Petrol 32px-radius band, three columns, Outfit numerals with the unit or marker in Signal Green, 15px On Dark Muted labels.

### Header and Navigation
Sticky pill bar on 92% white with blur; 15px/600 links with a 2px green underline on hover from 960px; a details/summary menu below that.

### FAQ
Cool Mist rows with a hairline border and 18px radius; open state turns white with a Clinic Petrol border. 17px/700 summaries.

### Doctor Portrait Card
4:5 portrait, 22px radius, Outfit 18px/600 name, role in Deep Petrol 15px/600, registration in muted tabular 15px. Registration appears next to every named professional.

## Do's and Don'ts

### Do:
- **Do** keep every portrait at 4:5 (or the arch frame) with object-position near the top (12 to 20%) so faces are never cropped.
- **Do** use Deep Petrol for flat dark sections and the 125deg Deep/Brand/Teal gradient only for the hero.
- **Do** keep touch targets at 44px or more and body copy at 17px or more for the older-reader audience.
- **Do** show registration next to every doctor's name.
- **Do** gate hover motion on `(hover:hover)` and honor `prefers-reduced-motion`.

### Don't:
- **Don't** add imagery other than real doctor portraits and the map.
- **Don't** use Signal Green as text color on white or as a large background.
- **Don't** use hard offset shadows or tinted glows; use the Lift vocabulary.
- **Don't** use sharp corners; the smallest radius is 16px except for the 8px focus ring.
- **Don't** invent stats, testimonials or prices.
