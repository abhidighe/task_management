# Task Management

This repository contains two applications:

- `API/` – Node.js + Express + TypeScript backend
- `task-management-ui/` – React + Vite frontend

## Prerequisites

- Node.js 18+ or compatible version
- npm

## Getting started

1. Install backend dependencies:
   ```bash
   cd API
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd task-management-ui
   npm install
   ```
3. Start the API in a new terminal:
   ```bash
   cd API
   npm run dev
   ```
4. Start the frontend in a new terminal:
   ```bash
   cd task-management-ui
   npm run dev
   ```

The backend listens on port `3000` by default, while the frontend is typically served on Vite's default port `5173`.

## Architectural decisions

- The backend and frontend are kept as separate apps so each can evolve independently and communicate through a clear API boundary.
- TypeScript is used across both projects to improve maintainability and reduce runtime errors.
- Redux Toolkit is used in the UI to manage task state in a predictable way.
- The backend uses a lightweight in-memory store for this small project, which keeps the setup simple without adding database overhead.
- If application expands with more functinality will create seperate repo for this and also make more manageble.

## API URL configuration

The frontend uses an environment variable for the backend base URL:

- `task-management-ui/.env.development`
- `task-management-ui/.env.production`

Set `VITE_API_BASE` to the correct API address in those files.

Example:

```env
VITE_API_BASE=http://localhost:3000
```

