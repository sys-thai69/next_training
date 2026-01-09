# TaskFlow - Task Manager Application

A simple task management app built with Next.js, React Query, and JSON Server.

## Team Members

- Pheav Chhengthai
- Nhuong Norakchivorn

## Tech Stack

- Next.js 14+ (App Router)
- React Query (TanStack Query)
- shadcn/ui components
- JSON Server
- TypeScript

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start JSON Server

```bash
pnpm run server
```

This will start the API at http://localhost:3001

### 3. Start the development server

```bash
pnpm run dev
```

Open http://localhost:3000 to view the app.

## Pages

- `/` - Dashboard with overview stats
- `/tasks` - List of all tasks with filtering
- `/tasks/[id]` - Task detail page
- `/tasks/new` - Create new task form (UI only)
- `/projects` - List of all projects
- `/projects/[id]` - Project detail with tasks

## API Endpoints

- GET /projects - all projects
- GET /projects/:id - single project
- GET /tasks - all tasks
- GET /tasks/:id - single task
- GET /tasks?projectId=:id - tasks by project
