"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart, Flower2, Filter, LogOut, User, Clock, History } from "lucide-react"
import type { Screen, UserType } from "@/app/page"
import { apiService } from "@/lib/api"
import Swal from "sweetalert2"

interface ArrangementBuilderProps {
  onNavigate: (screen: Screen) => void
  onOrderCreate: (order: any) => void
  currentUser: UserType
  onLogout: () => void
}

// Interfaces para los datos de la API
interface CategoryType {
  id: string
  name: string
  icon: string
}

interface ArrangementType {
  id: number
  name: string
  description: string
  price: number
  totalQuantityFlowers: number
  typeCategory: string
  isActive?: boolean
}

interface FlowerType {
  id: number
  name: string
  type: string
  price: number
  amount: number
  description: string
  image: string
  orderHasFlowers: any[]
}

interface ApiResponse<T> {
  message: string
  data: T
  error: boolean
  status: string
}

// Datos de categorías con iconos por defecto (se actualizarán desde la API)
const defaultCategories = [
  { id: "Ramos", name: "Ramos", icon: "💐" },
  { id: "Floreros", name: "Floreros", icon: "🌸" },
  { id: "Coronas", name: "Coronas", icon: "🌿" },
  { id: "Arreglos", name: "Arreglos", icon: "🌺" },
]

