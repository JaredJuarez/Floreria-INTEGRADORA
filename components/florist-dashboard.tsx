"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flower2, LogOut, Package, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import type { Screen } from "@/app/page"

interface FloristDashboardProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const pendingOrders = [
  {
    id: "ORD-001",
    customer: "María González",
    type: "Ramo de Rosas",
    date: "2024-01-15",
    total: "$45.00",
    status: "Nuevo",
    priority: "normal",
  },
  {
    id: "ORD-004",
    customer: "Carlos Ruiz",
    type: "Centro de Mesa",
    date: "2024-01-16",
    total: "$75.00",
    status: "Nuevo",
    priority: "urgent",
  },
  {
    id: "ORD-005",
    customer: "Ana López",
    type: "Arreglo Personalizado",
    date: "2024-01-16",
    total: "$120.00",
    status: "En proceso",
    priority: "normal",
  },
]

const stats = [
  {
    title: "Pedidos Pendientes",
    value: "8",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    title: "En Proceso",
    value: "3",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Completados Hoy",
    value: "12",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Urgentes",
    value: "2",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
]

export function FloristDashboard({ onNavigate, onLogout }: FloristDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Panel Florista</h1>
                <p className="text-sm text-slate-600">¡Hola, Carmen!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("florist-orders")}
                className="text-slate-600 hover:text-slate-800"
              >
                <Package className="w-4 h-4 mr-2" />
                Gestionar Pedidos
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Button>
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
          <Card className="bg-gradient-to-r from-rose-500 to-pink-600 border-0 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-serif font-bold mb-2">¡Buenos días, Carmen!</h2>
                  <p className="text-rose-100 text-lg mb-4">Tienes 8 pedidos pendientes por revisar</p>
                  <Button
                    onClick={() => onNavigate("florist-orders")}
                    size="lg"
                    className="bg-white text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <Package className="w-5 h-5 mr-2" />
                    Ver Pedidos
                  </Button>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Flower2 className="w-16 h-16 text-white/80" />
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
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Clock className="w-5 h-5 mr-2 text-rose-600" />
                  Pedidos Recientes
                </CardTitle>
                <CardDescription>Pedidos que requieren tu atención</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-slate-800">{order.type}</h3>
                          <Badge
                            className={
                              order.status === "Nuevo" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {order.status}
                          </Badge>
                          {order.priority === "urgent" && <Badge className="bg-red-100 text-red-800">Urgente</Badge>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-800">{order.total}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          <p>Cliente: {order.customer}</p>
                          <p>
                            ID: {order.id} • {order.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="text-slate-600 bg-transparent">
                            Ver detalles
                          </Button>
                          {order.status === "Nuevo" && (
                            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
                              Aceptar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate("florist-orders")}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    Ver todos los pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="shadow-sm border-slate-200 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-rose-200 hover:bg-rose-50 bg-transparent"
                  onClick={() => onNavigate("florist-orders")}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Gestionar Pedidos
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-green-200 hover:bg-green-50 bg-transparent"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Completado
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Agenda de Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Entrega Centro Mesa</p>
                      <p className="text-xs text-slate-600">10:00 AM - Hotel Plaza</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Ramo de Novia</p>
                      <p className="text-xs text-slate-600">2:00 PM - Iglesia San José</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">Arreglo Cumpleaños</p>
                      <p className="text-xs text-slate-600">4:30 PM - Domicilio</p>
                    </div>
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
