"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  status: "active" | "inactive"
  joinDate: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  assignedTo: string
  dueDate: string
  createdAt: string
}

interface DataContextType {
  employees: Employee[]
  tasks: Task[]
  isLoading: boolean
  refreshData: () => Promise<void>
  addEmployee: (employee: Omit<Employee, "id">) => Promise<void>
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>
  updateTask: (id: string, task: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextType | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const apiBaseUrl = useMemo(() => process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api", [])

  const mapEmployeeFromApi = useCallback((employee: any): Employee => {
    const join = employee.dateCreated ?? employee.createdAt ?? new Date().toISOString()
    return {
      id: employee.id ?? employee._id,
      name: employee.name,
      email: employee.email,
      department: employee.department ?? "General",
      position: employee.role ?? "Unknown",
      status: employee.status?.toLowerCase() === "active" ? "active" : "inactive",
      joinDate: new Date(join).toISOString().split("T")[0],
    }
  }, [])

  const mapEmployeeToApi = (employee: Partial<Employee>) => {
    const payload: Record<string, unknown> = {}
    if (employee.name !== undefined) payload.name = employee.name
    if (employee.email !== undefined) payload.email = employee.email
    if (employee.department !== undefined) payload.department = employee.department
    if (employee.position !== undefined) payload.role = employee.position
    if (employee.status !== undefined) payload.status = employee.status === "active" ? "Active" : "Inactive"
    return payload
  }

  const mapTaskFromApi = useCallback((task: any): Task => {
    const status =
      task.status?.toLowerCase() === "in-progress" ? "in-progress" : task.status?.toLowerCase() ?? "pending"
    const priority = task.priority?.toLowerCase() ?? "medium"
    const assigned = task.assignedEmployeeId
    const assignedId = typeof assigned === "string" ? assigned : assigned?.id ?? assigned?._id ?? ""
    const created = task.createdAt ?? task.dateCreated ?? new Date().toISOString()
    return {
      id: task.id ?? task._id,
      title: task.title,
      description: task.description ?? "",
      status: status as Task["status"],
      priority: priority as Task["priority"],
      assignedTo: assignedId,
      dueDate: (task.dueDate ?? new Date().toISOString()).split("T")[0],
      createdAt: new Date(created).toISOString(),
    }
  }, [])

  const formatTaskStatusForApi = (status?: Task["status"]) => {
    switch (status) {
      case "in-progress":
        return "In-progress"
      case "completed":
        return "Completed"
      case "pending":
      default:
        return "Pending"
    }
  }

  const formatTaskPriorityForApi = (priority?: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "High"
      case "low":
        return "Low"
      case "medium":
      default:
        return "Medium"
    }
  }

  const mapTaskToApi = (task: Partial<Task>) => {
    const payload: Record<string, unknown> = {}
    if (task.title !== undefined) payload.title = task.title
    if (task.description !== undefined) payload.description = task.description
    if (task.dueDate !== undefined) payload.dueDate = task.dueDate
    if (task.status !== undefined) payload.status = formatTaskStatusForApi(task.status)
    if (task.priority !== undefined) payload.priority = formatTaskPriorityForApi(task.priority)
    if (task.assignedTo !== undefined) payload.assignedEmployeeId = task.assignedTo
    return payload
  }

  const authenticatedRequest = useCallback(
    async (path: string, options?: RequestInit) => {
      if (!token) {
        throw new Error("User is not authenticated")
      }

      const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options?.headers ?? {}),
        },
      })

      if (response.status === 204) {
        return null
      }

      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const errorMessage = payload?.message ?? "Request failed"
        throw new Error(errorMessage)
      }
      return payload
    },
    [apiBaseUrl, token],
  )

  const fetchData = useCallback(async () => {
    if (!token) {
      setEmployees([])
      setTasks([])
      return
    }
    setIsLoading(true)
    try {
      const [employeeRes, taskRes] = await Promise.all([
        authenticatedRequest("/employees"),
        authenticatedRequest("/tasks"),
      ])
      setEmployees(employeeRes?.data?.map(mapEmployeeFromApi) ?? [])
      setTasks(taskRes?.data?.map(mapTaskFromApi) ?? [])
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setIsLoading(false)
    }
  }, [authenticatedRequest, mapEmployeeFromApi, mapTaskFromApi, token])

  useEffect(() => {
    void fetchData()
  }, [fetchData])

  const addEmployee = async (employee: Omit<Employee, "id">) => {
    const payload = mapEmployeeToApi(employee)
    const response = await authenticatedRequest("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const created = mapEmployeeFromApi(response.data)
    setEmployees((prev) => [...prev, created])
  }

  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    const payload = mapEmployeeToApi(employee)
    const response = await authenticatedRequest(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
    const updated = mapEmployeeFromApi(response.data)
    setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  const deleteEmployee = async (id: string) => {
    await authenticatedRequest(`/employees/${id}`, { method: "DELETE" })
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    setTasks((prev) => prev.map((task) => (task.assignedTo === id ? { ...task, assignedTo: "" } : task)))
  }

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    const payload = mapTaskToApi(task)
    const response = await authenticatedRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    const created = mapTaskFromApi(response.data)
    setTasks((prev) => [...prev, created])
  }

  const updateTask = async (id: string, task: Partial<Task>) => {
    const payload = mapTaskToApi(task)
    const response = await authenticatedRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
    const updated = mapTaskFromApi(response.data)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const deleteTask = async (id: string) => {
    await authenticatedRequest(`/tasks/${id}`, { method: "DELETE" })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <DataContext.Provider
      value={{ employees, tasks, isLoading, refreshData: fetchData, addEmployee, updateEmployee, deleteEmployee, addTask, updateTask, deleteTask }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
