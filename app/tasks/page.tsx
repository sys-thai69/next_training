"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getProjects, updateTaskStatus } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useState } from "react";

export default function TasksPage() {
  const [filter, setFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleToggle = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "done" ? "todo" : "done";
    toggleMutation.mutate({ taskId, newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold">Error loading tasks</h2>
        <p>Make sure json-server is running on port 3001</p>
      </div>
    );
  }

  const filteredTasks =
    filter === "all" ? tasks : tasks?.filter((t) => t.status === filter);

  const getProjectName = (projectId: string) => {
    const project = projects?.find((p) => p.id === projectId);
    return project?.name || "Unknown";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">{tasks?.length} total tasks</p>
        </div>
        <Link href="/tasks/new">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            + New Task
          </button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-md ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("todo")}
          className={`px-3 py-1 rounded-md ${filter === "todo" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          To Do
        </button>
        <button
          onClick={() => setFilter("in-progress")}
          className={`px-3 py-1 rounded-md ${filter === "in-progress" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("done")}
          className={`px-3 py-1 rounded-md ${filter === "done" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          Done
        </button>
      </div>

      <div className="space-y-3">
        {filteredTasks?.map((task) => (
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
                  {getProjectName(task.projectId)}
                </p>
              </Link>
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {task.priority}
              </Badge>
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
      </div>
    </div>
  );
}
