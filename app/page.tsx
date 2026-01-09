"use client";

import { useQuery } from "@tanstack/react-query";
import { getTasks, getProjects } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function Home() {
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (tasksError || projectsError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold">Error loading data</h2>
        <p>Make sure json-server is running on port 3001</p>
        <p className="text-sm mt-2">Run: npm run server</p>
      </div>
    );
  }

  const todoTasks = tasks?.filter((t) => t.status === "todo") || [];
  const inProgressTasks = tasks?.filter((t) => t.status === "in-progress") || [];
  const doneTasks = tasks?.filter((t) => t.status === "done") || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-6">Welcome to TaskFlow!</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todoTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
      <div className="space-y-2 mb-8">
        {tasks?.slice(0, 5).map((task) => (
          <Link href={`/tasks/${task.id}`} key={task.id}>
            <Card className="hover:bg-accent cursor-pointer">
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {task.description.substring(0, 50)}...
                  </p>
                </div>
                <Badge
                  variant={
                    task.status === "done"
                      ? "default"
                      : task.status === "in-progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {task.status}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects?.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:bg-accent cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {project.description.substring(0, 60)}...
                </p>
                <p className="text-sm">
                  {project.tasksCompleted}/{project.tasksTotal} tasks completed
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
