"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/auth-context";

export interface Employee {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  owner: string;
  department?: string;
  status?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority?: string;
  assignee?: string | { _id: string; name?: string; email?: string; position?: string; status?: string; owner?: string; phone?: string; };
  dueDate?: string;
  createdAt: string;
  owner: string | { _id: string; name?: string; email?: string; role?: string; };
}

interface DataContextType {
  employees: Employee[];
  tasks: Task[];
  reload: () => Promise<void>;

  addEmployee: (data: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<boolean>;

  addTask: (data: Partial<Task>) => Promise<boolean>;
  updateTask: (id: string, data: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;

  getEmployeeTasks: (employeeId: string) => Task[];
  getEmployeeById: (id: string) => Employee | undefined;
}

const DataContext = createContext<DataContextType | null>(null);

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("proums_token")
      : null;

  // Load Employees
  const loadEmployees = async () => {
    if (!token) return;

    const res = await fetch(`${API}/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      setEmployees(data.data);
      console.log('DEBUG DataProvider: loaded employees', data.data);
    }
  };

  // Load Tasks
  const loadTasks = async () => {
    if (!token) return;

    const res = await fetch(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) {
      setTasks(data.data);
      console.log('DEBUG DataProvider: loaded tasks', data.data);
    }
  };

  // Combined Loader
  const reload = async () => {
    await loadEmployees();
    await loadTasks();
    console.log('DEBUG DataProvider: reload complete', { employees, tasks, user });
  };

  // Inject dummy tasks for demo if none exist
  useEffect(() => {
    if (user) reload();
  }, [user]);


  // CRUD Employee
  const addEmployee = async (data: Partial<Employee>) => {
    const res = await fetch(`${API}/employees`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) await reload();
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    const res = await fetch(`${API}/employees/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) await reload();
  };

  const deleteEmployee = async (id: string) => {
    const res = await fetch(`${API}/employees/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    if (result.success) {
      await reload();
      return true;
    }
    return false;
  };

  // CRUD Task
  const addTask = async (data: Partial<Task>) => {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      await reload();
      return true;
    }
    return false;
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      await reload();
      return true;
    }
    return false;
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    if (result.success) {
      await reload();
      return true;
    }
    return false;
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        tasks,
        reload,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addTask,
        updateTask,
        deleteTask,
        getEmployeeTasks: (employeeId) =>
          tasks.filter((t) => {
            if (!employeeId) return false;
            if (typeof t.assignee === "object" && t.assignee !== null && typeof (t.assignee as any)._id === "string") {
              return (t.assignee as any)._id === employeeId;
            }
            return t.assignee === employeeId;
          }),
        getEmployeeById: (id) =>
          employees.find((e) => e._id === id),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
}
