# Design System — "Signal" (Stranger-Things-inspired portfolio)

This design system establishes the visual and interaction guidelines for the Rakshit Kumar portfolio to ensure design consistency across all sections.

---

## 1. Core concept
A software engineer's world is quietly bleeding into something else — like a signal from another dimension. The site should never look "spooky" in a cheap way; it should feel **calm, intelligent, and slightly uncanny** — cold technology with a warm human at the center of it. The engineer is curious about the anomaly, not afraid of it.

Every section = same rule: **mostly void-black, one accent event of red/violet light, drifting particles, a hint of a glitch.** Never full neon, never cluttered.

---

## 2. Color tokens

| Token | Hex | Usage |
|---|---|---|
| `void` | `#08070C` | primary background |
| `void-2` | `#120D1E` | gradient depth, card backgrounds |
| `void-3` | `#17101F` | deepest gradient stop |
| `crimson` | `#C4183C` | primary accent — CTAs, key highlights, rim light warm side |
| `violet` | `#7C3AED` | secondary accent — gradients, rim light cool side |
| `text` | `#F1EDE4` | primary text (warm off-white, never pure white) |
| `muted` | `#8B8698` | body text, labels, secondary UI |
| `chip-border` | `rgba(241,237,228,0.15)` | tag chips, dividers, subtle borders |
| `term` | `#4ADE80` | rare use only — terminal cursor, "status: online" dots, code accents |

Rule of thumb: **90% void, 8% muted/text, 2% crimson+violet accent.** If a section feels "neon," pull accent color back to hover/active states only.

---

## 3. Typography
- **Display** — `Unbounded` (600/800 weight), uppercase, tight tracking (`-0.02em`), used only for section headlines. Gradient text treatment (`text` → `crimson` → `violet`, ~115deg) on the biggest headline per section — don't gradient every heading or it stops meaning anything.
- **Body** — `Inter` (400/500/600), regular tracking, `muted` color for paragraphs, `text` color for emphasis.
- **Mono** — `JetBrains Mono` (400/500) — this is the "engineer" signal. Use it for: nav items, eyebrows/labels (`> whoami`, `> stack.json`), timestamps, tag chips, button micro-copy, status indicators. Never use mono for paragraph body text — it should feel like UI chrome, not prose.

Fonts URL:
```
https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap
```

---

## 4. Background language (per section)
Every section gets the same three layers, tuned per section:
1. **Base gradient** — `linear-gradient(165deg, void 0%, void-2 55%, void-3 100%)` plus 1–2 soft radial accent glows (crimson/violet, 15–22% opacity, large radius). This never moves.
2. **Particle layer** — reuse the hero's spore/nebula system, but vary density and speed by section mood:
   - Hero: dense spores (500), fast-ish drift, foreground depth
   - About / calm sections: sparse (~80–150), slow drift, background only
   - Projects / high-energy sections: medium density, particles react to hover on project cards (repel, like the hero's cursor repulsion)
3. **Grain + scanlines** — same two overlay divs from the hero (`opacity ~0.045`, repeating 1px lines) on every section, so the whole page reads as one continuous "transmission," not separate components.

---

## 5. Motion & interaction language
Reuse these as the site's "signature moves" — don't invent new ones per section, repeat the same few so they read as intentional motifs:
- **Fresnel rim light** — any 3D element (not just the hero figure) gets the same red/violet edge-lit shader. A floating object, a card in 3D, an icon — same treatment ties it to the hero.
- **Glitch-on-proximity** — cursor near an interactive 3D/important element → brief RGB-split + jitter. Use sparingly.
- **Idle signal-loss** — a few seconds of no input → a subtle automatic glitch pulse. Keeps things alive without user action, but keep it rare (every 5–8s, ~150ms duration) so it reads as ambient, not glitchy/broken.
- **Custom cursor dot** — carry the hero's trailing dot across the whole site (already screen-blended so it works on any background), scaling up near interactive elements.
- **Glitch-hover buttons** — the `data-text` RGB-split hover trick from the hero CTAs should be the *only* button style site-wide. Consistency here matters more than novelty.

---

## 6. Section-by-section 3D/visual direction
- **About** — smaller-scale version of the fresnel figure, seated or turned away, next to a simple wireframe/rim-lit desk or terminal shape. Sparse particles, slow, mostly static camera.
- **Skills/Stack** — no character. A loose particle constellation where each "star" is a skill tag; hovering a tag brightens its particle cluster crimson/violet.
- **Projects** — rim-lit "cards" as thin 3D planes floating in depth (parallax on scroll, not full free camera drag). Particle repulsion on hover, reusing hero's repulsion math.
- **Contact** — the most "portal" moment: fog thickens, particles funnel toward a central point (sustained funnel, not a single pulse), glowing threshold shape behind the form.

---

## 7. Component patterns to reuse (don't reinvent per section)
- **Eyebrow label**: `mono`, `crimson`, small leading dash line + `> label` text (`> whoami`, `> stack.json`, `> projects.log`, `> contact.sh`)
- **Section heading**: `Unbounded` gradient text, same gradient angle/stops as the hero every time
- **Tag chip**: `mono`, 11px, `chip-border`, `muted` text — used for skills, project tech-stacks, status labels
- **Primary button**: crimson→violet gradient fill, glitch-hover
- **Secondary button**: transparent, white/25 border, glitch-hover
- **Corner meta text**: top-right `mono` coordinates/status block (e.g. `UPTIME // 3 YRS`, `STATUS // AVAILABLE FOR HIRE`)

---

## 8. What NOT to do
- Don't add a second unrelated color (no blue/teal/gold "for variety") — the restraint of red+violet+void is the identity.
- Don't make every section interactive at hero-level intensity.
- Don't reuse the exact hero camera-drag behavior everywhere.
- Don't introduce a second display typeface.
