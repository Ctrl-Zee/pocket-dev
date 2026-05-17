# Pocket Dev — Design Guidelines

A portfolio styled as a translucent atomic-violet handheld device. The device IS the UI: navigation happens through the on-device D-pad and buttons, and every page renders inside the LCD as crunchy pixel art. The chassis itself is rendered in smooth, modern CSS — soft shadows, glassy highlights, faint internal-component silhouettes — so the polished hardware contrasts with the deliberately low-fi screen content.

---

## 1. Brand voice

- **Tone:** plain, factual, a little playful. No corporate filler, no hype copy.
- **Personality:** the design does the personality work — quiet hardware, loud screen.
- **Naming:** "Pocket Dev" is the device wordmark. Andrew is the user the device "belongs to."
- **Don't:** add taglines, mission statements, or decorative content just to fill space. One thousand no's for every yes.

---

## 2. Color system

### Chassis (translucent atomic violet)
| Token        | Value     | Use                                     |
| ---          | ---       | ---                                     |
| `shell-1`    | `#c5a7e6` | Highlight band on top of chassis         |
| `shell-2`    | `#9b7fc4` | Mid-tone violet                          |
| `shell-3`    | `#6a4f95` | Shadow violet                            |
| `shell-deep` | `#3a2a5a` | Deep recesses (bezel, internal hints)    |
| `shell-glass`| `rgba(170,140,210,.55)` | Translucent overlay         |

### LCD (default green palette)
| Token   | Value     | Use                              |
| ---     | ---       | ---                              |
| `lcd-bg`     | `#bcd6a6` | Idle screen background            |
| `lcd-bg-dark`| `#7a9568` | Bottom-edge falloff               |
| `lcd-hi`     | `#dbe8c8` | Highlight rows / selected items   |
| `lcd-mid`    | `#4d6a3a` | Secondary text                    |
| `lcd-ink`    | `#1f2d18` | Primary text / sprites            |

### LCD (Konami palette swap)
Hot-pink + cyan flip when easter egg fires.
- bg `#0a0a1a`, hi `#ff3da6`, mid `#3df0ff`, ink `#fff7d6`

### Pixel-content accents (use sparingly inside LCD)
Late-90s pop colors for confetti, secret content, error/alert states only:
- Magenta `#ff3da6`, Cyan `#3df0ff`, Yellow `#ffd83d`, Green-pop `#3dff7a`, Orange `#ff7d3d`, Violet-pop `#a23dff`

### Background (Synth)
Locked synthwave grid:
- Floor `#1a0a3a` → `#4a1268`
- Grid lines `rgba(255,80,200,.18)` at 40px
- Horizon glow magenta radial-gradient

### Rules
- The LCD palette is **4 colors max** at any one time. Pop colors are for accents and easter eggs only.
- Don't introduce new colors. Use `oklch()` derived from the violet base if you absolutely must extend.
- Never use saturations >0.02 for whites or blacks elsewhere on the chassis.

---

## 3. Typography

| Family             | Where                                                | Why                       |
| ---                | ---                                                  | ---                       |
| **Press Start 2P** | All LCD content, chassis engraved labels, wordmark   | The pixel voice           |
| **VT323**          | Optional dense pixel monospace (currently unused)    | Long body text fallback   |
| **Inter**          | Tailwind/system fallbacks outside the device         | Anything that isn't lo-fi |

### Sizing inside the LCD
The LCD is a fixed pixel canvas. Stick to this scale:
- Headers (page name): `11px`
- Menu items / labels: `9px`
- Body text: `9px`
- Supporting body text: `8px`
- Secondary detail text: `7px`
- Hint/footer text: `7px`

Letter-spacing 0.5–2px depending on weight; bigger on smaller text to keep glyphs legible.

