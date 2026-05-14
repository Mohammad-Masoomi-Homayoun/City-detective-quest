---
inclusion: auto
---

# Guidelines

## Project: City Detective Quest
This is game app for open air scape room

### Architecture
- React + TypeScript with Vite
- Map: @urbica/react-map-gl with MapLibre GL (aliased via Vite)
- Free tile provider: OpenFreeMap (no token required)

### Project Structure
```
src/
├── assets/                  # Static images and icons
│   ├── detective-logo.png   # Detective marker icon
│   ├── failed.avif          # Failed investigation site icon
│   ├── solved.png           # Solved investigation site icon
│   └── jupming-question-mark.gif
├── components/              # Reusable UI components
│   ├── DetectiveMarker.tsx  # User location marker on the map
│   ├── InvestigationSite.tsx # Renders circles + markers + info panel for sites
│   └── MapView.tsx          # Main map component (MapGL wrapper)
├── data/                    # Static/mock data
│   └── investigationSites.ts # Investigation site coordinates and status
├── hooks/                   # Custom React hooks
│   ├── useGeolocation.ts    # Browser geolocation with watchPosition
│   └── useProximityAlert.ts # Detects when user enters a circle zone
├── pages/                   # Page-level components
│   └── Home.tsx             # Main page orchestrating map + notifications
├── test/                    # Test files
│   ├── proximityAlert.test.ts # Tests for distance + proximity logic
│   └── setup.ts             # Vitest setup (jest-dom)
├── types/                   # TypeScript type definitions
│   └── map.ts              # MapCircle, InvestigationStatus types
├── utils/                   # Pure utility functions
│   ├── distance.ts          # Haversine distance + point-in-circle check
│   └── geoCircle.ts         # GeoJSON circle polygon generation
├── App.css                  # Global styles
├── App.tsx                  # Root component
├── index.css                # Base CSS reset
└── main.tsx                 # Entry point (RTL plugin init)
```

### Coding Conventions
- Whenever delete or add new file -> update the Project Structre
- When introducing new method -> annotate cause and duty descripton of meethod as comment on top of method

### Entities
- InvestigationSite
- Detective


### Approaches & Comments
- On top of each method show be the reason why that method exist
- When making a change you need to read the description of method on top


### Notes & Decisions
- Changes should not be more than 10 files

