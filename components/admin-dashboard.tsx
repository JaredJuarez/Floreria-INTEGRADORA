"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flower2, LogOut, Users, Package, Settings, BarChart3, Database, ShoppingCart } from "lucide-react"
import type { Screen } from "@/app/page"

interface AdminDashboardProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const stats = [
  {
    title: "Total Usuarios",
    value: "156",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Pedidos del Mes",
    value: "89",
    change: "+23%",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Floristas Activos",
    value: "8",
    change: "+2",
    icon: Flower2,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    title: "Productos",
    value: "45",
    change: "+5",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const quickActions = [
  {
    title: "Gestión de Tipos de Arreglos",
    description: "Crear y editar todos los tipos de arreglos disponibles",
    icon: Flower2,
    color: "border-rose-200 hover:bg-rose-50",
    action: (onNavigate: any) => onNavigate("arrangement-management"),
  },
  {
    title: "Gestión de Flores",
    description: "Administrar catálogo de flores y precios",
    icon: Flower2,
    color: "border-green-200 hover:bg-green-50",
    action: () => {},
  },
  {
    title: "Gestión de Usuarios",
    description: "Administrar clientes y floristas",
    icon: Users,
    color: "border-purple-200 hover:bg-purple-50",
    action: () => {},
  },
  {
    title: "Inventario",
    description: "Control de stock y alertas",
    icon: Package,
    color: "border-orange-200 hover:bg-orange-50",
    action: () => {},
  },
  {
    title: "Reportes",
    description: "Análisis de ventas y estadísticas",
    icon: BarChart3,
    color: "border-indigo-200 hover:bg-indigo-50",
    action: () => {},
  },
  {
    title: "Configuración",
    description: "Ajustes del sistema",
    icon: Settings,
    color: "border-slate-200 hover:bg-slate-50",
    action: () => {},
  },
]

const recentActivity = [
  {
    action: "Nuevo usuario registrado",
    user: "María González",
    time: "Hace 2 horas",
    type: "user",
  },
  {
    action: "Pedido completado",
    user: "Florista Carmen",
    time: "Hace 3 horas",
    type: "order",
  },
  {
    action: "Producto agregado",
    user: "Admin",
    time: "Hace 5 horas",
    type: "product",
  },
  {
    action: "Stock bajo: Rosas rojas",
    user: "Sistema",
    time: "Hace 6 horas",
    type: "alert",
  },
]

export function AdminDashboard({ onNavigate, onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Panel Administrador</h1>
                <p className="text-sm text-slate-600">¡Hola, Admin!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-slate-800">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-amber-500 to-orange-600 border-0 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-serif font-bold mb-2">Panel de Control</h2>
                  <p className="text-amber-100 text-lg mb-4">Administra todos los aspectos de FLOREVER</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Settings className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Acciones Rápidas</CardTitle>
                <CardDescription>Gestiona los componentes principales del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${action.color}`}
                      onClick={() => action.action(onNavigate)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <action.icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-slate-800 mb-1">{action.title}</h3>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Actividad Reciente</CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "user"
                            ? "bg-blue-500"
                            : activity.type === "order"
                              ? "bg-green-500"
                              : activity.type === "product"
                                ? "bg-purple-500"
                                : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                        <p className="text-xs text-slate-600">{activity.user}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Database className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Base de Datos</h3>
                  <Badge className="bg-green-100 text-green-800">Operativa</Badge>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Inventario</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">3 Alertas</Badge>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">Usuarios</h3>
                  <Badge className="bg-green-100 text-green-800">8 Activos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
