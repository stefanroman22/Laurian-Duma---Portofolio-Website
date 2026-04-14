# design.md — Ghost Shell OS · Design System
> Source: Stitch project **"Cyber OS Portfolio"** (`projects/14785477311011475631`)  
> Design System: **Ghost Shell OS** (`assets/80b25fd87d7142c7820c52c3d0419dfc`)  
> Theme: **The Kinetic Shadow / The Obsidian Command**  
> Mode: DARK · Variant: VIBRANT · Roundness: ROUND_FOUR (4px) · Spacing Scale: 1×

---

## 1. Color Tokens

### Primary Palette
| Token | Hex | Role |
|---|---|---|
| `primary` | `#86adff` | Interactive accent, links, focus rings |
| `primary_container` | `#6f9fff` | Primary hover state surface |
| `primary_dim` | `#006fef` | Deep blue glow · Active UI accents |
| `primary_fixed` | `#6f9fff` | Fixed primary (theme-stable) |
| `primary_fixed_dim` | `#5491ff` | Dimmed fixed primary |
| `on_primary` | `#002c67` | Text on primary surfaces |
| `on_primary_container` | `#002150` | Text on primary container |
| `on_primary_fixed` | `#000000` | Text on primary_fixed |
| `on_primary_fixed_variant` | `#002a62` | Variant text on primary_fixed |
| `inverse_primary` | `#005ac5` | Inverse (light-mode) primary |

### Secondary Palette
| Token | Hex | Role |
|---|---|---|
| `secondary` | `#8b94ff` | Secondary interactive |
| `secondary_container` | `#0011fe` | CTA gradient endpoint · "neon-gas" |
| `secondary_dim` | `#5461ff` | Dimmed secondary |
| `secondary_fixed` | `#ccceff` | Fixed secondary |
| `secondary_fixed_dim` | `#bbbfff` | Dimmed fixed secondary |
| `on_secondary` | `#000478` | Text on secondary |
| `on_secondary_container` | `#d7d8ff` | Text on secondary container |
| `on_secondary_fixed` | `#0009b3` | Text on secondary_fixed |
| `on_secondary_fixed_variant` | `#0d1cff` | Variant text on secondary_fixed |

### Tertiary / Accent
| Token | Hex | Role |
|---|---|---|
| `tertiary` | `#69fd5d` | **"Cyber Lime"** · Terminal output · Success states |
| `tertiary_container` | `#59ee50` | Tertiary container |
| `tertiary_dim` | `#49e043` | Dimmed tertiary |
| `tertiary_fixed` | `#59ee50` | Fixed tertiary |
| `tertiary_fixed_dim` | `#49e043` | Dimmed fixed tertiary |
| `on_tertiary` | `#005e07` | Text on tertiary |
| `on_tertiary_container` | `#005406` | Text on tertiary container |
| `on_tertiary_fixed` | `#003e03` | Text on tertiary_fixed |
| `on_tertiary_fixed_variant` | `#005f07` | Variant text on tertiary_fixed |

### Surface Hierarchy (The Obsidian Stack)
| Token | Hex | Role |
|---|---|---|
| `background` | `#0e0e0e` | The void · Base canvas |
| `surface` | `#0e0e0e` | Standard window base |
| `surface_dim` | `#0e0e0e` | Dimmed surface (same as background) |
| `surface_bright` | `#2c2c2c` | Bright lifted surface |
| `surface_container_lowest` | `#000000` | Recessed areas · Input wells · Terminal bg |
| `surface_container_low` | `#131313` | Subtle lift |
| `surface_container` | `#1a1919` | Default container |
| `surface_container_high` | `#201f1f` | Elevated glass panels |
| `surface_container_highest` | `#262626` | Highest elevation container |
| `surface_variant` | `#262626` | Glassmorphism surface (+ `backdrop-blur: 12px`) |
| `surface_tint` | `#86adff` | Surface tint overlay |
| `on_surface` | `#ffffff` | Primary text |
| `on_surface_variant` | `#adaaaa` | Body text · Do NOT use pure `#ffffff` for body |
| `inverse_surface` | `#fcf8f8` | Light-mode inverse surface |
| `inverse_on_surface` | `#565554` | Text on inverse surface |

