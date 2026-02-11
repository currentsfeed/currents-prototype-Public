import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: "#F8F9FA",
        surface: "#FFFFFF",
        
        // Text colors
        text: {
          primary: "#1A1D23",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
        },
        
        // Belief direction colors (muted editorial palette)
        belief: {
          increasing: "#2D6A4F",  // muted forest green
          decreasing: "#9D5B4E",  // muted terracotta
          stable: "#5B6B7E",      // cool slate
        },
        
        // CTA colors
        cta: {
          primary: "#2C4A6B",     // deep blue-slate
          "primary-hover": "#1E3447",
          secondary: "#8B7EA8",   // muted lavender
          "secondary-hover": "#6F5F8A",
        },
        
        // Accent color
        accent: "#D4926F",        // warm terracotta
        
        // Status colors
        status: {
          open: "#4A90E2",        // clear blue
          "closing-soon": "#E8A34D", // warm amber
          resolved: "#7B8794",    // neutral gray
        },
        
        // Border colors
        border: {
          DEFAULT: "#E5E7EB",
          light: "#F3F4F6",
        },
      },
      
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Courier New'", "monospace"],
      },
      
      fontSize: {
        // Headlines (serif)
        "h1": ["3rem", { lineHeight: "3.5rem", letterSpacing: "-0.02em", fontWeight: "600" }],       // 48px
        "h1-mobile": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em", fontWeight: "600" }], // 32px
        "h2": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.01em", fontWeight: "600" }],       // 32px
        "h3": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],                                 // 24px
        "h4": ["1.25rem", { lineHeight: "1.75rem", fontWeight: "600" }],                             // 20px
        
        // Body text (sans)
        "body-large": ["1.125rem", { lineHeight: "1.75rem" }],   // 18px
        "body": ["1rem", { lineHeight: "1.5rem" }],              // 16px
        "body-small": ["0.875rem", { lineHeight: "1.25rem" }],   // 14px
        
        // UI text
        "caption": ["0.75rem", { lineHeight: "1rem" }],          // 12px
        "label": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.05em" }], // 11px (uppercase labels)
        
        // Numbers (monospace)
        "number-hero": ["3.5rem", { lineHeight: "1", fontWeight: "600" }],   // 56px
        "number-large": ["3rem", { lineHeight: "1", fontWeight: "600" }],    // 48px
        "number-medium": ["2rem", { lineHeight: "1", fontWeight: "600" }],   // 32px
        "number-small": ["1.5rem", { lineHeight: "1", fontWeight: "600" }],  // 24px
      },
      
      boxShadow: {
        "card": "0px 1px 3px rgba(0, 0, 0, 0.06)",
        "card-hover": "0px 2px 8px rgba(0, 0, 0, 0.12)",
        "elevated": "0px 4px 12px rgba(0, 0, 0, 0.08)",
      },
      
      borderRadius: {
        "card": "0.5rem",       // 8px
        "button": "0.5rem",     // 8px
        "badge": "0.25rem",     // 4px
      },
      
      spacing: {
        // Design system spacing scale
        "0.5": "0.125rem",  // 2px
        "1": "0.25rem",     // 4px
        "1.5": "0.375rem",  // 6px
        "2": "0.5rem",      // 8px
        "3": "0.75rem",     // 12px
        "4": "1rem",        // 16px
        "5": "1.25rem",     // 20px
        "6": "1.5rem",      // 24px
        "8": "2rem",        // 32px
        "10": "2.5rem",     // 40px
        "12": "3rem",       // 48px
        "16": "4rem",       // 64px
        "20": "5rem",       // 80px
      },
    },
  },
  plugins: [],
};

export default config;
