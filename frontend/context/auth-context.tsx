"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api"

  const persistSession = (authToken: string, authUser: User) => {
    localStorage.setItem("nexusflow_token", authToken)
    localStorage.setItem("nexusflow_user", JSON.stringify(authUser))
    setToken(authToken)
    setUser(authUser)
  }

  const clearSession = () => {
    localStorage.removeItem("nexusflow_token")
    localStorage.removeItem("nexusflow_user")
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("nexusflow_user")
    const token = localStorage.getItem("nexusflow_token")

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser) as User
      setUser(parsedUser)
      setToken(token)
      void validateToken(token)
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateToken = async (existingToken: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${existingToken}`,
        },
      })

      if (!response.ok) {
        clearSession()
        return
      }

      const result = await response.json()
      const apiUser = result?.data?.user
      if (apiUser) {
        persistSession(existingToken, {
          id: apiUser.id,
          email: apiUser.email,
          name: apiUser.username ?? apiUser.name ?? apiUser.email.split("@")[0],
          role: "admin",
        })
      }
    } catch (error) {
      console.error("Failed to validate token", error)
      clearSession()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      const authData = result?.data
      if (!authData?.token || !authData?.user) {
        return false
      }

      persistSession(authData.token, {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.username ?? authData.user.name ?? authData.user.email,
        role: "admin",
      })

      return true
    } catch (error) {
      console.error("Failed to login", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, email, password }),
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      const authData = result?.data
      if (!authData?.token || !authData?.user) {
        return false
      }

      persistSession(authData.token, {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.username ?? name,
        role: "user",
      })

      return true
    } catch (error) {
      console.error("Failed to register", error)
      return false
    }
  }

  const logout = () => {
    clearSession()
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
