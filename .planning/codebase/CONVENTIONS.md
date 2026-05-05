# Conventions Map

## Code Style
- Uses functional React components with hooks.
- Styling is implemented heavily via Tailwind CSS utility classes directly on elements.
- Uses inline event handlers and state setters for simplicity.
- The UI features clear icons via `lucide-react`.

## Naming
- Components: PascalCase.
- Variables/Functions: camelCase.
- File names: camelCase or PascalCase.

## Patterns
- Component architecture is largely monolithic (a very large `App.tsx` file managing many views and states).
- State is lifted to the top level `App` component and propagated as needed, or handled locally.
- Configuration and constants are extracted to `data.ts` to keep the UI layer separate from the data layer.

## Error Handling
- Minimal explicit error boundaries. Error prevention is mostly handled via controlled inputs and optional chaining.
