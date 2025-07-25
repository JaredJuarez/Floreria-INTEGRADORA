"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, LogOut, Users, Settings, BarChart3, Flower2, Grid3X3, Package } from "lucide-react"
import type { Screen } from "@/app/page"

interface SuperAdminDashboardProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const stats = [
  {
    title: "Tipos de Producto",
    value: "4",
    change: "+1",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Total Categorías",
    value: "12",
    change: "+3",
    icon: Grid3X3,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Tipos de Flores",
    value: "28",
    change: "+5",
    icon: Flower2,
    color: "text-rose-600",
    bgColor: "bg-rose-100",
  },
  {
    title: "Floristas",
    value: "8",
    change: "+2",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const quickActions = [
  {
    title: "Gestión de Tipos de Producto",
    description: "Administrar tipos base: ramos, centros, coronas, arreglos",
    icon: Package,
    color: "border-blue-200 hover:bg-blue-50",
    action: (onNavigate: any) => onNavigate("product-type-management"),
  },
  {
    title: "Gestión de Categorías",
    description: "Administrar subtipos de arreglos con precios y límites",
    icon: Grid3X3,
    color: "border-green-200 hover:bg-green-50",
    action: (onNavigate: any) => onNavigate("category-management"),
  },
  {
    title: "Gestión de Flores",
    description: "Administrar catálogo de flores y características",
    icon: Flower2,
    color: "border-rose-200 hover:bg-rose-50",
    action: (onNavigate: any) => onNavigate("flower-management"),
  },
  {
    title: "Gestión de Floristas",
    description: "Administrar floristas y sus datos de contacto",
    icon: Users,
    color: "border-purple-200 hover:bg-purple-50",
    action: (onNavigate: any) => onNavigate("florist-management"),
  },
  {
    title: "Reportes Avanzados",
    description: "Análisis detallado de ventas y estadísticas",
    icon: BarChart3,
    color: "border-indigo-200 hover:bg-indigo-50",
    action: () => {},
  },
  {
    title: "Configuración del Sistema",
    description: "Ajustes generales y configuraciones avanzadas",
    icon: Settings,
    color: "border-slate-200 hover:bg-slate-50",
    action: () => {},
  },
]

const recentActivity = [
  {
    action: "Nuevo tipo de producto creado",
    user: "SuperAdmin",
    time: "Hace 1 hora",
    type: "product-type",
  },
  {
    action: "Categoría actualizada",
    user: "SuperAdmin",
    time: "Hace 2 horas",
    type: "category",
  },
  {
    action: "Florista registrado",
    user: "Carmen López",
    time: "Hace 3 horas",
    type: "florist",
  },
  {
    action: "Nueva flor agregada",
    user: "SuperAdmin",
    time: "Hace 4 horas",
    type: "flower",
  },
]

export function SuperAdminDashboard({ onNavigate, onLogout }: SuperAdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Panel SuperAdmin</h1>
                <p className="text-sm text-slate-600">Control total del sistema</p>
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
                  <h2 className="text-3xl font-serif font-bold mb-2">Panel de SuperAdmin</h2>
                  <p className="text-amber-100 text-lg mb-4">
                    Administra todos los catálogos y configuraciones del sistema
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-16 h-16 text-white/80" />
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
                <CardTitle className="text-slate-800">Gestión de Catálogos</CardTitle>
                <CardDescription>Administra todos los componentes del sistema</CardDescription>
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
                <CardDescription>Últimas modificaciones en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "product-type"
                            ? "bg-blue-500"
                            : activity.type === "category"
                              ? "bg-green-500"
                              : activity.type === "florist"
                                ? "bg-purple-500"
                                : "bg-rose-500"
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

            {/* System Status */}
            <Card className="shadow-sm border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Base de Datos</span>
                    <Badge className="bg-green-100 text-green-800">Operativa</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Catálogos</span>
                    <Badge className="bg-green-100 text-green-800">Sincronizados</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Floristas Activos</span>
                    <Badge className="bg-blue-100 text-blue-800">8 en línea</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Pedidos Pendientes</span>
                    <Badge className="bg-yellow-100 text-yellow-800">12 activos</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
