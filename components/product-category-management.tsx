"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Edit, Trash2, Flower2, Package, AlertCircle } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"
import { apiService } from "@/lib/api"

interface ProductCategoryManagementProps {
  onNavigate: (screen: Screen) => void
}

// Interfaz que coincide con el modelo del backend
interface Category {
  id?: number
  name: string
  description: string
  price: number
  totalQuantityFlowers: number
  typeCategory: string
}

interface Flower {
  id?: number
  name: string
  type: string
  price: number
  amount: number
  description: string
  image: string
}

export function ProductCategoryManagement({ onNavigate }: ProductCategoryManagementProps) {
  // Estados para categorías
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryTypes, setCategoryTypes] = useState<string[]>([])
  const [categoryLoading, setCategoryLoading] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [isCategoryCreating, setIsCategoryCreating] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [selectedCategoryType, setSelectedCategoryType] = useState("")
  const [isAddingNewType, setIsAddingNewType] = useState(false)
  const [newCategoryType, setNewCategoryType] = useState("")
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    price: "",
    totalQuantityFlowers: "",
    typeCategory: "",
  })

  // Estados para flores
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [flowerLoading, setFlowerLoading] = useState(true)
  const [flowerError, setFlowerError] = useState<string | null>(null)
  const [isFlowerCreating, setIsFlowerCreating] = useState(false)
  const [editingFlowerId, setEditingFlowerId] = useState<number | null>(null)
  const [flowerFormData, setFlowerFormData] = useState({
    name: "",
    type: "",
    price: "",
    amount: "",
    description: "",
    image: "",
  })

  const [activeTab, setActiveTab] = useState("categories")

  // Cargar datos iniciales
  useEffect(() => {
    loadCategories()
    loadFlowers()
  }, [])

  const loadCategories = async () => {
    try {
      setCategoryLoading(true)
      
      // Obtener tipos de categoría
      const typesResponse = await apiService.getCategoryTypes()
      if (!typesResponse.error) {
        setCategoryTypes(typesResponse.data || [])
        if (typesResponse.data && typesResponse.data.length > 0 && !selectedCategoryType) {
          setSelectedCategoryType(typesResponse.data[0])
        }
      }

      // Obtener todas las categorías
      const categoriesResponse = await apiService.getCategories()
      if (!categoriesResponse.error) {
        setCategories(categoriesResponse.data || [])
      } else {
        setCategoryError("No se pudieron cargar las categorías")
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      setCategoryError("Error de conexión al servidor")
    } finally {
      setCategoryLoading(false)
    }
  }

  const loadFlowers = async () => {
    try {
      setFlowerLoading(true)
      const response = await apiService.getAllFlowers()
      if (!response.error) {
        setFlowers(response.data || [])
      } else {
        setFlowerError(response.message || "Error al cargar las flores")
      }
    } catch (error) {
      console.error('Error loading flowers:', error)
      setFlowerError("Error de conexión al servidor")
    } finally {
      setFlowerLoading(false)
    }
  }

  // Funciones para categorías
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar que se haya seleccionado un tipo de categoría
    if (!categoryFormData.typeCategory) {
      Swal.fire("Error", "Debe seleccionar un tipo de categoría", "error")
      return
    }

    const categoryData = {
      name: categoryFormData.name,
      description: categoryFormData.description,
      price: Number.parseFloat(categoryFormData.price),
      totalQuantityFlowers: Number.parseInt(categoryFormData.totalQuantityFlowers),
      typeCategory: categoryFormData.typeCategory,
    }

    try {
      if (editingCategoryId) {
        const response = await apiService.updateCategory(editingCategoryId, categoryData)
        if (!response.error) {
          await loadCategories()
          resetCategoryForm()
          Swal.fire("Éxito", "Categoría actualizada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo actualizar la categoría", "error")
        }
      } else {
        const response = await apiService.createCategory(categoryData)
        if (!response.error) {
          await loadCategories()
          resetCategoryForm()
          Swal.fire("Éxito", "Categoría creada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo crear la categoría", "error")
        }
      }
    } catch (error) {
      console.error('Error saving category:', error)
      Swal.fire("Error", "Error de conexión al servidor", "error")
    }
  }

  const handleCategoryEdit = (category: Category) => {
    if (category.id) {
      setEditingCategoryId(category.id)
      setCategoryFormData({
        name: category.name,
        description: category.description,
        price: category.price.toString(),
        totalQuantityFlowers: category.totalQuantityFlowers.toString(),
        typeCategory: category.typeCategory,
      })
      setSelectedCategoryType(category.typeCategory)
      setIsCategoryCreating(true)
    }
  }

  const handleCategoryDelete = async (category: Category) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Eliminar la categoría "${category.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      try {
        if (category.id) {
          const response = await apiService.deleteCategory(category.id)
          if (!response.error) {
            await loadCategories()
            Swal.fire("Eliminado", "La categoría ha sido eliminada", "success")
          } else {
            Swal.fire("Error", response.message || "No se pudo eliminar la categoría", "error")
          }
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        Swal.fire("Error", "Error de conexión al servidor", "error")
      }
    }
  }

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
      description: "",
      price: "",
      totalQuantityFlowers: "",
      typeCategory: selectedCategoryType || (categoryTypes[0] || ""),
    })
    setIsCategoryCreating(false)
    setEditingCategoryId(null)
    setIsAddingNewType(false)
    setNewCategoryType("")
  }

  const handleAddNewCategoryType = () => {
    if (newCategoryType.trim()) {
      const upperCaseType = newCategoryType.trim().toUpperCase()
      
      // Validar que no esté vacío después del trim
      if (upperCaseType.length < 2) {
        Swal.fire("Error", "El tipo de categoría debe tener al menos 2 caracteres", "error")
        return
      }
      
      // Validar que no exista ya
      if (categoryTypes.includes(upperCaseType)) {
        Swal.fire("Error", "Este tipo de categoría ya existe", "warning")
        return
      }
      
      setCategoryTypes(prev => [...prev, upperCaseType])
      setSelectedCategoryType(upperCaseType)
      setCategoryFormData(prev => ({ ...prev, typeCategory: upperCaseType }))
      setIsAddingNewType(false)
      setNewCategoryType("")
      
      Swal.fire("Éxito", `Tipo de categoría "${upperCaseType}" agregado correctamente`, "success")
    } else {
      Swal.fire("Error", "Debe ingresar un nombre para el nuevo tipo", "error")
    }
  }

  const handleCategoryTypeSelection = (type: string) => {
    if (type === "ADD_NEW") {
      setIsAddingNewType(true)
      setNewCategoryType("")
    } else {
      setSelectedCategoryType(type)
      setCategoryFormData(prev => ({ ...prev, typeCategory: type }))
      setIsAddingNewType(false)
      setNewCategoryType("")
    }
  }

  // Funciones para flores
  const validateImageUrl = (url: string): boolean => {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i
    return urlPattern.test(url)
  }

  const handleFlowerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar URL de imagen
    if (!validateImageUrl(flowerFormData.image)) {
      Swal.fire({
        title: "URL de imagen inválida",
        text: "La imagen debe ser una URL válida con formato jpg, jpeg, png, gif o webp",
        icon: "warning",
        confirmButtonText: "Entendido"
      })
      return
    }

    const flowerData = {
      name: flowerFormData.name,
      type: flowerFormData.type,
      price: Number.parseFloat(flowerFormData.price),
      amount: Number.parseInt(flowerFormData.amount),
      description: flowerFormData.description,
      image: flowerFormData.image,
    }

    try {
      if (editingFlowerId) {
        const response = await apiService.updateFlower({
          id: editingFlowerId,
          ...flowerData
        })
        if (!response.error) {
          await loadFlowers()
          resetFlowerForm()
          Swal.fire("Éxito", "Flor actualizada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo actualizar la flor", "error")
        }
      } else {
        const response = await apiService.createFlower(flowerData)
        if (!response.error) {
          await loadFlowers()
          resetFlowerForm()
          Swal.fire("Éxito", "Flor creada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo crear la flor", "error")
        }
      }
    } catch (error) {
      console.error('Error saving flower:', error)
      Swal.fire("Error", "Error de conexión al servidor", "error")
    }
  }

  const handleFlowerEdit = (flower: Flower) => {
    if (flower.id) {
      setEditingFlowerId(flower.id)
      setFlowerFormData({
        name: flower.name,
        type: flower.type,
        price: flower.price.toString(),
        amount: flower.amount.toString(),
        description: flower.description,
        image: flower.image,
      })
      setIsFlowerCreating(true)
    }
  }

  const handleFlowerDelete = async (flower: Flower) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Eliminar la flor "${flower.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      try {
        if (flower.id) {
          const response = await apiService.deleteFlower({
            id: flower.id,
            name: flower.name,
            type: flower.type,
            price: flower.price,
            amount: flower.amount,
            description: flower.description,
            image: flower.image
          })
          if (!response.error) {
            await loadFlowers()
            Swal.fire("Eliminado", "La flor ha sido eliminada", "success")
          } else {
            Swal.fire("Error", response.message || "No se pudo eliminar la flor", "error")
          }
        }
      } catch (error) {
        console.error('Error deleting flower:', error)
        Swal.fire("Error", "Error de conexión al servidor", "error")
      }
    }
  }

  const resetFlowerForm = () => {
    setFlowerFormData({
      name: "",
      type: "",
      price: "",
      amount: "",
      description: "",
      image: "",
    })
    setIsFlowerCreating(false)
    setEditingFlowerId(null)
  }

  const filteredCategories = categories.filter((c) => c.typeCategory === selectedCategoryType)

  const getUniqueFlowerTypes = () => {
    const types = [...new Set(flowers.map(f => f.type))]
    return types.filter(type => type && type.trim() !== '')
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
                onClick={() => onNavigate("superadmin-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Productos</h1>
                <p className="text-sm text-slate-600">Administra categorías y flores del catálogo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100">
            <TabsTrigger
              value="categories"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
            >
              <Package className="w-4 h-4 mr-2" />
              Categorías
            </TabsTrigger>
            <TabsTrigger
              value="flowers"
              className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
            >
              <Flower2 className="w-4 h-4 mr-2" />
              Flores
            </TabsTrigger>
          </TabsList>

          {/* Categorías Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Gestión de Categorías</h2>
                <p className="text-sm text-slate-600">Administra las categorías de productos florales</p>
              </div>
              <Button
                onClick={() => {
                  setCategoryFormData({ ...categoryFormData, typeCategory: selectedCategoryType || (categoryTypes[0] || "") })
                  setIsCategoryCreating(true)
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Categoría
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Categories List */}
              <div className="lg:col-span-2">
                {categoryLoading ? (
                  <Card className="shadow-sm border-slate-200">
                    <CardContent className="flex justify-center items-center h-64">
                      <p className="text-gray-500">Cargando categorías...</p>
                    </CardContent>
                  </Card>
                ) : categoryError ? (
                  <Card className="shadow-sm border-slate-200">
                    <CardContent className="flex justify-center items-center h-64">
                      <p className="text-red-600">{categoryError}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <Package className="w-5 h-5 mr-2 text-green-600" />
                        Categorías por Tipo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs value={selectedCategoryType} onValueChange={setSelectedCategoryType} className="space-y-4">
                        <TabsList className="flex w-full overflow-x-auto bg-slate-100 gap-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                          {categoryTypes.map((type) => (
                            <TabsTrigger
                              key={type}
                              value={type}
                              className="data-[state=active]:bg-white text-sm whitespace-nowrap"
                            >
                              {type}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {categoryTypes.map((type) => (
                          <TabsContent key={type} value={type} className="space-y-4">
                            {filteredCategories.map((category) => (
                              <div
                                key={category.id}
                                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <h3 className="font-semibold text-slate-800">{category.name}</h3>
                                    <Badge className="bg-blue-100 text-blue-800">
                                      ${category.price}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCategoryEdit(category)}
                                      className="border-slate-200"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Editar
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleCategoryDelete(category)}
                                      className="border-red-200 text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-sm text-slate-600 space-y-1">
                                  <p>Descripción: <span className="font-medium">{category.description}</span></p>
                                  <p>Máximo de flores: <span className="font-medium">{category.totalQuantityFlowers}</span></p>
                                </div>
                              </div>
                            ))}
                            {filteredCategories.length === 0 && (
                              <div className="text-center py-8 text-slate-500">
                                No hay categorías de tipo {type} creadas aún
                              </div>
                            )}
                          </TabsContent>
                        ))}
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Category Form */}
              <div>
                {isCategoryCreating && (
                  <Card className="shadow-sm border-slate-200 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-slate-800">
                        {editingCategoryId ? "Editar Categoría" : "Nueva Categoría"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-3">
                          <Label htmlFor="categoryType">Tipo de Categoría</Label>
                          <div className="space-y-3">
                            {/* Grid de tipos de categoría existentes */}
                            <div className="grid grid-cols-2 gap-2">
                              {categoryTypes.map((type) => (
                                <Button
                                  key={type}
                                  type="button"
                                  variant={categoryFormData.typeCategory === type ? "default" : "outline"}
                                  onClick={() => handleCategoryTypeSelection(type)}
                                  className="h-auto p-3 flex-col items-center text-xs"
                                >
                                  <span className="font-medium">{type}</span>
                                </Button>
                              ))}
                              
                              {/* Botón para agregar nuevo tipo */}
                              <Button
                                type="button"
                                variant={isAddingNewType ? "default" : "outline"}
                                onClick={() => setIsAddingNewType(!isAddingNewType)}
                                className="h-auto p-3 flex-col items-center text-xs border-dashed"
                              >
                                <Plus className="w-4 h-4 mb-1" />
                                <span className="font-medium">Nuevo Tipo</span>
                              </Button>
                            </div>

                            {/* Input para nuevo tipo de categoría */}
                            {isAddingNewType && (
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <Label htmlFor="newCategoryType" className="text-sm">Nombre del nuevo tipo</Label>
                                <div className="flex space-x-2 mt-2">
                                  <Input
                                    id="newCategoryType"
                                    value={newCategoryType}
                                    onChange={(e) => setNewCategoryType(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddNewCategoryType()
                                      }
                                    }}
                                    placeholder="Ej: DECORACIONES"
                                    className="text-sm"
                                  />
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleAddNewCategoryType}
                                    disabled={!newCategoryType.trim()}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Agregar
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setIsAddingNewType(false)
                                      setNewCategoryType("")
                                    }}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  Se convertirá automáticamente a mayúsculas
                                </p>
                              </div>
                            )}

                            {/* Mostrar tipo seleccionado */}
                            {categoryFormData.typeCategory && !isAddingNewType && (
                              <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-sm text-green-700">
                                  <strong>Tipo seleccionado:</strong> {categoryFormData.typeCategory}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Nombre</Label>
                          <Input
                            id="categoryName"
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Ramos de Boda Premium"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="categoryDescription">Descripción</Label>
                          <Textarea
                            id="categoryDescription"
                            value={categoryFormData.description}
                            onChange={(e) => setCategoryFormData((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryPrice">Precio ($)</Label>
                            <Input
                              id="categoryPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={categoryFormData.price}
                              onChange={(e) => setCategoryFormData((prev) => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="categoryFlowers">Máx. Flores</Label>
                            <Input
                              id="categoryFlowers"
                              type="number"
                              min="1"
                              value={categoryFormData.totalQuantityFlowers}
                              onChange={(e) => setCategoryFormData((prev) => ({ ...prev, totalQuantityFlowers: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
                          >
                            {editingCategoryId ? "Actualizar" : "Crear"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetCategoryForm}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Category Stats */}
                <Card className="shadow-sm border-slate-200 mt-6">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Estadísticas de Categorías</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryTypes.map((type) => {
                        const typeCategories = categories.filter((c) => c.typeCategory === type)
                        return (
                          <div key={type} className="flex justify-between">
                            <span className="text-slate-600">{type}:</span>
                            <span className="font-semibold">{typeCategories.length}</span>
                          </div>
                        )
                      })}
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total categorías:</span>
                          <span className="font-semibold text-green-600">{categories.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Flores Tab */}
          <TabsContent value="flowers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Gestión de Flores</h2>
                <p className="text-sm text-slate-600">Administra el catálogo de flores disponibles</p>
              </div>
              <Button
                onClick={() => setIsFlowerCreating(true)}
                className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Flor
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Flowers List */}
              <div className="lg:col-span-2">
                {flowerLoading ? (
                  <Card className="shadow-sm border-slate-200">
                    <CardContent className="flex justify-center items-center h-64">
                      <p className="text-gray-500">Cargando flores...</p>
                    </CardContent>
                  </Card>
                ) : flowerError ? (
                  <Card className="shadow-sm border-slate-200">
                    <CardContent className="flex justify-center items-center h-64">
                      <p className="text-red-600">{flowerError}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="flex items-center text-slate-800">
                        <Flower2 className="w-5 h-5 mr-2 text-rose-600" />
                        Catálogo de Flores
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {flowers.map((flower) => (
                          <div key={flower.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-slate-800">{flower.name}</h3>
                                <Badge className="bg-green-100 text-green-800">
                                  Stock: {flower.amount}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFlowerEdit(flower)}
                                  className="border-slate-200"
                                >
                                  <Edit className="w-3 h-3 mr-1" /> Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFlowerDelete(flower)}
                                  className="border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p>Tipo: <span className="font-medium">{flower.type}</span></p>
                              <p>Precio: <span className="font-medium">${flower.price}</span></p>
                              <p>Descripción: <span className="font-medium">{flower.description}</span></p>
                            </div>
                          </div>
                        ))}
                        {flowers.length === 0 && (
                          <div className="text-center py-8 text-slate-500">
                            <Flower2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No hay flores registradas</p>
                            <p className="text-sm">Agrega tu primera flor al catálogo</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Flower Form */}
              <div>
                {isFlowerCreating && (
                  <Card className="shadow-sm border-slate-200 sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-slate-800">
                        {editingFlowerId ? "Editar Flor" : "Nueva Flor"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleFlowerSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="flowerName">Nombre</Label>
                          <Input
                            id="flowerName"
                            value={flowerFormData.name}
                            onChange={(e) => setFlowerFormData((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="flowerType">Tipo</Label>
                          <Input
                            id="flowerType"
                            value={flowerFormData.type}
                            onChange={(e) => setFlowerFormData((prev) => ({ ...prev, type: e.target.value }))}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="flowerPrice">Precio ($)</Label>
                            <Input
                              id="flowerPrice"
                              type="number"
                              step="0.01"
                              min="0"
                              value={flowerFormData.price}
                              onChange={(e) => setFlowerFormData((prev) => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="flowerAmount">Cantidad</Label>
                            <Input
                              id="flowerAmount"
                              type="number"
                              min="0"
                              value={flowerFormData.amount}
                              onChange={(e) => setFlowerFormData((prev) => ({ ...prev, amount: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="flowerDescription">Descripción</Label>
                          <Textarea
                            id="flowerDescription"
                            value={flowerFormData.description}
                            onChange={(e) => setFlowerFormData((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="flowerImage">URL de Imagen</Label>
                          <Input
                            id="flowerImage"
                            type="url"
                            value={flowerFormData.image}
                            onChange={(e) => setFlowerFormData((prev) => ({ ...prev, image: e.target.value }))}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            required
                          />
                          <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                              La imagen debe ser una URL válida con formato jpg, jpeg, png, gif o webp
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                          >
                            {editingFlowerId ? "Actualizar" : "Crear"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={resetFlowerForm}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Flower Stats */}
                <Card className="shadow-sm border-slate-200 mt-6">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Estadísticas de Flores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total flores:</span>
                        <span className="font-semibold text-rose-600">{flowers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tipos diferentes:</span>
                        <span className="font-semibold">{getUniqueFlowerTypes().length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Stock total:</span>
                        <span className="font-semibold">{flowers.reduce((sum, f) => sum + f.amount, 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
