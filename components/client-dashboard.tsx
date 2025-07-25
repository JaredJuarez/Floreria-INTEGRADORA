"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Clock, CheckCircle, Flower2, LogOut, History } from "lucide-react"
import type { Screen } from "@/app/page"

interface ClientDashboardProps {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

const suggestedArrangements = [
  {
    name: "Ramo Primaveral",
    image: "/placeholder.svg?height=200&width=200",
    price: "$35.00",
    description: "Tulipanes y narcisos frescos",
  },
  {
    name: "Centro Elegante",
    image: "/placeholder.svg?height=200&width=200",
    price: "$65.00",
    description: "Rosas blancas y eucalipto",
  },
  {
    name: "Ramo Tropical",
    image: "/placeholder.svg?height=200&width=200",
    price: "$55.00",
    description: "Orquídeas y flores exóticas",
  },
]

export function ClientDashboard({ onNavigate, onLogout }: ClientDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">FloralCraft</h1>
                <p className="text-sm text-slate-600">¡Hola, María!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("order-history")}
                className="text-slate-600 hover:text-slate-800"
              >
                <History className="w-4 h-4 mr-2" />
                Historial
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
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-serif font-bold mb-2">Crea tu arreglo perfecto</h2>
                  <p className="text-green-100 text-lg mb-4">
                    Diseña arreglos florales únicos con nuestro constructor interactivo
                  </p>
                  <Button
                    onClick={() => onNavigate("arrangement-builder")}
                    size="lg"
                    className="bg-white text-green-600 hover:bg-green-50 font-medium"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Comenzar a Crear
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

        <div className="grid grid-cols-1 gap-8">
          {/* Suggested Arrangements */}
          <div>
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Arreglos Sugeridos</CardTitle>
                <CardDescription>Populares esta temporada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestedArrangements.map((arrangement, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <img
                          src={arrangement.image || "/placeholder.svg"}
                          alt={arrangement.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-800 group-hover:text-green-600 transition-colors">
                            {arrangement.name}
                          </h4>
                          <p className="text-sm text-slate-600 mb-1">{arrangement.description}</p>
                          <p className="font-semibold text-green-600">{arrangement.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                    onClick={() => onNavigate("arrangement-builder")}
                  >
                    Ver más opciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">12 Pedidos</h3>
              <p className="text-sm text-slate-600">Completados este mes</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">2 Pedidos</h3>
              <p className="text-sm text-slate-600">En proceso</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm border-slate-200">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flower2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">5 Favoritos</h3>
              <p className="text-sm text-slate-600">Arreglos guardados</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
