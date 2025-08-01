"use client"

import { useState, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { FloristDashboard } from "@/components/florist-dashboard"
import { SuperAdminDashboard } from "@/components/superadmin-dashboard"
import { ArrangementBuilder } from "@/components/arrangement-builder"
import { OrderConfirmation } from "@/components/order-confirmation"
import { CategoryManagement } from "@/components/category-management"
import { ProductTypeManagement } from "@/components/product-type-management"
import { FlowerManagement } from "@/components/flower-management"
import { FloristManagement } from "@/components/florist-management"
import { ClientProfile } from "@/components/client-profile"
import { FloristProfile } from "@/components/florist-profile"
import { OrderDetails } from "@/components/order-details"
import { OrderHistory } from "@/components/order-history"
import { authUtils } from "@/lib/auth"

export type UserType = "client" | "florist" | "superadmin" | null
export type Screen =
  | "login"
  | "florist-dashboard"
  | "superadmin-dashboard"
  | "arrangement-builder"
  | "order-confirmation"
  | "category-management"
  | "product-type-management"
  | "flower-management"
  | "florist-management"
  | "client-profile"
  | "florist-profile"
  | "order-details"
  | "order-history"

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si existe una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        if (authUtils.hasValidSession()) {
          const { role } = authUtils.getAuthData()
          const userType = authUtils.mapRoleToUserType(role!)
          
          if (userType) {
            setCurrentUser(userType)
            // Establecer la pantalla inicial según el tipo de usuario
            switch (userType) {
              case "client":
                setCurrentScreen("arrangement-builder")
                break
              case "florist":
                setCurrentScreen("florist-dashboard")
                break
              case "superadmin":
                setCurrentScreen("superadmin-dashboard")
                break
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        // Si hay error, limpiar localStorage y mostrar login
        authUtils.clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleLogin = (userType: UserType) => {
    setCurrentUser(userType)
    switch (userType) {
      case "client":
        setCurrentScreen("arrangement-builder")
        break
      case "florist":
        setCurrentScreen("florist-dashboard")
        break
      case "superadmin":
        setCurrentScreen("superadmin-dashboard")
        break
    }
  }

  const handleLogout = () => {
    // Limpiar localStorage al cerrar sesión
    authUtils.clearAuthData()
    
    setCurrentUser(null)
    setCurrentScreen("login")
    setCurrentOrder(null)
  }

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    // Mostrar loading mientras verificamos el estado de autenticación
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
              </svg>
            </div>
            <p className="text-slate-600">Verificando sesión...</p>
          </div>
        </div>
      )
    }

    switch (currentScreen) {
      case "login":
        return <LoginScreen onLogin={handleLogin} />
      case "florist-dashboard":
        return <FloristDashboard onNavigate={navigateTo} onLogout={handleLogout} />
      case "superadmin-dashboard":
        return <SuperAdminDashboard onNavigate={navigateTo} onLogout={handleLogout} />
      case "arrangement-builder":
        return (
          <ArrangementBuilder
            onNavigate={navigateTo}
            onOrderCreate={setCurrentOrder}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )
      case "order-confirmation":
        return <OrderConfirmation order={currentOrder} onNavigate={navigateTo} />
      case "florist-orders":
        return <FloristOrders onNavigate={navigateTo} onOrderSelect={setCurrentOrder} />
      case "category-management":
        return <CategoryManagement onNavigate={navigateTo} />
      case "product-type-management":
        return <ProductTypeManagement onNavigate={navigateTo} />
      case "flower-management":
        return <FlowerManagement onNavigate={navigateTo} />
      case "florist-management":
        return <FloristManagement onNavigate={navigateTo} />
      case "client-profile":
        return <ClientProfile onNavigate={navigateTo} onOrderSelect={setCurrentOrder} />
      case "florist-profile":
        return <FloristProfile onNavigate={navigateTo} />
      case "order-details":
        return <OrderDetails order={currentOrder} onNavigate={navigateTo} />
      case "order-history":
        return <OrderHistory onNavigate={navigateTo} />
      default:
        return <LoginScreen onLogin={handleLogin} />
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">{renderScreen()}</div>
}
