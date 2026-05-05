# Directory Structure Map

## Root Level
- `package.json`, `vite.config.ts`, `tsconfig.json`: Standard Vite+React configuration files.
- `index.html`: Main HTML template.
- `fetch_scut.js`, `read_doses.py`: Utility scripts used to fetch external data or parse the original medication spreadsheet.
- `lote1.json` - `lote8.json`: Batched JSON dumps containing medication data extracted from the Excel spreadsheet, pending full import into the application.

## src/
- `App.tsx`: Contains the core application UI, routing (view state), and calculation logic.
- `data.ts`: Contains the database of medications and default reference values.
- `types.ts`: Type definitions for the app.
- `index.css` / `main.tsx`: Standard React entry points.
