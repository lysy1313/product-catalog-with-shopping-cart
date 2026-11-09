# ShopHub — Premium E-Commerce Catalog & Shopping Cart

A modern, responsive e-commerce web application built with React 19, TypeScript, Redux Toolkit, and React Router 7 following Feature-Sliced Design (FSD). Powered by the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Key Features

- **Full Catalog (194+ products across 24 categories):** Rich product catalog with actual discounts, stock statuses, brand filters, and reviews.
- **Multi-Factor Filtering & Search:**
  - Fast search with debounced auto-suggestions for titles, brands, and categories.
  - Category pills and multi-brand selection.
  - Price range filters with min/max bounds and minimum rating filters.
- **Responsive Product Grid & Dynamic Sort:**
  - Product cards featuring discount badges, star ratings, crossed-out original prices, and responsive layout.
  - Sort by Featured, Price (Low to High / High to Low), Rating, and Title.
- **Product Details Page (`/catalog/:id`):** Interactive image gallery, detailed specifications (SKU, warranty, shipping), and genuine customer reviews.
- **Persistent Shopping Cart & Checkout:** Persistent cart in `localStorage` with runtime validation, subtotal/discount calculations, and simulated checkout flow.
- **Dual Themes:** Light and dark theme modes with system `prefers-color-scheme` support.

## Tech Stack

- **Frontend:** React 19, TypeScript 5.9, React Router 7
- **State Management:** Redux Toolkit 2, React-Redux 9, Reselect
- **Styling:** SCSS Modules, CSS Custom Properties
- **Build & Quality:** Vite 7, ESLint 9, Node.js Test Runner (`node:test`)
- **API Source:** [DummyJSON Products API](https://dummyjson.com/docs/products)

## Architecture

The project strictly follows **Feature-Sliced Design (FSD)**:

- `src/app` — app providers, router configuration, store, and global theme styles
- `src/pages` — `Main` (catalog), `Product` (detail page), `ShoppingCart` (cart & checkout)
- `src/widgets` — `Header` (with live search dropdown), `AddButton`, `ErrorBoundary`
- `src/entities` — `product` and `cart` domain models, selectors, and API integration
- `src/shared` — UI primitives (`Button`, `Container`, `Icon`, `Skeleton`, `Toast`), custom hooks (`useDebounce`, `useAppDispatch`, `useAppSelector`)

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
