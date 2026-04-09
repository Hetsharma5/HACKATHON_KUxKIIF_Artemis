# KisanSarthi: Tech Stack & File Structure

This document outlines the technical foundation and the directory layout of the KisanSarthi web application.

## 1. Tech Stack

### Core Technologies
- **React (v19):** The core UI library used to build the application and manage component state.
- **Vite (v6):** Modern, fast build tool and development server.
- **React Router (v7):** Handling client-side routing and step-by-step navigation through the application.

### Styling & UI
- **Tailwind CSS (v3.4):** A utility-first CSS framework for rapid UI development, used here for custom theming (e.g., custom colors like `leaf-100`, `earth-50`) and responsive layouts.
- **PostCSS / Autoprefixer:** CSS processing tools utilized alongside Tailwind.

### Mapping & Geospatial Analysis
- **Leaflet (v1.9) & React-Leaflet (v5):** Open-source JavaScript libraries used to display and interact with the interactive maps for the field boundary drawing.
- **Turf.js (`@turf/turf` v7.2):** Advanced geospatial analysis engine for JavaScript. It powers the complex geographic math behind area calculation and geometric layout generation on the map.

## 2. File Structure

An overview of the project directory and the responsibilities of each section:

```text
HACKATHON_KUxKIIF
├── index.html                  # Main HTML entry point
├── package.json                # Project dependencies, scripts, and basic config
├── tailwind.config.js          # Custom theme extensions (colors, fonts, animations)
├── vite.config.js              # Build configurations for Vite
└── src/                        # Main source code directory
    ├── main.jsx                # React root rendering and top-level providers
    ├── App.jsx                 # Global Router configuration defining all screens
    ├── index.css               # Global CSS setup including Tailwind directives
    │
    ├── components/             # Reusable UI building blocks
    │   ├── AppButton.jsx       # Standard customized button component
    │   ├── BottomActionBar.jsx # The sticky floating action bar at the screen bottom
    │   ├── CropCard.jsx        # Individual crop selection radio cards
    │   ├── ScreenContainer.jsx # Base layout wrapper to ensure consistent padding/headers
    │   ├── StatCard.jsx        # Dashboard metric display tile
    │   └── StaticFieldMap.jsx  # Map viewer and point-dropping area handler
    │
    ├── data/                   # Static application data
    │   └── crops.json          # Configuration containing settings for spacing, yield, costs
    │
    ├── hooks/                  # Custom React Hooks
    │   └── usePlannerStore.jsx # The global Context API state manager holding current 
    │                           # points, selected crop, area, and calculation step
    │
    ├── routes/                 # Main page components representing each step of the flow
    │   ├── HomeScreen.jsx      # Landing screen for onboarding
    │   ├── DrawFieldScreen.jsx # Step 1: Mapping the boundary points
    │   ├── CropPlannerScreen.jsx # Step 2: Choosing crop type and orientation
    │   └── ResultsScreen.jsx   # Step 3: Displays math, financials, and the layout blueprint
    │
    └── utils/                  # Core algorithms and helper functions
        ├── area.js             # Turf.js logic to convert points to sq meters/acres
        ├── estimates.js        # Engine for calculating yield forecasts, seed counts, and profit
        ├── format.js           # Lightweight number parsing/currency formatters
        └── layout.js           # Math to generate the spacing and row paths on the field
```

### 3. State Management Details
The application bypasses heavy third-party state managers (like Redux or Zustand) and entirely leverages React's built-in **Context API**. State is encapsulated within `usePlannerStore.jsx`, delivering a lightweight but scalable solution that keeps properties synced smoothly between the map interactions (`DrawFieldScreen`) and the blueprint computations (`ResultsScreen`).
