# Product Requirements Document (PRD): KisanSarthi

## 1. Product Overview

### 1.1 Name
**KisanSarthi** (Farmer's Guide)

### 1.2 Purpose
KisanSarthi is a mobile-first web application designed to help farmers and agricultural planners optimize their field layouts. By visually mapping field boundaries and selecting a specific crop type, the application provides an actionable planting blueprint that outlines optimal spacing, exact input requirements (seeds, fertilizer), expected yields, and financial estimates (revenue, cost, and profit).

### 1.3 Target Audience
- **Farmers** looking to optimize resource allocation and predict profit.
- **Agricultural Planners & Agronomists** assisting farmers with crop rotation and layout planning.

## 2. Core User Flow

The application follows a simple, 4-step wizard-style flow:

1. **Home Screen (Landing):**
   - Introduction to the application.
   - Entry point: "Start Planning" button to initialize a new session.

2. **Draw Field Screen:**
   - Interactive map interface (currently mocked for rapid UI validation with demo points).
   - Users drop points (minimum 3) to create a closed polygon representing their field.
   - Real-time updates showing the calculated area in square meters, acres, and hectares.
   - Controls to Undo points, Clear the map, or Complete the boundary.

3. **Crop Planner Screen:**
   - Allows users to select from pre-configured crop types (e.g., Cotton, Wheat, Groundnut, Maize, Cumin).
   - Displays a dynamic overview of the chosen crop's properties:
     - Row Spacing (cm)
     - Plant Spacing (cm)
     - Seed Rate (kg/acre)
     - Fertilizer Requirement (kg/acre)
     - Expected Yield (Quintals/acre)
   - Configuration of field row orientation: Horizontal, Vertical, or Auto.
   - Action item to generate the layout.

4. **Results Summary Screen ("Blueprint"):**
   - Displays a visual preview map of the field layout, populated with crop rows (preview lines).
   - Final numeric dashboard showing:
     - Total Area vs Usable Area
     - Estimated Number of Rows & Total Plants
     - Precise Seed & Fertilizer Requirements
     - Yield Prediction (Quintals)
     - Financial Estimates: Estimated Revenue, Cost, and net Profit.

## 3. Features & Requirements

### 3.1 Mapping & Area Calculations
- **Interactive Map:** Ability to drop pins to map a boundary via Leaflet/React-Leaflet.
- **Geospatial Math:** Conversion of polygon points into precise acreage/sq meters ( Turf.js ).
- **Constraint Handling:** The system must enforce that a valid polygon has at least 3 points before advancing.

### 3.2 Crop Modeling & Economics
- **Crop Database:** Must use an adaptable data source (currently `crops.json`) with yield variables per crop.
- **Economics Engine:**
  - Revenue = Yield * Market Price
  - Cost = (Seed required * Seed price) + [Future variable costs]
  - Profit = Revenue - Cost

### 3.3 UI & UX (Non-Functional Requirements)
- **Mobile-First Design:** The application is built for rural deployment; therefore, the interface and buttons are large and tap-friendly using TailwindCSS classes.
- **State Persistence:** Should maintain state (via Context API `usePlannerStore`) across wizard progression so the user does not lose layout progress when navigating back.
- **Responsiveness & A11y:** Clear contrast, readable typographies (`font-heading`), and actionable feedback (e.g., loading states simulating generation).

## 4. Technical Architecture

- **Frontend Framework:** React 19 + React Router v7.
- **Build Tool:** Vite (for fast HMR and compilation).
- **Styling:** Tailwind CSS combined with custom utility classes (`border-leaf-100`, `bg-earth-50`).
- **State Management:** Custom React Context store (`usePlannerStore`).
- **Geospatial Libraries:** Leaflet API for rendering map tiles, and `@turf/turf` for spatial analysis (computing areas, offsets, generating grid lines).

## 5. Future Scope
- **Real GPS Tracking:** Allow users to walk their field's perimeter to automatically draw boundary lines.
- **Saved Blueprints:** Allow saving crop plans to a cloud database (Firebase, Supabase, backend API).
- **Multi-Crop Planning:** Allow partitioning a drawn field to dedicate a percentage to one crop and the rest to another.
- **Weather API Integration:** Factoring in real-time localized weather data for planting start-date suggestions.
