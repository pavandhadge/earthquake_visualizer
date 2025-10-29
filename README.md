# Earthquake Visualizer

This is an interactive web application that visualizes real-time earthquake data from the U.S. Geological Survey (USGS). It allows users to explore seismic events on an interactive map, filter data based on magnitude and depth, and take local notes on their observations.

![Earthquake Visualizer Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png) <!-- It's recommended to add a screenshot of the application -->

## Features

- **Live Data:** Fetches and displays the latest earthquake data from the USGS feed.
- **Interactive Map:** A Leaflet-based map to visualize earthquake locations, magnitudes, and depths.
- **Filtering:** Filter earthquakes by magnitude and depth to focus on specific events.
- **Local Notes:** A persistent note-taking feature that saves data in the browser's local storage.
- **Data Export:** Export the current earthquake data to CSV or GeoJSON formats.
- **Modern UI:** A clean, responsive, and modern user interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Mapping:** [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Local Storage:** [Dexie.js](https://dexie.org/) (a wrapper for IndexedDB)
- **Routing:** [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (or yarn/pnpm)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/earthquake-visualizer.git
    cd earthquake-visualizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified files. You can preview the production build with `npm run preview`.

## Project Structure

- `public/`: Static assets.
- `src/`: Main source code.
  - `components/`: React components.
  - `context/`: React context for state management (e.g., notes).
  - `db/`: Database setup (Dexie.js).
  - `assets/`: Static assets like images and SVGs.
- `vite.config.ts`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.