export function ArrangementBuilder({ onNavigate, onOrderCreate, currentUser, onLogout }: ArrangementBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedFlowers, setSelectedFlowers] = useState<{ [key: number]: number }>({})
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedArrangementType, setSelectedArrangementType] = useState<ArrangementType | null>(null)
  const [categories, setCategories] = useState<CategoryType[]>(defaultCategories)
  const [arrangements, setArrangements] = useState<ArrangementType[]>([])
  const [flowers, setFlowers] = useState<FlowerType[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingFlowers, setLoadingFlowers] = useState(false)

  // Cargar tipos de categorías al montar el componente
  useEffect(() => {
    const loadCategoryTypes = async () => {
      try {
        setLoading(true)
        const response: ApiResponse<string[]> = await apiService.getCategoryTypes()
        if (!response.error && response.data) {
          const categoryTypesWithIcons = response.data.map((categoryName, index) => ({
            id: categoryName,
            name: categoryName,
            icon: defaultCategories.find(cat => cat.name === categoryName)?.icon || "🌸"
          }))
          setCategories(categoryTypesWithIcons)
        }
      } catch (error) {
        console.error('Error loading category types:', error)
        // Usar categorías por defecto en caso de error
        setCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryTypes()
  }, [])

  // Cargar arreglos cuando se selecciona una categoría
  useEffect(() => {
    const loadArrangements = async () => {
      if (!selectedCategory) return

      try {
        setLoading(true)
        const response: ApiResponse<ArrangementType[]> = await apiService.getArrangementsByCategory(selectedCategory)
        if (!response.error && response.data) {
          setArrangements(response.data)
        }
      } catch (error) {
        console.error('Error loading arrangements:', error)
        setArrangements([])
      } finally {
        setLoading(false)
      }
    }

    loadArrangements()
  }, [selectedCategory])

  // Cargar flores desde la API
  useEffect(() => {
    const loadFlowers = async () => {
      try {
        setLoadingFlowers(true)
        const response: ApiResponse<FlowerType[]> = await apiService.getFlowers()
        if (!response.error && response.data) {
          setFlowers(response.data)
        }
      } catch (error) {
        console.error('Error loading flowers:', error)
        setFlowers([])
      } finally {
        setLoadingFlowers(false)
      }
    }

    loadFlowers()
  }, [])

  const addFlower = (flowerId: number) => {
    const flower = flowers.find(f => f.id === flowerId)
    if (!flower) return

    if (selectedArrangementType) {
      const currentTotal = getTotalFlowers()
      if (currentTotal >= selectedArrangementType.totalQuantityFlowers) {
        Swal.fire("Límite alcanzado", `No puedes agregar más flores. Límite: ${selectedArrangementType.totalQuantityFlowers} flores`, "warning")
        return
      }
    }

    const currentFlowerCount = selectedFlowers[flowerId] || 0
    if (currentFlowerCount >= flower.amount) {
      Swal.fire("Stock insuficiente", `No hay más stock disponible de ${flower.name}. Stock disponible: ${flower.amount}`, "warning")
      return
    }

    setSelectedFlowers((prev) => ({
      ...prev,
      [flowerId]: currentFlowerCount + 1,
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
    let total = 0
    
    // Precio del tipo de arreglo (si está seleccionado)
    if (selectedArrangementType) {
      total += selectedArrangementType.price
    }
    
    // Precio de las flores seleccionadas
    Object.entries(selectedFlowers).forEach(([flowerId, quantity]) => {
      const flower = flowers.find(f => f.id === Number(flowerId))
      if (flower) {
        total += flower.price * quantity
      }
    })
    
    return total
  }

  const getTotalFlowers = () => {
    return Object.values(selectedFlowers).reduce((total, quantity) => total + quantity, 0)
  }

  const handleCreateOrder = async () => {
    if (!selectedArrangementType || !selectedCategory) return

    try {
      // Encontrar el ID de la categoría seleccionada
      const selectedCategoryData = arrangements.find(arr => arr.id === selectedArrangementType.id)
      
      // Preparar datos de flores en el formato requerido
      const flowersData = Object.entries(selectedFlowers).map(([flowerId, quantity]) => ({
        cuantity: quantity,
        flowerId: Number(flowerId)
      }))

      const orderData = {
        category: selectedArrangementType.id, // Usar el ID del tipo de arreglo seleccionado
        flowers: flowersData
      }

      console.log('Sending order data:', orderData)

      const response = await apiService.createOrder(orderData)
      
      if (!response.error) {
        // Crear objeto de orden para mostrar en confirmación
        const order = {
          id: `ORD-${Date.now()}`,
          category: selectedCategory,
          arrangementType: selectedArrangementType,
          flowers: selectedFlowers,
          flowersData: flowers, // Agregar la información completa de las flores
          total: getTotalPrice(),
          date: new Date().toISOString().split("T")[0],
          apiResponse: response
        }
        
        onOrderCreate(order)
        onNavigate("order-confirmation")
      } else {
        Swal.fire("Error", `Error al crear el pedido: ${response.message}`, "error")
      }
    } catch (error) {
      console.error('Error creating order:', error)
      Swal.fire("Error de conexión", "Error de conexión al crear el pedido", "error")
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedArrangementType(null)
    setSelectedFlowers({})
  }

  const filteredFlowers =
    filterCategory === "all" ? flowers : flowers.filter((flower) => flower.type.toLowerCase().includes(filterCategory.toLowerCase()))

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
                <h1 className="text-xl font-serif font-semibold text-slate-800">FLOREVER</h1>
                <p className="text-sm text-slate-600">Diseña tu arreglo perfecto</p>
              </div>
            </div>
            {currentUser === "client" && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("order-history")}
                  className="text-slate-600 hover:text-slate-800"
                >
                  <History className="w-4 h-4 mr-2" />
                  Mis Pedidos
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
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-slate-500">Cargando categorías...</div>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>

            {/* Arrangement Type Selection */}
            {selectedCategory && (
              <Card className="shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    Tipo de {categories.find((c) => c.id === selectedCategory)?.name}
                  </CardTitle>
                  <CardDescription>Selecciona el tipo específico que deseas crear</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-slate-500">Cargando arreglos...</div>
                    </div>
                  ) : arrangements.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-slate-500">No hay arreglos disponibles para esta categoría</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {arrangements
                        .filter((at) => at.isActive !== false)
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
                              <span className="text-sm text-slate-500">Máx. {arrangementType.totalQuantityFlowers} flores</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                        title="Filtrar por tipo de flores"
                      >
                        <option value="all">Todas</option>
                        <option value="rosa">Rosas</option>
                        <option value="bugambilia">Bugambilia</option>
                        <option value="tulipán">Tulipanes</option>
                        <option value="lirio">Lirios</option>
                        <option value="girasol">Girasoles</option>
                        <option value="orquídea">Orquídeas</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingFlowers ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-slate-500">Cargando flores...</div>
                    </div>
                  ) : flowers.length === 0 ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-slate-500">No hay flores disponibles</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredFlowers.map((flower) => (
                        <div key={flower.id} className="group">
                          <Card className={`transition-all hover:shadow-md ${flower.amount === 0 ? "opacity-60" : ""}`}>
                            <CardContent className="p-4">
                              <div className="relative mb-3">
                                <img
                                  src={flower.image || "/placeholder.svg"}
                                  alt={flower.name}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {flower.amount === 0 && (
                                  <Badge className="absolute top-2 right-2 bg-red-100 text-red-800">Agotado</Badge>
                                )}
                                {flower.amount > 0 && (
                                  <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
                                    Stock: {flower.amount}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-medium text-slate-800 mb-1">{flower.name}</h3>
                              <p className="text-xs text-slate-500 mb-2">{flower.type}</p>
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{flower.description}</p>
                              <div className="text-sm font-semibold text-green-600 mb-3">
                                ${flower.price.toFixed(2)} c/u
                              </div>

                              {flower.amount > 0 && (
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
                                      disabled={selectedFlowers[flower.id] >= flower.amount}
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
                  )}
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
                        {getTotalFlowers()}/{selectedArrangementType.totalQuantityFlowers}
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
                          <span className="text-slate-600">
                            ${(flower.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      )
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal flores:</span>
                        <span className="text-slate-600">
                          ${Object.entries(selectedFlowers).reduce((total, [flowerId, quantity]) => {
                            const flower = flowers.find(f => f.id === Number(flowerId))
                            return total + (flower ? flower.price * quantity : 0)
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                      {selectedArrangementType && (
                        <div className="flex justify-between text-sm">
                          <span>Arreglo base:</span>
                          <span className="text-slate-600">${selectedArrangementType.price.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-1 mt-1">
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