### Outside the LCD
- Engraved chassis labels: `7–10px Press Start 2P`, color `rgba(40,20,60,.7)` with `text-shadow: 0 1px 0 rgba(255,255,255,.35)` for the carved-into-plastic look.
- Keyboard hint pill (bottom of page): `8px Press Start 2P`, white on `rgba(20,10,40,.55)` so it stays readable on the synth background.

### Rules
- **No anti-aliasing on pixel content.** `image-rendering: pixelated` on sprite SVGs and rastered glyphs.
- Never mix Inter inside the LCD. Press Start 2P only — that's the whole point.
- Don't drop below 6px on Press Start 2P; it stops being readable.

---

## 4. The chassis

### Shape
- Aspect: tall portrait, ~`min(94vw, 420px)` wide, `min(96dvh, 720px)` tall.
- Border radius: **asymmetric** — `28px 28px 56px 28px` (bigger curve bottom-right, like classic handhelds).
- The bottom-right asymmetry is a load-bearing detail. Don't symmetrize it.

### Materials
- **Translucent purple plastic.** Achieved with layered gradients + inner shadows + a top sheen (`::after` overlay).
- **Internal-component silhouettes** under the surface using `::before`: repeating circuit-board grid (1px lines @ 14px) and an IC chip silhouette upper-right. All at low opacity, `mix-blend-mode: multiply`. They should read as "barely visible" — never as a literal illustration.
- **Highlights:** subtle inset white on top edge, deeper purple on bottom; a glossy upper-half sheen at ~32% opacity.

### Don't
- No gradients on the chassis surface beyond the layered base + sheen — no rainbow, no metallic.
- No physical reflections (specular highlights), no skeuomorphic light sources beyond the implied top-left.
- No charging port, link cable port, headphone jack, wrist strap, or volume wheel. Keep the hardware extras limited to the power LED and core controls.

---

## 5. Hardware controls

| Control          | Position           | Behavior                                                  |
| ---              | ---                | ---                                                       |
| LCD              | Upper section      | Flex-grow within remaining vertical space                 |
| Power LED        | Top-left of LCD bezel | Pulses softly (2.6s ease)                              |
| Rainbow wordmark | Below LCD, right-aligned over A/B | "POCKET DEV" in 6-color sequence       |
| D-pad            | Bottom-left        | Cross with sharp edges, dark plastic, four arms           |
| A / B buttons    | Bottom-right       | Matching round red rubber buttons, tilted -18°            |
| Select / Start   | Below D-pad/AB     | Gray pill rubber, tilted -18°                             |
| Speaker grill    | Bottom-right corner| Diagonal slits at -22°                                    |

### Press states (every interactive element)
- **D-pad arms:** `scale(.96)` + `brightness(.78)`
- **A/B buttons:** `translateY(3px)` + reduced shadow + `brightness(.92)`
- **Pills:** `translateY(2px)` + `brightness(.85)`
- **Every press triggers SFX** (see §7). No silent buttons.

---

## 6. The screen

### LCD treatment (visual only — content is on top)
1. Soft green-gray gradient base
2. Inset bezel shadow on all four edges
3. Horizontal scanline overlay (`repeating-linear-gradient` 1px every 3px @ 7% opacity)
4. **Slow drifting glare bar** (7s linear infinite)
5. Recessed into a dark-purple bezel with crisp inner shadow

### Content layout inside the LCD
- 10px outer padding.
- Page header: `> PAGENAME` in 11px ink, top-aligned.
- Body content fills the middle with `lcd-scroll` (hidden scrollbars).
- Footer hint row: input legend in 7px mid-tone, centered.

### Cursor
- Pointing-hand pixel sprite, 8×11, blinks 1s steps.
- Always sits to the left of the highlighted row at `position: absolute, left: 2px`.
- Selected row gets `background: lcd-hi`, others `transparent`.

### Rules
- The LCD is a **fixed visual budget**. Never scroll the page itself; scroll within the LCD pane only.
- Page changes get the chime; cursor moves get the blip; back gets the low tone.
- New screens enter at `cursor: 0`. Always.

---

