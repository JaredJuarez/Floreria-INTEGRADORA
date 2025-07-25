"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { FloristDashboard } from "@/components/florist-dashboard"
import { SuperAdminDashboard } from "@/components/superadmin-dashboard"
import { ArrangementBuilder } from "@/components/arrangement-builder"
import { OrderConfirmation } from "@/components/order-confirmation"
import { FloristOrders } from "@/components/florist-orders"
import { CategoryManagement } from "@/components/category-management"
import { ProductTypeManagement } from "@/components/product-type-management"
import { FlowerManagement } from "@/components/flower-management"
import { FloristManagement } from "@/components/florist-management"
import { ClientProfile } from "@/components/client-profile"
import { FloristProfile } from "@/components/florist-profile"
import { OrderDetails } from "@/components/order-details"

export type UserType = "client" | "florist" | "superadmin" | null
export type Screen =
  | "login"
  | "florist-dashboard"
  | "superadmin-dashboard"
  | "arrangement-builder"
  | "order-confirmation"
  | "florist-orders"
  | "category-management"
  | "product-type-management"
  | "flower-management"
  | "florist-management"
  | "client-profile"
  | "florist-profile"
  | "order-details"

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserType>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [currentOrder, setCurrentOrder] = useState<any>(null)

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
    setCurrentUser(null)
    setCurrentScreen("login")
    setCurrentOrder(null)
  }

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
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
      default:
        return <LoginScreen onLogin={handleLogin} />
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">{renderScreen()}</div>
}
