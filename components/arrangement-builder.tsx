"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart, Flower2, Filter, LogOut, User } from "lucide-react"
import type { Screen, UserType } from "@/app/page"

interface ArrangementBuilderProps {
  onNavigate: (screen: Screen) => void
  onOrderCreate: (order: any) => void
  currentUser: UserType
  onLogout: () => void
}

const categories = [
  { id: "bouquet", name: "Ramo", icon: "💐" },
  { id: "centerpiece", name: "Centro de Mesa", icon: "🌸" },
  { id: "wreath", name: "Corona", icon: "🌿" },
  { id: "arrangement", name: "Arreglo", icon: "🌺" },
]

const flowers = [
  {
    id: 1,
    name: "Rosa Roja",
    image: "/placeholder.svg?height=150&width=150",
    category: "roses",
    color: "red",
    inStock: true,
  },
  {
    id: 2,
    name: "Rosa Blanca",
    image: "/placeholder.svg?height=150&width=150",
    category: "roses",
    color: "white",
    inStock: true,
  },
  {
    id: 3,
    name: "Tulipán Amarillo",
    image: "/placeholder.svg?height=150&width=150",
    category: "tulips",
    color: "yellow",
    inStock: true,
  },
  {
    id: 4,
    name: "Lirio Blanco",
    image: "/placeholder.svg?height=150&width=150",
    category: "lilies",
    color: "white",
    inStock: true,
  },
  {
    id: 5,
    name: "Girasol",
    image: "/placeholder.svg?height=150&width=150",
    category: "sunflowers",
    color: "yellow",
    inStock: true,
  },
  {
    id: 6,
    name: "Orquídea Morada",
    image: "/placeholder.svg?height=150&width=150",
    category: "orchids",
    color: "purple",
    inStock: false,
  },
]

const arrangementTypes = {
  bouquet: [
    {
      id: "1",
      name: "Ramo Clásico",
      description: "Ramo tradicional perfecto para cualquier ocasión",
      price: 35.0,
      maxFlowers: 12,
      isActive: true,
    },
    {
      id: "2",
      name: "Ramo Premium",
      description: "Ramo elegante con flores de alta calidad",
      price: 65.0,
      maxFlowers: 18,
      isActive: true,
    },
    {
      id: "3",
      name: "Ramo Deluxe",
      description: "Ramo exclusivo con las mejores flores disponibles",
      price: 95.0,
      maxFlowers: 24,
      isActive: true,
    },
  ],
  centerpiece: [
    {
      id: "4",
      name: "Centro Clásico",
      description: "Centro de mesa tradicional para eventos",
      price: 45.0,
      maxFlowers: 15,
      isActive: true,
    },
    {
      id: "5",
      name: "Centro Premium",
      description: "Centro de mesa elegante para ocasiones especiales",
      price: 75.0,
      maxFlowers: 22,
      isActive: true,
    },
    {
      id: "6",
      name: "Centro Deluxe",
      description: "Centro de mesa exclusivo para eventos de lujo",
      price: 120.0,
      maxFlowers: 30,
      isActive: true,
    },
  ],
  wreath: [
    {
      id: "7",
      name: "Corona Clásica",
      description: "Corona tradicional para ceremonias",
      price: 55.0,
      maxFlowers: 20,
      isActive: true,
    },
    {
      id: "8",
      name: "Corona Premium",
      description: "Corona elegante con flores selectas",
      price: 85.0,
      maxFlowers: 28,
      isActive: true,
    },
    {
      id: "9",
      name: "Corona Deluxe",
      description: "Corona exclusiva para ocasiones especiales",
      price: 130.0,
      maxFlowers: 35,
      isActive: true,
    },
  ],
  arrangement: [
    {
      id: "10",
      name: "Arreglo Clásico",
      description: "Arreglo floral tradicional para decoración",
      price: 40.0,
      maxFlowers: 14,
      isActive: true,
    },
    {
      id: "11",
      name: "Arreglo Premium",
      description: "Arreglo floral elegante para espacios especiales",
      price: 70.0,
      maxFlowers: 20,
      isActive: true,
    },
    {
      id: "12",
      name: "Arreglo Deluxe",
      description: "Arreglo floral exclusivo para decoración de lujo",
      price: 110.0,
      maxFlowers: 26,
      isActive: true,
    },
  ],
}

