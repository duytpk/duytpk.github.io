/* ── Shared Tailwind design-system config (loaded after CDN, before DOMContentLoaded) ── */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-lowest":  "#0e0e10",
        "surface-container-low":     "#1c1b1d",
        "surface-container":         "#201f21",
        "surface-container-high":    "#2a2a2c",
        "surface-container-highest": "#353437",
        "on-surface":                "#e5e1e4",
        "on-surface-variant":        "#b9cacb",
        "outline-variant":           "#3a494b",
        "primary":                   "#e1fdff",
        "primary-container":         "#00f2ff",
        "on-primary-container":      "#006a71",
        "primary-fixed-dim":         "#00dbe7",
        "secondary":                 "#ffabf3",
        "muted":                     "#605f64",
        "error":                     "#ffb4ab",
        "on-error":                  "#690005",
      },
      spacing: {
        "container-max": "1280px",
        "unit":   "4px",
        "gutter": "16px",
        "margin": "24px",
      },
      fontFamily: {
        "display-lg":  ["Sora"],
        "headline-lg": ["Sora"],
        "headline-md": ["Sora"],
        "body-lg":     ["JetBrains Mono"],
        "body-md":     ["JetBrains Mono"],
        "label-caps":  ["JetBrains Mono"],
      },
      fontSize: {
        "display-lg":  ["48px", { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "1.2",  letterSpacing: "0.05em",  fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.2",  fontWeight: "600" }],
        "body-lg":     ["18px", { lineHeight: "1.6",  fontWeight: "400" }],
        "body-md":     ["14px", { lineHeight: "1.5",  fontWeight: "400" }],
        "label-caps":  ["12px", { lineHeight: "1.0",  letterSpacing: "0.1em",   fontWeight: "700" }],
      },
    },
  },
};
