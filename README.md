# Task Management

This repository contains two applications:

- `API/` – Node.js + Express + TypeScript backend
- `Frontend/task-management-ui/` – React + Vite frontend

## Prerequisites

- Node.js 18+ or compatible version
- npm

## API (Backend)

1. Open a new terminal for `API/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API in development:
   ```bash
   npm run dev
   ```

The backend listens on the port defined in environment variables or `3000` by default.

## Frontend

1. Open a new terminal in `Frontend/task-management-ui/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend in development:
   ```bash
   npm run dev
   ```

## API URL configuration

The frontend uses an environment variable for the backend base URL:

- `Frontend/task-management-ui/.env.development`
- `Frontend/task-management-ui/.env.production`

Set `VITE_API_BASE` to the correct API address in those files.

Example:

```env
VITE_API_BASE=http://localhost:3000
```

