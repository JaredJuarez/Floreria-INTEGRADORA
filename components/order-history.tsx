"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Calendar, Filter } from "lucide-react"
import type { Screen } from "@/app/page"

interface OrderHistoryProps {
  onNavigate: (screen: Screen) => void
}

const orderHistory = [
  {
    id: "ORD-001",
    type: "Ramo de Rosas",
    status: "Completado",
    date: "2024-01-15",
    deliveryDate: "2024-01-17",
    total: "$45.00",
    statusColor: "bg-green-100 text-green-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-002",
    type: "Centro de Mesa",
    status: "En proceso",
    date: "2024-01-10",
    deliveryDate: "2024-01-18",
    total: "$75.00",
    statusColor: "bg-yellow-100 text-yellow-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-003",
    type: "Arreglo Personalizado",
    status: "Entregado",
    date: "2024-01-08",
    deliveryDate: "2024-01-12",
    total: "$120.00",
    statusColor: "bg-blue-100 text-blue-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-004",
    type: "Ramo de Novia",
    status: "Completado",
    date: "2024-01-05",
    deliveryDate: "2024-01-07",
    total: "$200.00",
    statusColor: "bg-green-100 text-green-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-005",
    type: "Corona Funeral",
    status: "Completado",
    date: "2024-01-02",
    deliveryDate: "2024-01-03",
    total: "$85.00",
    statusColor: "bg-green-100 text-green-800",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function OrderHistory({ onNavigate }: OrderHistoryProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("client-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Historial de Pedidos</h1>
                <p className="text-sm text-slate-600">Todos tus arreglos florales</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card className="shadow-sm border-slate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por ID, tipo de arreglo..."
                  className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-200 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" className="border-slate-200 bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Fecha
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {orderHistory.map((order) => (
            <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Order Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={order.image || "/placeholder.svg"}
                      alt={order.type}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                    />
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{order.type}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                          <span>ID: {order.id}</span>
                          <span>Pedido: {order.date}</span>
                          <span>Entrega: {order.deliveryDate}</span>
                        </div>
                        <Badge className={order.statusColor}>{order.status}</Badge>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <div className="text-2xl font-bold text-slate-800 mb-2">{order.total}</div>
                        <div className="flex flex-col md:flex-row gap-2">
                          <Button variant="outline" size="sm" className="border-slate-200 bg-transparent">
                            Ver detalles
                          </Button>
                          {order.status === "Completado" && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => onNavigate("arrangement-builder")}
                            >
                              Reordenar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Progress */}
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.status === "Completado" || order.status === "Entregado" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Pedido confirmado</span>
                      <div className="w-4 h-px bg-slate-200"></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.status === "En proceso" || order.status === "Completado" || order.status === "Entregado"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span>En preparación</span>
                      <div className="w-4 h-px bg-slate-200"></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.status === "Completado" || order.status === "Entregado" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Listo para entrega</span>
                      <div className="w-4 h-px bg-slate-200"></div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          order.status === "Entregado" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <span>Entregado</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
            Cargar más pedidos
          </Button>
        </div>
      </div>
    </div>
  )
}
