---
name: Neon Protocol
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ffabf3'
  on-secondary: '#5b005b'
  secondary-container: '#fe00fe'
  on-secondary-container: '#500050'
  tertiary: '#faf6fc'
  on-tertiary: '#303034'
  tertiary-container: '#dddae0'
  on-tertiary-container: '#605f64'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#ffd7f5'
  secondary-fixed-dim: '#ffabf3'
  on-secondary-fixed: '#380038'
  on-secondary-fixed-variant: '#810081'
  tertiary-fixed: '#e4e1e7'
  tertiary-fixed-dim: '#c8c5cb'
  on-tertiary-fixed: '#1b1b1f'
  on-tertiary-fixed-variant: '#47464b'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  container-max: 1280px
---

## Brand & Style

This design system is built for a personal DevSecOps dashboard and learning roadmap, emphasizing a high-contrast, terminal-inspired cyberpunk aesthetic. The brand personality is technical, clandestine, and authoritative, designed to make the user feel like they are operating within a secure, high-stakes command center.

The style leverages **Retro-Futurism** mixed with **Brutalism**. It features heavy use of monospaced typography, scanning lines, and glowing neon accents against a void-like background. The interface avoids traditional "soft" UI trends in favor of sharp edges, structural grid lines, and data-dense layouts that prioritize information hierarchy and system status.

The emotional response should be one of "Hyper-Focus" and "Digital Mastery." Every interaction should feel like a command being executed, utilizing scanline overlays, flickering transitions, and "bracket-corner" framing to reinforce the hacker-culture narrative.

## Colors

The palette is strictly dark-mode, designed to minimize eye strain during long "ops" sessions while making data visualizations pop with radioactive intensity.

- **Background (Neutral):** `#0a0a0c` — A deep charcoal/black that serves as the "void."
- **Primary Accent:** `#00f2ff` (Neon Cyan) — Used for primary actions, active navigation states, and "Safe/Success" system statuses.
- **Secondary Accent:** `#ff00ff` (Magenta) — Used for secondary alerts, decorative bracket corners, and "Warning/Unstable" indicators.
- **Surface Tiers:** `#1a1a1e` is used for card backgrounds and container fills to provide subtle separation from the base void.
- **Data/Text:** Pure white `#ffffff` for high-priority text, and `#a0a0a0` for secondary metadata.

## Typography

The typography system creates a distinction between "Interface/System" and "Content/Data." 

**Sora** is utilized for headings and display text to provide a futuristic, geometric look that remains legible in Vietnamese. Its wide stance and bold weights give the dashboard an authoritative feel.

**JetBrains Mono** is used for all body text, labels, and technical data. This reinforces the "terminal" aesthetic and ensures that code snippets, CVE IDs, and system logs are perfectly aligned. All labels should be rendered in uppercase with increased letter spacing to mimic legacy hardware readouts.

## Layout & Spacing

The design system employs a **Fixed Grid** approach for the dashboard to maintain a sense of structured control. 

- **Grid:** A 12-column layout for desktop with 16px gutters.
- **Padding:** A rigorous 4px base unit is used. Internal card padding should typically be 24px (6 units) to allow the technical data room to breathe.
- **Mobile:** On mobile devices, the grid collapses to a single column with 16px side margins. 
- **Structural Elements:** Header and Footer are "locked" to the viewport to simulate a persistent OS environment. Content should be contained within framed boxes rather than bleeding to the edge of the screen.

## Elevation & Depth

Depth is not communicated through soft shadows, but through **Tonal Layers** and **Glow Effects**.

1.  **Level 0 (Floor):** The base background `#0a0a0c`.
2.  **Level 1 (Containers):** Cards and panels use `#1a1a1e` with a 1px border.
3.  **Level 2 (Active/Focus):** Instead of rising in Z-space, active elements gain an outer glow (bloom) using the primary cyan or secondary magenta color.
4.  **Overlays:** Use a subtle scanline pattern (1px horizontal lines at 5% opacity) across the entire UI to create a "CRT" texture.

## Shapes

The design system strictly uses **Sharp (0px)** corners. This reinforces the brutalist, industrial nature of a terminal interface. 

To add visual interest without using rounded corners, components utilize "clipped corners" or "bracket corners." Decorative magenta brackets should sit at the four corners of primary cards, slightly offset from the card's edge to create a "targeting reticle" effect.

## Components

### Buttons
Buttons are rectangular with a 1px border. 
- **Primary:** Cyan border, cyan text, no fill. On hover, the button fills with cyan and text switches to black.
- **Ghost:** White border at 30% opacity, white text.

### Cards & Panels
Cards must have a 1px border in `#1a1a1e`. For "Critical" or "Active" modules, use a Cyan or Magenta 1px border. Every card should include a "status bar" at the top or bottom containing monospaced metadata (e.g., `[STATUS: STABLE]`).

### Roadmap Nodes
Learning roadmap steps are connected by vertical/horizontal lines with 90-degree turns. Completed nodes glow Cyan; upcoming nodes have a dimmed Magenta outline.

### Input Fields
Inputs are underlined or fully boxed with no background. The cursor should be a solid, blinking Cyan block. 

### Navigation Bar
The header is a slim, high-density bar featuring the `system_time`, `network_status`, and `user_alias`. Use "divider pipes" (`|`) or slashes (`//`) to separate navigation items.