## 7. Audio (Web Audio API, square waves)

Every interaction has SFX. No background music.

| SFX        | Trigger                  | Sound                                   |
| ---        | ---                      | ---                                     |
| `blip`     | Cursor move (D-pad)      | 880 Hz square, 40ms                     |
| `confirm`  | A on actionable item     | 660 → 990 Hz, two-step                  |
| `back`     | B / cancel               | 440 → 330 Hz, descending                |
| `chime`    | Page change              | 4-note ascending arpeggio (C E G C)     |
| `error`    | Invalid action           | 180 Hz sawtooth, sliding down           |
| `konami`   | Easter egg               | 5-note victory arpeggio                 |

### Rules
- Volume `0.05–0.07` peak. Quiet by default.
- Always respect the mute state.
- Lazily create the AudioContext on first interaction (autoplay policy).

---

## 8. Motion

| Element         | Animation                                      |
| ---             | ---                                            |
| Power LED       | 2.6s ease-in-out pulse                         |
| LCD glare bar   | 7s linear drift, top-to-bottom                 |
| Cursor sprite   | 1s step blink                                  |
| Button presses  | 50–110ms ease (transform + filter)             |
| Confetti        | 1.4–2.8s linear fall, 360° rotate, fade        |

### Rules
- Nothing animates faster than the press feedback (~50ms). No instant-off transitions.
- No bouncing, no spring physics. This is a 1990s device; ease curves are linear or basic ease.
- Respect `prefers-reduced-motion` for the LED pulse and glare drift (TODO if you ship publicly).

---

## 9. Pages

| Page     | Content                                                            |
| ---      | ---                                                                |
| Home     | Wordmark header, version sub-line, vertical menu of 4 items        |
| About    | Pixel avatar (16×16) + 3-line identity + scrollable bio + skills   |
| Projects | 4 framed project cards, each with name / stack / blurb             |
| Resume   | Pixel "scan" of the PDF, scrollable, with a real Download button   |
| Contact  | 3 framed link rows: GitHub, LinkedIn, Email, each with a sprite    |
| Rotate   | Mobile-only landscape alert ("PLEASE ROTATE YOUR DEVICE")          |
| Secret   | Konami payoff: hot-pink palette + +30 lives message                |

### Rules
- Every page renders into the same LCD area. No modals, no overlays inside the device.
- All navigation happens via D-pad/A/B. Mouse + keyboard mirror them.
- A in Contact opens `target="_blank"`. A in Resume triggers the actual PDF download.

---

## 10. Easter egg

Konami sequence: `↑ ↑ ↓ ↓ ← → ← → B A`

When matched:
1. Palette flips to Konami palette (LCD content stays, colors invert)
2. Pixel confetti rains for ~3.2s
3. Screen swaps to the secret message ("YOU FOUND THE CHEAT CODE / +30 LIVES")
4. `konami` SFX plays
5. A or B returns home

Don't reveal the code anywhere on the site. It's an easter egg. People who know, know.

---

## 11. Responsive behavior

- **Desktop:** device sits centered on the synth background. Width capped at 420px, height capped at 96dvh.
- **Mobile portrait:** device fills viewport (94vw / 96dvh). Buttons become primary tap targets.
- **Mobile landscape:** show the rotate-back alert. Lock to portrait — this is a handheld, not a TV.
- All chassis controls use `clamp()` sizing so the device gracefully scales between 540px-tall and 720px-tall viewports.

---

## 12. Don'ts (worth repeating)

- ❌ Don't add background music
- ❌ Don't add a boot sequence or splash screen — land on home
- ❌ Don't recreate any specific brand's wordmark, button labels, or chassis details. "Pocket Dev" is the original mark; the form is generically late-90s handheld
- ❌ Don't put anti-aliased text inside the LCD
- ❌ Don't draw realistic icons in SVG inside the LCD — pixel-grid only
- ❌ Don't pad pages with filler. Three menu items beat five made-up ones.
