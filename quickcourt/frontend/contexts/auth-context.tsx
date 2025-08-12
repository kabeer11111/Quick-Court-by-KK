"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

export type UserRole = "user" | "owner" | "admin"  // FIXED: Changed from "facility_owner" to "owner"

export interface User {
  _id: string
  email: string
  fullName: string
  avatar?: string
  role: UserRole
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  verifyOTP: (otp: string, email?: string) => Promise<void>
  logout: () => void
  // uploadAvatar: (file: File) => Promise<any>  // Added missing uploadAvatar
  isLoading: boolean
  pendingVerification: boolean
}

interface SignupData {
  email: string
  password: string
  fullName: string
  avatar?: string
  role: UserRole
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios to point to your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
axios.defaults.baseURL = API_BASE_URL

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem("quickcourt_token")
      localStorage.removeItem("quickcourt_user")
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)

  // Set token in axios header if available
  useEffect(() => {
    const token = localStorage.getItem("quickcourt_token")
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  // In your auth-context.tsx - Alternative fix for frontend
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Attempting login for:', email)
      
      const response = await axios.post('/auth/login', { email, password })
      
      console.log('Login response:', response.data)
      
      // FIXED: Handle backend response without 'success' field
      if (response.data.token && response.data.user) {
        const token = response.data.token
        const userData = {
          ...response.data.user,
          _id: response.data.user._id || response.data.user.id // Handle both id formats
        }
        
        localStorage.setItem("quickcourt_token", token)
        localStorage.setItem("quickcourt_user", JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
      } else {
        throw new Error('Invalid response format')
      }
      
    } catch (error: any) {
      console.error('Login error:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  const signup = async (data: SignupData) => {
    setIsLoading(true)
    try {
      console.log('Attempting signup for:', data.email)
      
      // FIXED: Changed from '/auth/register' to '/auth/signup'
      const response = await axios.post('/auth/signup', {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role
      })

      console.log('Signup response:', response.data)

      if (response.data.success) {
        localStorage.setItem("quickcourt_pending_email", data.email)
        setPendingVerification(true)
      }
      
      return response.data
    } catch (error: any) {
      console.error('Signup error:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Registration failed'
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (otp: string, email?: string) => {
    setIsLoading(true)
    try {
      const verificationEmail = email || localStorage.getItem("quickcourt_pending_email")
      
      if (!verificationEmail) {
        throw new Error("No email found for verification")
      }

      console.log('Verifying OTP for:', verificationEmail, 'OTP:', otp)

      const response = await axios.post('/auth/verify-otp', {
        email: verificationEmail,
        otp
      })

      console.log('OTP verification response:', response.data)

      if (response.data.success) {
        const token = response.data.token
        const userData = response.data.user
        
        localStorage.setItem("quickcourt_token", token)
        localStorage.setItem("quickcourt_user", JSON.stringify(userData))
        localStorage.removeItem("quickcourt_pending_email")
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        setUser(userData)
        setPendingVerification(false)
      } else {
        throw new Error(response.data.message || 'OTP verification failed')
      }
      
    } catch (error: any) {
      console.error('OTP verification error:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'OTP verification failed'
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Added missing uploadAvatar function
  // const uploadAvatar = async (file: File) => {
  //   setIsLoading(true)
  //   try {
  //     const formData = new FormData()
  //     formData.append('avatar', file)

  //     const response = await axios.post('/users/avatar', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${localStorage.getItem('quickcourt_token')}`
  //       }
  //     })

  //     if (response.data.success && user) {
  //       const updatedUser: User = {
  //         ...user,
  //         avatar: response.data.avatar
  //       }
  //       setUser(updatedUser)
  //       localStorage.setItem("quickcourt_user", JSON.stringify(updatedUser))
  //     }

  //     return response.data
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Avatar upload failed')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("quickcourt_token")
    localStorage.removeItem("quickcourt_user")
    localStorage.removeItem("quickcourt_pending_email")
    delete axios.defaults.headers.common['Authorization']
    setPendingVerification(false)
  }

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("quickcourt_user")
    const savedToken = localStorage.getItem("quickcourt_token")
    const pendingEmail = localStorage.getItem("quickcourt_pending_email")

    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        logout()
      }
    } else if (pendingEmail) {
      setPendingVerification(true)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        verifyOTP,
        logout,
        // uploadAvatar,  // Added to provider
        isLoading,
        pendingVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