### Error States
| Token | Hex | Role |
|---|---|---|
| `error` | `#ff6e84` | Bright error (use sparingly) |
| `error_container` | `#a70138` | Error container background |
| `error_dim` | `#d73357` | **Preferred error** · Muted glow, no traffic-light reds |
| `on_error` | `#490013` | Text on error |
| `on_error_container` | `#ffb2b9` | Text on error container |

### Outlines & Dividers
| Token | Hex | Role |
|---|---|---|
| `outline` | `#777575` | Subtle borders (use sparingly) |
| `outline_variant` | `#494847` | Ghost border at 15% opacity for accessibility glints |

### Signature Gradients
```css
/* CTA / Active state — "Neon Gas" */
background: linear-gradient(135deg, #86adff 0%, #0011fe 100%);

/* Ambient window shadow — "Cyan-Tinted Shadow" */
box-shadow: 0px 20px 40px rgba(0, 17, 255, 0.08);

/* CRT Scanline overlay (2% opacity) */
background: repeating-linear-gradient(
  0deg,
  rgba(0, 0, 0, 0.02) 0px,
  rgba(0, 0, 0, 0.02) 1px,
  transparent 1px,
  transparent 2px
);
```

### Override Colors (Base generation seeds)
| Role | Hex |
|---|---|
| Override Neutral | `#050505` |
| Override Primary | `#0077ff` |
| Override Secondary | `#0011ff` |
| Override Tertiary | `#32CD32` |

---

## 2. Typography

### Font Stack
| Layer | Font Family | Use Case |
|---|---|---|
| **Display** | Space Grotesk | Hero metrics · Large OS titles · Headlines |
| **Headline / Title** | Space Grotesk (Inter fallback) | Window titles · Section headers |
| **Body (Human Layer)** | Inter | Descriptions · System labels · Navigation |
| **Label / Mono (Machine Layer)** | JetBrains Mono | Terminal output · File paths · Metadata · Timestamps · Hex codes · Status tags |

### Type Scale
| Role | Font | Size | Tracking | Weight | Notes |
|---|---|---|---|---|---|
| Display-lg | Space Grotesk | `3.5rem` (56px) | `-0.02em` | 700 | OS hero title |
| Display-md | Space Grotesk | `3rem` (48px) | `-0.02em` | 700 | |
| Display-sm | Space Grotesk | `2.25rem` (36px) | `-0.02em` | 600 | |
| Headline-lg | Inter | `2rem` (32px) | `0` | 600 | |
| Headline-md | Inter | `1.5rem` (24px) | `0` | 600 | Window titles |
| Headline-sm | Inter | `1.25rem` (20px) | `0` | 500 | Section headers |
| Title | Inter | `1.125rem` (18px) | `0` | 500 | |
| Body-lg | Inter | `1rem` (16px) | `0` | 400 | Default body |
| Body-md | Inter | `0.875rem` (14px) | `0` | 400 | |
| Body-sm | Inter | `0.75rem` (12px) | `0` | 400 | System labels |
| Label-sm | JetBrains Mono | `0.75rem` (12px) | `0.05rem` | 400 | "Architectural" feel |
| Mono-lg | JetBrains Mono | `1rem` (16px) | `0` | 400 | Terminal primary output |
| Mono-md | JetBrains Mono | `0.875rem` (14px) | `0` | 400 | File paths, metadata |

---

## 3. Spacing Scale (Base 1×)

The `spacingScale` is `1` (no multiplier override). Canonical spacing unit: **4px**.

