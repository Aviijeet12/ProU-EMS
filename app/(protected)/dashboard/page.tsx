"use client"

import { useData } from "@/context/data-context"
import { useAuth } from "@/context/auth-context"
import { StatsCard } from "@/components/stats-card"
import { TaskCard } from "@/components/task-card"
import { Users, CheckSquare, Clock, TrendingUp } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useState } from "react"
import { TaskFormModal } from "@/components/task-form-modal"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import type { Task } from "@/context/data-context"
import { toast } from "sonner"

const activityData = [
  { name: "Mon", tasks: 12, completed: 8 },
  { name: "Tue", tasks: 19, completed: 14 },
  { name: "Wed", tasks: 15, completed: 12 },
  { name: "Thu", tasks: 22, completed: 18 },
  { name: "Fri", tasks: 18, completed: 15 },
  { name: "Sat", tasks: 8, completed: 6 },
  { name: "Sun", tasks: 5, completed: 4 },
]

export default function DashboardPage() {
  const { employees, tasks, deleteTask } = useData()
  const { user } = useAuth()
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const activeEmployees = employees.filter((e) => e.status === "active").length
  const pendingTasks = tasks.filter((t) => t.status === "pending").length
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress").length
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const pieData = [
    { name: "Pending", value: pendingTasks, color: "#eab308" },
    { name: "In Progress", value: inProgressTasks, color: "#22d3ee" },
    { name: "Completed", value: completedTasks, color: "#34d399" },
  ]

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleDeleteTask = (task: Task) => {
    setDeletingTask(task)
  }

  const confirmDeleteTask = () => {
    if (!deletingTask) return

    deleteTask(deletingTask.id)
      .then(() => {
        toast.success("Task deleted successfully")
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Failed to delete task"
        toast.error(message)
      })
      .finally(() => setDeletingTask(null))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-primary">{user?.name || "User"}</span>
        </h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your team today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={employees.length}
          change={`${activeEmployees} active`}
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Total Tasks"
          value={tasks.length}
          change={`${pendingTasks} pending`}
          changeType="neutral"
          icon={CheckSquare}
          iconColor="text-accent"
        />
        <StatsCard
          title="In Progress"
          value={inProgressTasks}
          change="Active tasks"
          changeType="neutral"
          icon={Clock}
          iconColor="text-info"
        />
        <StatsCard
          title="Completed"
          value={completedTasks}
          change={`${completionRate}% completion rate`}
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(22, 22, 30, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  stroke="#22d3ee"
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#34d399"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(22, 22, 30, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Tasks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEditTask} onDelete={handleDeleteTask} />
          ))}
        </div>
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  )
}
