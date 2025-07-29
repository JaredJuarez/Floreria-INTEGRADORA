"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    onNavigate("client-dashboard")
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

                <div className="border-t pt-4">
                  <h4 className="font-medium text-slate-800 mb-3">Flores seleccionadas:</h4>
                  <div className="space-y-2">
                    {Object.entries(order.flowers).map(([flowerId, quantity]) => (
                      <div key={flowerId} className="flex justify-between text-sm">
                        <span className="text-slate-600">
                          Flor #{flowerId} x{quantity as number}
                        </span>
                        <span className="font-medium">$15.00</span>
                      </div>
                    ))}
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

            {/* Delivery Information */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Información de Entrega
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="pickup-name">Nombre de quien recoge</Label>
                  <Input id="pickup-name" placeholder="María González" />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="pickup-phone">Teléfono de contacto</Label>
                  <Input id="pickup-phone" placeholder="+52 55 1234 5678" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <Label htmlFor="pickup-date">Fecha de recogida</Label>
                  <Input id="pickup-date" type="date" />
                  </div>
                  <div className="space-y-2">
                  <Label htmlFor="pickup-time">Hora preferida</Label>
                  <Input id="pickup-time" type="time" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup-notes">Notas especiales (opcional)</Label>
                  <Textarea id="pickup-notes" placeholder="Instrucciones adicionales para la recogida..." rows={2} />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                  <strong>Horario de atención:</strong> Lunes a Sábado 9:00 AM - 7:00 PM, Domingo 10:00 AM - 5:00 PM
                  </p>
                </div>
                </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <div className="space-y-6">
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

            {/* Order Summary Card */}
            <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">Tiempo estimado</h3>
                  <p className="text-sm text-slate-600">Tu arreglo estará listo en 2-3 días hábiles</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Entrega:</span>
                    <span className="font-medium">$5.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Total a pagar:</span>
                      <span className="text-xl font-bold text-green-600">${(order.total + 5).toFixed(2)}</span>
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