| Token | Value | CSS Var |
|---|---|---|
| `space-1` | `4px` | `--sp-1` |
| `space-2` | `8px` | `--sp-2` |
| `space-3` | `12px` | `--sp-3` |
| `space-4` | `16px` | `--sp-4` |
| `space-5` | `20px` | `--sp-5` |
| `space-6` | `24px` | `--sp-6` |
| `space-8` | `32px` | `--sp-8` |
| `space-10` | `40px` | `--sp-10` |
| `space-12` | `48px` | `--sp-12` |
| `space-16` | `64px` | `--sp-16` |
| `space-20` | `80px` | `--sp-20` |
| `space-24` | `96px` | `--sp-24` |

**Card/List separation rule:** Min `24px` (`space-6`), preferred `32px` (`space-8`) between list items. No dividers.

---

## 4. Border Radius

Theme roundness: **ROUND_FOUR** (4px base)

| Token | Value | Use |
|---|---|---|
| `radius-sm` | `2px` | Technical components: buttons, inputs, badges |
| `radius-md` | `4px` | Default interactive elements |
| `radius-lg` | `8px` | OS windows, modals, cards |
| `radius-xl` | `16px` | Large floating panels |
| `radius-full` | `9999px` | Notification badges **only** |

---

## 5. Elevation & Depth Rules

### Nesting Tiers
```
background (#0e0e0e)
  └── surface_container_low (#131313)      — Outermost window panels
        └── surface_container (#1a1919)    — Content regions
              └── surface_container_high (#201f1f)  — Elevated sub-panels
                    └── surface_container_lowest (#000000)  — Input wells, terminal
```

### The No-Line Rule
**1px solid borders are forbidden for sectioning.** Hierarchy is expressed through background-color shifts only. Exception: `outline_variant` at 15% opacity as an accessibility "ghost border glint."

### Glassmorphism
Elements using `surface_variant` must apply:
```css
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
```
Floating windows use `20px–40px` blur.

---

## 6. Component Tokens

### Terminal
```css
background: var(--surface_container_lowest); /* #000000 */
color: var(--tertiary);                      /* #69fd5d — output text */
/* Input prompt: on_surface (#ffffff) */
/* Scanline: 2% opacity repeating-linear-gradient */
font-family: 'JetBrains Mono', monospace;
```

### Buttons
```css
/* Primary */
background: linear-gradient(135deg, #86adff, #006fef);
border: none;
border-radius: 2px; /* radius-sm */
/* Hover: 2px inner-glow */

/* Secondary / Ghost */
background: transparent;
color: #86adff;
border: none;
/* Hover: background → surface_container_high (#201f1f) */
```

### Inputs
```css
background: var(--surface_container_lowest); /* #000000 */
border: 1px solid transparent; /* Ghost Border */
/* Focus: border-color → primary (#86adff) */
/* Error: box-shadow → error_dim (#d73357) glow */
border-radius: 2px; /* radius-sm */
```

### Interactive List Items
```css
/* Default: transparent */
/* Hover: background → surface_container_high + 4px primary left accent */
border-left: 4px solid var(--primary); /* #86adff on hover */
```

---

## 7. Icon Rules

- **Style:** Linear / Outline only. **1.5px stroke weight.**
- **No filled icons** anywhere in the system.

---

## 8. Do's & Don'ts (Quick Reference)

| Do | Don't |
|---|---|
| Use `JetBrains Mono` for all numbers & tech data | Use `#ffffff` for body text — use `on_surface_variant` (#adaaaa) |
| Let elements overlap intentionally | Use standard `box-shadow` — must look like a soft blue glow |
| Use `0.05rem` letter-spacing on `label-sm` | Use filled icons |
| Use Cyber Lime (`#69fd5d`) sparingly — highest-priority data only | Use bright red for errors — use `error_dim` (#d73357) |
| Use gradient from `primary` → `secondary_container` for CTAs | Use 1px solid borders for sectioning |
