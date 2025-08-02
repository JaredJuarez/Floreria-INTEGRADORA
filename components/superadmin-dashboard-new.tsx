"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Users, Flower2, Grid3X3, Package } from "lucide-react"
import type { Screen } from "@/app/page"
import { apiService } from "@/lib/api"

interface SuperAdminDashboardProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

interface Stats {
  categoryTypes: number
  totalCategories: number
  flowerTypes: number
  totalFlowers: number
}

export function SuperAdminDashboard({ onNavigate, onLogout }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    categoryTypes: 0,
    totalCategories: 0,
    flowerTypes: 0,
    totalFlowers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      
      // Cargar estadísticas de categorías
      const [categoriesResponse, categoryTypesResponse, flowersResponse] = await Promise.all([
        apiService.getCategories(),
        apiService.getCategoryTypes(),
        apiService.getAllFlowers()
      ])

      const newStats: Stats = {
        categoryTypes: categoryTypesResponse.data?.length || 0,
        totalCategories: categoriesResponse.data?.length || 0,
        flowerTypes: 0,
        totalFlowers: flowersResponse.data?.length || 0
      }

      // Calcular tipos únicos de flores
      if (flowersResponse.data) {
        const uniqueTypes = new Set(flowersResponse.data.map((flower: any) => flower.type))
        newStats.flowerTypes = uniqueTypes.size
      }

      setStats(newStats)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statsCards = [
    {
      title: "Tipos de Producto",
      value: loading ? "..." : stats.categoryTypes.toString(),
      change: "+0",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Categorías",
      value: loading ? "..." : stats.totalCategories.toString(),
      change: "+0",
      icon: Grid3X3,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tipos de Flores",
      value: loading ? "..." : stats.flowerTypes.toString(),
      change: "+0",
      icon: Flower2,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      title: "Total Flores",
      value: loading ? "..." : stats.totalFlowers.toString(),
      change: "+0",
      icon: Flower2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const quickActions = [
    {
      title: "Gestión de Productos y Categorías",
      description: "Administrar categorías de productos y catálogo de flores",
      icon: Package,
      color: "border-green-200 hover:bg-green-50",
      action: (onNavigate: any) => onNavigate("product-category-management"),
    },
    {
      title: "Gestión de Floristas",
      description: "Administrar floristas y sus datos de contacto",
      icon: Users,
      color: "border-purple-200 hover:bg-purple-50",
      action: (onNavigate: any) => onNavigate("florist-management"),
    },
  ]

  const recentActivity = [
    {
      action: "Sistema actualizado",
      user: "SuperAdmin",
      time: "Hace 1 hora",
      type: "system",
    },
    {
      action: "Nueva categoría agregada",
      user: "SuperAdmin",
      time: "Hace 2 horas",
      type: "category",
    },
    {
      action: "Flores actualizadas",
      user: "SuperAdmin",
      time: "Hace 3 horas",
      type: "flower",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-semibold text-slate-800">Panel de SuperAdmin</h1>
                  <p className="text-sm text-slate-600">Gestión completa del sistema de florería</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Sistema Activo
              </Badge>
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} desde el último mes</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className={`shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${action.color}`}
                onClick={() => action.action(onNavigate)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <action.icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-800">{action.title}</CardTitle>
                      <CardDescription className="text-slate-600">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500">por {activity.user}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Estado del Sistema</CardTitle>
              <CardDescription>Información general del estado actual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Estado del servidor</span>
                  <Badge className="bg-green-100 text-green-800">En línea</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Base de datos</span>
                  <Badge className="bg-green-100 text-green-800">Conectada</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Última actualización</span>
                  <span className="text-sm text-slate-900">Hace 5 minutos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Versión del sistema</span>
                  <span className="text-sm text-slate-900">v2.1.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
