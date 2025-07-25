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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-name">Nombre completo</Label>
                    <Input id="delivery-name" placeholder="María González" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-phone">Teléfono</Label>
                    <Input id="delivery-phone" placeholder="+1 234 567 8900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-address">Dirección de entrega</Label>
                  <Textarea id="delivery-address" placeholder="Calle Principal 123, Colonia Centro, Ciudad" rows={3} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery-date">Fecha de entrega</Label>
                    <Input id="delivery-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Hora preferida</Label>
                    <Input id="delivery-time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-notes">Notas especiales (opcional)</Label>
                  <Textarea id="delivery-notes" placeholder="Instrucciones adicionales para la entrega..." rows={2} />
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
                <CardDescription>Simulación de pago con tarjeta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Número de tarjeta</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" defaultValue="4532 1234 5678 9012" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Nombre en la tarjeta</Label>
                  <Input id="card-name" placeholder="María González" defaultValue="María González" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Fecha de vencimiento</Label>
                    <Input id="card-expiry" placeholder="MM/AA" defaultValue="12/28" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input id="card-cvv" placeholder="123" defaultValue="123" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Esta es una simulación. No se procesará ningún pago real.
                  </p>
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
