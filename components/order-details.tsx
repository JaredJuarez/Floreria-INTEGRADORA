"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, MapPin, Calendar, Phone, Mail, User } from "lucide-react"
import type { Screen } from "@/app/page"

interface OrderDetailsProps {
  order: any
  onNavigate: (screen: Screen) => void
}

export function OrderDetails({ order, onNavigate }: OrderDetailsProps) {
  // Datos de ejemplo si no hay orden
  const orderData = order || {
    id: "ORD-001",
    category: "bouquet",
    arrangementType: {
      name: "Ramo Premium",
      description: "Ramo elegante con flores de alta calidad",
      price: 65.0,
      maxFlowers: 18,
    },
    flowers: {
      1: 6, // Rosa Roja x6
      2: 4, // Rosa Blanca x4
      4: 8, // Lirio Blanco x8
    },
    total: 65.0,
    date: "2024-01-15",
    status: "En proceso",
    customer: {
      name: "María González",
      phone: "+1 234 567 8900",
      email: "maria.gonzalez@email.com",
      address: "Calle Principal 123, Colonia Centro, Ciudad",
    },
    deliveryDate: "2024-01-17",
    deliveryTime: "14:00",
    notes: "Entregar en recepción del edificio",
    florist: "Carmen López García",
  }

  const flowerNames = {
    1: "Rosa Roja",
    2: "Rosa Blanca",
    3: "Tulipán Amarillo",
    4: "Lirio Blanco",
    5: "Girasol",
    6: "Orquídea Morada",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nuevo":
        return "bg-blue-100 text-blue-800"
      case "En proceso":
        return "bg-yellow-100 text-yellow-800"
      case "Completado":
        return "bg-green-100 text-green-800"
      case "Entregado":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                onClick={() => onNavigate("order-history")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Detalles del Pedido</h1>
                <p className="text-sm text-slate-600">ID: {orderData.id}</p>
              </div>
            </div>
            <Badge className={getStatusColor(orderData.status)}>{orderData.status}</Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Package className="w-5 h-5 mr-2 text-green-600" />
                  Información del Arreglo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-2">{orderData.arrangementType.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{orderData.arrangementType.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">${orderData.total.toFixed(2)}</span>
                    <span className="text-sm text-slate-500">Máx. {orderData.arrangementType.maxFlowers} flores</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-800 mb-3">Flores seleccionadas:</h4>
                  <div className="space-y-2">
                    {Object.entries(orderData.flowers).map(([flowerId, quantity]) => (
                      <div key={flowerId} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                        <span className="text-slate-700">
                          {flowerNames[flowerId as keyof typeof flowerNames]} x{quantity as number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Total flores utilizadas:</span>
                    <span className="font-semibold">
                      {Object.values(orderData.flowers).reduce((sum: number, qty: any) => sum + qty, 0)}/
                      {orderData.arrangementType.maxFlowers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <User className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{orderData.customer.name}</p>
                    <p className="text-sm text-slate-600">Cliente</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{orderData.customer.phone}</p>
                    <p className="text-sm text-slate-600">Teléfono</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{orderData.customer.email}</p>
                    <p className="text-sm text-slate-600">Correo electrónico</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{orderData.customer.address}</p>
                    <p className="text-sm text-slate-600">Dirección de entrega</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery and Status */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Información de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="font-semibold text-purple-800">{orderData.deliveryDate}</p>
                    <p className="text-sm text-purple-600">Fecha de entrega</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="font-semibold text-purple-800">{orderData.deliveryTime}</p>
                    <p className="text-sm text-purple-600">Hora estimada</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-medium text-slate-800 mb-1">Notas especiales:</p>
                  <p className="text-sm text-slate-600">{orderData.notes || "Sin notas especiales"}</p>
                </div>

                <div className="p-3 bg-rose-50 rounded-lg">
                  <p className="font-medium text-slate-800 mb-1">Florista asignado:</p>
                  <p className="text-sm text-rose-700">{orderData.florist}</p>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Estado del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-slate-800">Pedido confirmado</p>
                      <p className="text-sm text-slate-600">{orderData.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        orderData.status === "En proceso" ||
                        orderData.status === "Completado" ||
                        orderData.status === "Entregado"
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-slate-800">En preparación</p>
                      <p className="text-sm text-slate-600">
                        {orderData.status === "En proceso" ? "En progreso" : "Pendiente"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        orderData.status === "Completado" || orderData.status === "Entregado"
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-slate-800">Listo para entrega</p>
                      <p className="text-sm text-slate-600">
                        {orderData.status === "Completado" ? "Completado" : "Pendiente"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        orderData.status === "Entregado" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-slate-800">Entregado</p>
                      <p className="text-sm text-slate-600">
                        {orderData.status === "Entregado" ? orderData.deliveryDate : "Pendiente"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    onClick={() => onNavigate("arrangement-builder")}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    Reordenar este arreglo
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 bg-transparent"
                    onClick={() => window.print()}
                  >
                    Imprimir detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
