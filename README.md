# TaskFlow - Task Manager Application

A simple task management app built with Next.js, React Query (GET only), and JSON Server. Styled with shadcn/ui.

## Team Members

- Pheav Chhengthai
- Nhoung Norakchivorn

## Tech Stack

- Next.js 14+ (App Router)
- React Query / TanStack Query (GET only)
- shadcn/ui components
- JSON Server
- TypeScript
- Prettier + ESLint

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start JSON Server

```bash
npm run server
```

This will start the API at http://localhost:3001

### 3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Pages

- `app/page.tsx` — Dashboard with overview stats
- `app/tasks/page.tsx` — List of all tasks with filtering
- `app/tasks/[id]/page.tsx` — Task detail page
- `app/tasks/new/page.tsx` — Create new task form (UI only)
- `app/projects/page.tsx` — List of all projects
- `app/projects/[id]/page.tsx` — Project detail with tasks

## API Endpoints

- `GET /projects` — All projects
- `GET /projects/:id` — Single project
- `GET /tasks` — All tasks
- `GET /tasks/:id` — Single task
- `GET /tasks?projectId=:id` — Tasks by project

## Features

- Data fetching with React Query (GET only)
- shadcn/ui components for styling
- Loading states (Spinner/Skeleton)
- Error handling UI
- Code formatted with Prettier
- No ESLint errors
