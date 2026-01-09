"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTask, getProject, updateSubtask } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { use } from "react";

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const {
    data: task,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
  });

  const { data: project } = useQuery({
    queryKey: ["project", task?.projectId],
    queryFn: () => getProject(task!.projectId),
    enabled: !!task?.projectId,
  });

  const subtaskMutation = useMutation({
    mutationFn: (subtasks: { id: string; title: string; completed: boolean }[]) =>
      updateSubtask(id, subtasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
    },
  });

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    subtaskMutation.mutate(updatedSubtasks);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Loading task...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="font-bold">Error loading task</h2>
        <p>Task not found or server error</p>
        <Link href="/tasks" className="underline">
          Back to tasks
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/tasks" className="text-muted-foreground hover:underline">
          ← Back to Tasks
        </Link>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <div className="flex gap-2 mt-2">
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
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive"
                  : task.priority === "medium"
                    ? "default"
                    : "secondary"
              }
            >
              {task.priority} priority
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Subtasks ({task.subtasks.filter((s) => s.completed).length}/
                {task.subtasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                    />
                    <span
                      className={
                        subtask.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments ({task.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {task.comments.length === 0 ? (
                <p className="text-muted-foreground">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="border-b pb-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{comment.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Project</p>
                <p className="font-medium">{project?.name || "Loading..."}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="font-medium">
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex gap-1 flex-wrap mt-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
