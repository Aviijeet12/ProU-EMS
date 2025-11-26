"use client"

import { type Task, useData } from "@/context/data-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, User, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const statusConfig = {
  pending: { label: "Pending", class: "border-warning/50 bg-warning/10 text-warning" },
  "in-progress": { label: "In Progress", class: "border-info/50 bg-info/10 text-info" },
  completed: { label: "Completed", class: "border-primary/50 bg-primary/10 text-primary" },
}

const priorityConfig = {
  low: { label: "Low", class: "text-muted-foreground" },
  medium: { label: "Medium", class: "text-warning" },
  high: { label: "High", class: "text-destructive" },
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { employees } = useData()
  const assignedEmployee = employees.find((e) => e.id === task.assignedTo)
  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  return (
    <div className="glass-card rounded-2xl p-6 hover:glow-accent transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("rounded-lg", status.class)}>
            {status.label}
          </Badge>
          <span className={cn("text-xs font-medium", priority.class)}>{priority.label} Priority</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass border-border/50">
            <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
              <Edit className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)} className="gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{task.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>

      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{assignedEmployee?.name || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
      </div>
    </div>
  )
}
