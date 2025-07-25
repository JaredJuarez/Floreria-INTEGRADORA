"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, Clock, CheckCircle, AlertTriangle, Eye } from "lucide-react"
import type { Screen } from "@/app/page"

interface FloristOrdersProps {
  onNavigate: (screen: Screen) => void
  onOrderSelect: (order: any) => void
}

const orders = {
  new: [
    {
      id: "ORD-001",
      customer: "María González",
      type: "Ramo de Rosas",
      date: "2024-01-15",
      total: "$45.00",
      priority: "normal",
      details: "12 rosas rojas, papel kraft, lazo dorado",
    },
    {
      id: "ORD-004",
      customer: "Carlos Ruiz",
      type: "Centro de Mesa",
      date: "2024-01-16",
      total: "$75.00",
      priority: "urgent",
      details: "Rosas blancas, eucalipto, base de cristal",
    },
  ],
  inProgress: [
    {
      id: "ORD-005",
      customer: "Ana López",
      type: "Arreglo Personalizado",
      date: "2024-01-16",
      total: "$120.00",
      priority: "normal",
      details: "Orquídeas, lirios, diseño moderno",
      startedAt: "2024-01-16 09:00",
    },
    {
      id: "ORD-006",
      customer: "Luis Martín",
      type: "Ramo de Novia",
      date: "2024-01-14",
      total: "$200.00",
      priority: "urgent",
      details: "Peonías blancas, rosas, baby's breath",
      startedAt: "2024-01-14 14:30",
    },
  ],
  completed: [
    {
      id: "ORD-002",
      customer: "Elena Vega",
      type: "Corona Funeral",
      date: "2024-01-12",
      total: "$85.00",
      priority: "normal",
      details: "Crisantemos blancos, cinta negra",
      completedAt: "2024-01-13 16:00",
    },
    {
      id: "ORD-003",
      customer: "Roberto Silva",
      type: "Arreglo Cumpleaños",
      date: "2024-01-10",
      total: "$65.00",
      priority: "normal",
      details: "Girasoles, gerberas, colores vibrantes",
      completedAt: "2024-01-11 11:30",
    },
  ],
}

export function FloristOrders({ onNavigate, onOrderSelect }: FloristOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const handleAcceptOrder = (orderId: string) => {
    alert(`Pedido ${orderId} aceptado y movido a "En Proceso"`)
  }

  const handleCompleteOrder = (orderId: string) => {
    alert(`Pedido ${orderId} marcado como completado`)
  }

  const handleViewDetails = (order: any) => {
    onOrderSelect(order)
    onNavigate("order-details")
  }

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
                onClick={() => onNavigate("florist-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Pedidos</h1>
                <p className="text-sm text-slate-600">Administra todos los pedidos florales</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="new" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="new" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Package className="w-4 h-4 mr-2" />
              Nuevos ({orders.new.length})
            </TabsTrigger>
            <TabsTrigger
              value="inProgress"
              className="data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700"
            >
              <Clock className="w-4 h-4 mr-2" />
              En Proceso ({orders.inProgress.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completados ({orders.completed.length})
            </TabsTrigger>
          </TabsList>

          {/* New Orders */}
          <TabsContent value="new" className="space-y-4">
            {orders.new.map((order) => (
              <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{order.type}</h3>
                        <Badge className="bg-blue-100 text-blue-800">Nuevo</Badge>
                        {order.priority === "urgent" && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        <p>
                          <strong>Cliente:</strong> {order.customer}
                        </p>
                        <p>
                          <strong>ID:</strong> {order.id} • <strong>Fecha:</strong> {order.date}
                        </p>
                        <p>
                          <strong>Detalles:</strong> {order.details}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-green-600">{order.total}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="border-slate-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptOrder(order.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        Aceptar Pedido
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* In Progress Orders */}
          <TabsContent value="inProgress" className="space-y-4">
            {orders.inProgress.map((order) => (
              <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{order.type}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800">En Proceso</Badge>
                        {order.priority === "urgent" && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        <p>
                          <strong>Cliente:</strong> {order.customer}
                        </p>
                        <p>
                          <strong>ID:</strong> {order.id} • <strong>Iniciado:</strong> {order.startedAt}
                        </p>
                        <p>
                          <strong>Detalles:</strong> {order.details}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-green-600">{order.total}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="border-slate-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Completed Orders */}
          <TabsContent value="completed" className="space-y-4">
            {orders.completed.map((order) => (
              <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{order.type}</h3>
                        <Badge className="bg-green-100 text-green-800">Completado</Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        <p>
                          <strong>Cliente:</strong> {order.customer}
                        </p>
                        <p>
                          <strong>ID:</strong> {order.id} • <strong>Completado:</strong> {order.completedAt}
                        </p>
                        <p>
                          <strong>Detalles:</strong> {order.details}
                        </p>
                      </div>
                      <div className="text-xl font-bold text-green-600">{order.total}</div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                        className="border-slate-200"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Detalles del Pedido {selectedOrder.id}</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Cliente</Label>
                    <p className="text-slate-800">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Tipo</Label>
                    <p className="text-slate-800">{selectedOrder.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Fecha</Label>
                    <p className="text-slate-800">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Total</Label>
                    <p className="text-green-600 font-semibold">{selectedOrder.total}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Detalles del arreglo</Label>
                  <p className="text-slate-800">{selectedOrder.details}</p>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Cerrar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
