# Product Catalog & Shopping Cart

Single-page e-commerce catalog application built with React 19, TypeScript, Redux Toolkit, and React Router 7 following Feature-Sliced Design (FSD).

## Key Features

- **Catalog Filtering & Sorting:** Filter products by category, sort by price or title, and search with a 500ms debounce.
- **Client-Side Pagination:** Dynamic page range calculation with automatic page clamping when filters change.
- **Persistent Shopping Cart:** Cart state persisted to `localStorage` with runtime schema validation via TypeScript type guards and stock limit enforcement.
- **Theme Switching:** Light and dark themes powered by CSS custom properties, persisted to `localStorage` with automatic `prefers-color-scheme` fallback.
- **Resilient UI:** Shimmer loading skeletons, accessible toast notifications (`aria-live`), and route-level error boundaries.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9, React Router 7
- **State Management:** Redux Toolkit 2, React-Redux 9, Reselect (`createSelector`)
- **Styling:** SCSS Modules, CSS Custom Properties
- **Build & Tooling:** Vite 7, ESLint 9, Node.js Test Runner (`node:test`)

## Architecture

The project is organized according to **Feature-Sliced Design (FSD)**:

- `src/app` — application initialization, global styles, router, and Redux store configuration
- `src/pages` — route-level pages (`Main`, `Product`, `ShoppingCart`)
- `src/widgets` — composite UI blocks (`Header`, `AddButton`, `ErrorBoundary`)
- `src/entities` — business domain slices, API clients, and models (`product`, `cart`)
- `src/shared` — reusable UI primitives (`Button`, `Container`, `Icon`, `Skeleton`, `Toast`), hooks, and static assets

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start development server

```bash
pnpm dev
```

### 3. Run unit tests

```bash
pnpm test
```

### 4. Build for production

```bash
pnpm build
```