export function ArrangementBuilder({ onNavigate, onOrderCreate, currentUser, onLogout }: ArrangementBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState("bouquet")
  const [selectedFlowers, setSelectedFlowers] = useState<{ [key: number]: number }>({})
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedArrangementType, setSelectedArrangementType] = useState<any>(null)

  const addFlower = (flowerId: number) => {
    if (selectedArrangementType) {
      const currentTotal = getTotalFlowers()
      if (currentTotal >= selectedArrangementType.maxFlowers) {
        alert(`No puedes agregar más flores. Límite: ${selectedArrangementType.maxFlowers} flores`)
        return
      }
    }
    setSelectedFlowers((prev) => ({
      ...prev,
      [flowerId]: (prev[flowerId] || 0) + 1,
    }))
  }

  const removeFlower = (flowerId: number) => {
    setSelectedFlowers((prev) => {
      const newQuantity = (prev[flowerId] || 0) - 1
      if (newQuantity <= 0) {
        const { [flowerId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [flowerId]: newQuantity }
    })
  }

  const getTotalPrice = () => {
    if (selectedArrangementType) {
      return selectedArrangementType.price
    }
    return 0
  }

  const getTotalFlowers = () => {
    return Object.values(selectedFlowers).reduce((total, quantity) => total + quantity, 0)
  }

  const handleCreateOrder = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      category: selectedCategory,
      arrangementType: selectedArrangementType,
      flowers: selectedFlowers,
      total: getTotalPrice(),
      date: new Date().toISOString().split("T")[0],
    }
    onOrderCreate(order)
    onNavigate("order-confirmation")
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedArrangementType(null)
    setSelectedFlowers({})
  }

  const filteredFlowers =
    filterCategory === "all" ? flowers : flowers.filter((flower) => flower.category === filterCategory)

  const currentArrangementTypes = arrangementTypes[selectedCategory as keyof typeof arrangementTypes] || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">FloralCraft</h1>
                <p className="text-sm text-slate-600">Diseña tu arreglo perfecto</p>
              </div>
            </div>
            {currentUser === "client" && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("client-profile")}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </Button>
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-slate-800">
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Selection */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Tipo de Arreglo</CardTitle>
                <CardDescription>Selecciona el estilo que deseas crear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        selectedCategory === category.id
                          ? "border-green-500 bg-green-50"
                          : "border-slate-200 hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium text-slate-800">{category.name}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Arrangement Type Selection */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">
                  Tipo de {categories.find((c) => c.id === selectedCategory)?.name}
                </CardTitle>
                <CardDescription>Selecciona el tipo específico que deseas crear</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {currentArrangementTypes
                    .filter((at) => at.isActive)
                    .map((arrangementType) => (
                      <button
                        key={arrangementType.id}
                        onClick={() => setSelectedArrangementType(arrangementType)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedArrangementType?.id === arrangementType.id
                            ? "border-rose-500 bg-rose-50"
                            : "border-slate-200 hover:border-rose-300 hover:bg-rose-50/50"
                        }`}
                      >
                        <h3 className="font-semibold text-slate-800 mb-2">{arrangementType.name}</h3>
                        <p className="text-sm text-slate-600 mb-3">{arrangementType.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-rose-600">${arrangementType.price.toFixed(2)}</span>
                          <span className="text-sm text-slate-500">Máx. {arrangementType.maxFlowers} flores</span>
                        </div>
                      </button>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Flower Selection */}
            {selectedArrangementType && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-slate-800">Catálogo de Flores</CardTitle>
                      <CardDescription>Selecciona las flores para tu arreglo</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-slate-500" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border border-slate-200 rounded-md px-3 py-1 text-sm"
                      >
                        <option value="all">Todas</option>
                        <option value="roses">Rosas</option>
                        <option value="tulips">Tulipanes</option>
                        <option value="lilies">Lirios</option>
                        <option value="sunflowers">Girasoles</option>
                        <option value="orchids">Orquídeas</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFlowers.map((flower) => (
                      <div key={flower.id} className="group">
                        <Card className={`transition-all hover:shadow-md ${!flower.inStock ? "opacity-60" : ""}`}>
                          <CardContent className="p-4">
                            <div className="relative mb-3">
                              <img
                                src={flower.image || "/placeholder.svg"}
                                alt={flower.name}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              {!flower.inStock && (
                                <Badge className="absolute top-2 right-2 bg-red-100 text-red-800">Agotado</Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-slate-800 mb-3">{flower.name}</h3>

                            {flower.inStock && (
                              <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFlower(flower.id)}
                                    disabled={!selectedFlowers[flower.id]}
                                    className="w-8 h-8 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-8 text-center font-medium">{selectedFlowers[flower.id] || 0}</span>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addFlower(flower.id)}
                                    className="w-8 h-8 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm border-slate-200 sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Flower2 className="w-5 h-5 mr-2 text-green-600" />
                  Tu Arreglo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flower2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm text-slate-600">
                    {getTotalFlowers() === 0
                      ? "Selecciona flores para tu arreglo"
                      : `${getTotalFlowers()} flores seleccionadas`}
                  </p>
                </div>

                {selectedArrangementType && (
                  <div className="bg-rose-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-slate-800 mb-1">{selectedArrangementType.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{selectedArrangementType.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Precio fijo:</span>
                      <span className="font-semibold text-rose-600">${selectedArrangementType.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Flores usadas:</span>
                      <span className="font-semibold">
                        {getTotalFlowers()}/{selectedArrangementType.maxFlowers}
                      </span>
                    </div>
                  </div>
                )}

                {Object.entries(selectedFlowers).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-800">Flores seleccionadas:</h4>
                    {Object.entries(selectedFlowers).map(([flowerId, quantity]) => {
                      const flower = flowers.find((f) => f.id === Number.parseInt(flowerId))
                      if (!flower) return null
                      return (
                        <div key={flowerId} className="flex justify-between text-sm">
                          <span className="text-slate-600">
                            {flower.name} x{quantity}
                          </span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateOrder}
                  disabled={!selectedArrangementType || getTotalFlowers() === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Crear Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
