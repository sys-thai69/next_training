"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, getTasksByProject, updateTaskStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { use } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProject(slug),
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", "project", slug],
    queryFn: () => getTasksByProject(slug),
  });

  const toggleMutation = useMutation({
    mutationFn: ({
      taskId,
      newStatus,
    }: {
      taskId: string;
      newStatus: "todo" | "in-progress" | "done";
    }) => updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "project", slug] });
    },
  });

  const handleToggle = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    toggleMutation.mutate({ taskId, newStatus });
  };

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold">Error loading project</h2>
        <p>Project not found or server error</p>
        <Link href="/projects" className="underline">
          Back to projects
        </Link>
      </div>
    );
  }

  const todoTasks = tasks?.filter((t) => t.status === "todo") || [];
  const inProgressTasks = tasks?.filter((t) => t.status === "in-progress") || [];
  const doneTasks = tasks?.filter((t) => t.status === "done") || [];

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/projects"
          className="text-muted-foreground hover:underline"
        >
          ← Back to Projects
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className={`w-4 h-4 rounded-full ${project.color}`}></div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
      </div>
      <p className="text-muted-foreground mb-6">{project.description}</p>

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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-3">
            <div
              className={`${project.color} h-3 rounded-full`}
              style={{
                width: `${tasks?.length ? (doneTasks.length / tasks.length) * 100 : 0}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {doneTasks.length} of {tasks?.length || 0} tasks completed
          </p>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <div className="space-y-3">
        {tasks?.map((task) => (
          <Card className="hover:bg-accent cursor-pointer mb-3" key={task.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <Checkbox
                checked={task.status === "done"}
                onCheckedChange={() => handleToggle(task.id, task.status)}
              />
              <Link href={`/tasks/${task.id}`} className="flex-1">
                <p
                  className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </Link>
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
        ))}
        {tasks?.length === 0 && (
          <p className="text-muted-foreground">No tasks in this project yet</p>
        )}
      </div>
    </div>
  );
}
