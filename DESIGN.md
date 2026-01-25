# Design System: Subhag Embrion AI
**Project ID:** local-migration-001

## 1. Visual Theme & Atmosphere

The Subhag Embrion platform embodies a **Professional Clinical Sanctuary**, balancing the high-precision requirements of a medical laboratory with a modern, approachable aesthetic. The interface is characterized by a "Clinical Premium" feel—clean, organized, and reliable, yet visually sophisticated through the use of soft layering and meaningful color accents.

The overall mood is **trustworthy and calm**, designed to reduce cognitive load for embryologists and clinicians. It prioritizes information hierarchy and system responsiveness, using expansive white space to frame critical AI diagnostic data. The atmosphere evokes a high-tech medical suite that is both high-performance and human-centric.

**Key Characteristics:**
- **Medical Precision:** High-contrast text and clear metric displays.
- **Breathable Layouts:** Generous margins and internal padding to separate clinical modules.
- **Modern Softness:** Consistent use of 2xl and 3xl rounded corners to soften the technical nature of the content.
- **Layered Depth:** Whisper-soft shadows and light gray backgrounds create a sense of organized stacking.
- **Responsive Trust:** Real-time statuses (e.g., "Online", "Assessing") with pulse animations to signal system life.

## 2. Color Palette & Roles

### Clinical Foundation
- **Deep Clinical Teal (#1B7B6A)** – The primary brand anchor. Used for primary actions (buttons), active navigation states, and key headers. Signals authority and calm.
- **Pristine Lab White (#FFFFFF)** – Primary surface color for cards and containers. Ensures maximum legibility for AI analytics.
- **Cool Clinical Gray (#F5F5F5)** – Primary background for the entire application. Provides a neutral, non-distracting canvas.

### Accent & Utility
- **Softer Teal Mint (#7ECCC3)** – Secondary primary variation used for light backgrounds or hover states in clinical contexts.
- **Deep Emerald-Forest (#0F5449)** – Dark variant for heavy-duty focus or deep-contrast buttons.
- **Soft Muted Gray (#666666)** – Used for secondary metadata and inactive states.

### Clinical Statuses (Medical Priority)
- **Life Success Green (#10B981)** – Used for "Optimal" embryo status and successful process completions.
- **Caution Amber (#F59E0B)** – Signals "Review Required" or "Assessment in Progress".
- **Critical Warning Red (#EF4444)** – Used for anomalies, deletions, or clinical rejections.
- **Intelligent Blue (#3B82F6)** – Highlights AI-specific features, data downloads, and system information.

## 3. Typography Rules

- **Primary Font Family:** Inter
- **Usage:** Modern, highly legible sans-serif optimized for data-dense medical interfaces.
- **Monospaced Font Family:** Fira Code (via `.mono` class)
- **Usage:** Used for technical IDs (Embryo ID, Frame Count) and precision timestamps.

### Hierarchy & Weights
- **Main Headers:** Black (900) or Bold (700) weights with tight tracking for a premium "editorial" feel.
- **Body Text:** Regular (400) or Medium (500) for comfortable clinical reading.
- **Labels:** Extra-bold (800) uppercase with wide letter-spacing (uppercase tracking-widest) used for metadata categories (e.g., "EMBRYOS", "AVG VIABILITY").

## 4. Component Stylings

- **Buttons:** 
  - **Shape:** Generously rounded corners (`rounded-xl` or larger).
  - **Interaction:** Subtle lift on hover and scale-95 on active click to make the clinical interface feel "alive."
- **Cards/Containers:** 
  - **Base:** White backgrounds with hairline borders or `shadow-sm`.
  - **Border Radius:** Consistent `rounded-[24px]` or `rounded-[32px]` for a modern, approachable look.
  - **Hover:** Transition to `shadow-xl` and slight vertical lift to highlight interactivity.
- **Inputs/Forms:** 
  - **Style:** Flat light gray backgrounds (`bg-gray-50`) with no initial borders, shifting to a teal focus ring.
  - **Shape:** Matching `rounded-2xl` consistency.

## 5. Layout Principles

- **Grid Alignment:** Use of responsive 12-column grids for dashboards and 2-column "Detail vs. Assessment" splits for deep analysis pages.
- **Whitespace Strategy:** Base spacing unit of 4px (Tailwind standard), but components favor large gaps (`space-y-8` or `gap-8`) to prevent clinical clutter.
- **Vertical Rhythm:** Clear separation between "Section Header," "Metric Grid," and "Worklist Content."

## 6. Design System Notes for Stitch Generation

When creating new medical modules with Stitch:
- **Atmosphere:** Describe as "A premium clinical environment with a focus on Deep Clinical Teal (#1B7B6A) and generous white space."
- **Shape Language:** Use "Modern rounded corners (24px)" and "Whisper-thin borders."
- **Data Display:** Describe as "Metadata presented in bold, small uppercase with wide letter-spacing for a professional lab look."
- **Elevation:** Use "Flat surfaces with subtle layering using light gray backgrounds and soft drop shadows on interaction."
