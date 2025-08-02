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
  totalFlorists: number
  totalOrders: number
  openOrders: number
  processingOrders: number
  closedOrders: number
}

interface SystemStatus {
  serverStatus: 'online' | 'offline'
  databaseStatus: 'connected' | 'disconnected'
  lastUpdate: string
  version: string
  totalActiveConnections: number
}

export function SuperAdminDashboard({ onNavigate, onLogout }: SuperAdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    categoryTypes: 0,
    totalCategories: 0,
    flowerTypes: 0,
    totalFlowers: 0,
    totalFlorists: 0,
    totalOrders: 0,
    openOrders: 0,
    processingOrders: 0,
    closedOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    serverStatus: 'online',
    databaseStatus: 'connected',
    lastUpdate: new Date().toLocaleString('es-ES'),
    version: 'v2.1.0',
    totalActiveConnections: 0
  })

  useEffect(() => {
    loadStats()

    // Actualizar datos cada 5 minutos
    const interval = setInterval(() => {
      loadStats()
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      
      // Cargar todas las estadísticas en paralelo
      const [
        categoriesResponse, 
        categoryTypesResponse, 
        flowersResponse, 
        floristsResponse,
        openOrdersResponse,
        processingOrdersResponse,
        closedOrdersResponse
      ] = await Promise.all([
        apiService.getCategories(),
        apiService.getCategoryTypes(),
        apiService.getAllFlowers(),
        apiService.getFlorists(),
        apiService.getOrdersByStatus('OPEN'),
        apiService.getOrdersByStatus('PROCESSING'),
        apiService.getOrdersByStatus('CLOSED')
      ])

      const newStats: Stats = {
        categoryTypes: categoryTypesResponse.data?.length || 0,
        totalCategories: categoriesResponse.data?.length || 0,
        flowerTypes: 0,
        totalFlowers: flowersResponse.data?.length || 0,
        totalFlorists: floristsResponse.data?.length || 0,
        totalOrders: 0,
        openOrders: openOrdersResponse.data?.length || 0,
        processingOrders: processingOrdersResponse.data?.length || 0,
        closedOrders: closedOrdersResponse.data?.length || 0
      }

      // Calcular tipos únicos de flores
      if (flowersResponse.data) {
        const uniqueTypes = new Set(flowersResponse.data.map((flower: any) => flower.type))
        newStats.flowerTypes = uniqueTypes.size
      }

      // Calcular total de órdenes
      newStats.totalOrders = newStats.openOrders + newStats.processingOrders + newStats.closedOrders

      setStats(newStats)
      
      // Actualizar estado del sistema con datos reales
      setSystemStatus(prev => ({
        ...prev,
        lastUpdate: new Date().toLocaleString('es-ES'),
        totalActiveConnections: newStats.totalFlorists + newStats.openOrders
      }))
      
    } catch (error) {
      console.error('Error loading stats:', error)
      // En caso de error, marcar sistema como offline
      setSystemStatus(prev => ({
        ...prev,
        serverStatus: 'offline',
        databaseStatus: 'disconnected'
      }))
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
      title: "Total Flores",
      value: loading ? "..." : stats.totalFlowers.toString(),
      change: "+0",
      icon: Flower2,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      title: "Floristas Activos",
      value: loading ? "..." : stats.totalFlorists.toString(),
      change: "+0",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Órdenes",
      value: loading ? "..." : stats.totalOrders.toString(),
      change: `+${stats.openOrders}`,
      icon: Package,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      title: "Órdenes Abiertas",
      value: loading ? "..." : stats.openOrders.toString(),
      change: "Pendientes",
      icon: Package,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
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

        {/* System Status - Enhanced Design */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Estado del Sistema</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Server and Database Status */}
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${systemStatus.serverStatus === 'online' && systemStatus.databaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  Conectividad
                </CardTitle>
                <CardDescription>Estado de conexiones del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${systemStatus.serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-slate-700">Estado del servidor</span>
                    </div>
                    <Badge className={systemStatus.serverStatus === 'online' ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                      {systemStatus.serverStatus === 'online' ? 'En línea' : 'Desconectado'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${systemStatus.databaseStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-slate-700">Base de datos</span>
                    </div>
                    <Badge className={systemStatus.databaseStatus === 'connected' ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                      {systemStatus.databaseStatus === 'connected' ? 'Conectada' : 'Desconectada'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Information */}
            <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                  Información del Sistema
                </CardTitle>
                <CardDescription>Detalles y métricas actuales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium mb-1">VERSIÓN</p>
                      <p className="text-lg font-bold text-blue-900">{systemStatus.version}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-purple-600 font-medium mb-1">TOTAL DE PEDIDOS</p>
                      <p className="text-lg font-bold text-purple-900">{systemStatus.totalActiveConnections}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-slate-600 font-medium mb-1">ACTUALIZACIÓN</p>
                      <p className="text-sm font-medium text-slate-900">{systemStatus.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
