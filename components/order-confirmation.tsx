"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, CreditCard, MapPin, Calendar } from "lucide-react"
import type { Screen } from "@/app/page"

interface OrderConfirmationProps {
  order: any
  onNavigate: (screen: Screen) => void
}

export function OrderConfirmation({ order, onNavigate }: OrderConfirmationProps) {
  const handlePayment = () => {
    // Simulación de pago
    alert("¡Pago procesado exitosamente! Tu pedido ha sido confirmado.")
    onNavigate("arrangement-builder")
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No hay información del pedido disponible</p>
      </div>
    )
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
                onClick={() => onNavigate("arrangement-builder")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Confirmar Pedido</h1>
                <p className="text-sm text-slate-600">Revisa y confirma tu arreglo floral</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            
            {/* Delivery Information */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Información de Recogida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-amber-800 mb-2">📍 Recogida en Florería</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    Tu pedido estará disponible para recoger en nuestra florería ubicada en:
                  </p>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-slate-800">Florería "Pétalos y Fragancias"</p>
                    <p className="text-sm text-slate-600">Av. Flores 123, Colonia Jardín</p>
                    <p className="text-sm text-slate-600">Ciudad de México, CP 12345</p>
                    <p className="text-sm text-slate-600">Tel: (55) 1234-5678</p>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">⏰ Tiempo de Preparación</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Tu arreglo estará disponible en un <strong>mínimo de 12 horas</strong> después de confirmar el pedido.
                  </p>
                  <p className="text-xs text-green-600">
                    Te notificaremos cuando tu pedido esté listo para recoger.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Horario de atención:</strong> Lunes a Sábado 9:00 AM - 7:00 PM, Domingo 10:00 AM - 5:00 PM
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Información de Pago
                </CardTitle>
                <CardDescription>Pago al momento de la recogida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">💳 Pago en Florería</h4>
                  <p className="text-sm text-amber-700 mb-3">
                    El pago se realizará de manera presencial al momento de recoger tu pedido en nuestra florería.
                  </p>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-slate-800 mb-2">Métodos de pago aceptados:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Efectivo</li>
                      <li>• Tarjeta de débito</li>
                      <li>• Tarjeta de crédito</li>
                      <li>• Transferencia bancaria</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">

            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Resumen del Pedido
                </CardTitle>
                <CardDescription>ID: {order.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Tipo de arreglo:</span>
                  <Badge className="bg-green-100 text-green-800 capitalize">{order.category}</Badge>
                </div>

                {order.arrangementType && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{order.arrangementType.name}:</span>
                      <span className="font-medium">${order.arrangementType.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{order.arrangementType.description}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="font-medium text-slate-800 mb-3">Flores seleccionadas:</h4>
                  <div className="space-y-2">
                    {order.apiResponse && order.apiResponse.data && order.apiResponse.data.orderHasFlowers ? 
                      // Si tenemos datos de la API, usar esos
                      order.apiResponse.data.orderHasFlowers.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            {item.flower?.name || `Flor #${item.flowerId}`} x{item.cuantity}
                          </span>
                          <span className="font-medium">
                            ${((item.flower?.price || 0) * item.cuantity).toFixed(2)}
                          </span>
                        </div>
                      ))
                      :
                      // Fallback usando datos locales con información completa de flores
                      Object.entries(order.flowers).map(([flowerId, quantity]) => {
                        const flowerData = order.flowersData?.find((f: any) => f.id === Number(flowerId));
                        return (
                          <div key={flowerId} className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              {flowerData?.name || `Flor #${flowerId}`} x{quantity as number}
                            </span>
                            <span className="font-medium">
                              ${((flowerData?.price || 0) * (quantity as number)).toFixed(2)}
                            </span>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-slate-800">Total:</span>
                    <span className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Card */}
            <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Total a pagar:</span>
                      <span className="text-xl font-bold text-green-600">${(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Confirmar Pedido y Pagar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
