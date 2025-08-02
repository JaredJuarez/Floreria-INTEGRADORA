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
import { ArrowLeft, Plus, Edit, Trash2, Flower2 } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"
import { apiService } from "@/lib/api"

interface ArrangementManagementProps {
  onNavigate: (screen: Screen) => void
}

interface ArrangementType {
  id: number
  name: string
  description: string
  price: number
  totalQuantityFlowers: number
  typeCategory: string
}

export function ArrangementManagement({ onNavigate }: ArrangementManagementProps) {
  const [categories, setCategories] = useState<ArrangementType[]>([])
  const [categoryTypes, setCategoryTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    totalQuantityFlowers: "",
    typeCategory: "",
  })

  // Cargar tipos de categoría y categorías al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener tipos de categoría
        const typesResponse = await apiService.getCategoryTypes()
        if (!typesResponse.error) {
          setCategoryTypes(typesResponse.data || [])
          if (typesResponse.data && typesResponse.data.length > 0 && !selectedCategory) {
            setSelectedCategory(typesResponse.data[0])
          }
        }

        // Obtener todas las categorías
        const categoriesResponse = await apiService.getCategories()
        if (!categoriesResponse.error) {
          setCategories(categoriesResponse.data || [])
        } else {
          setError("No se pudieron cargar las categorías")
          Swal.fire("Error", categoriesResponse.message || "No se pudieron cargar las categorías", "error")
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError("Error de conexión al servidor")
        Swal.fire("Error", "Error de conexión al servidor", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const categoryData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      totalQuantityFlowers: Number.parseInt(formData.totalQuantityFlowers),
      typeCategory: formData.typeCategory,
    }

    try {
      if (editingId) {
        // Actualizar categoría existente
        const response = await apiService.updateCategory(editingId, categoryData)
        if (!response.error) {
          // Recargar categorías
          const categoriesResponse = await apiService.getCategories()
          if (!categoriesResponse.error) {
            setCategories(categoriesResponse.data || [])
          }
          resetForm()
          Swal.fire("Éxito", "Categoría actualizada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo actualizar la categoría", "error")
        }
      } else {
        // Crear nueva categoría
        const response = await apiService.createCategory(categoryData)
        if (!response.error) {
          // Recargar categorías
          const categoriesResponse = await apiService.getCategories()
          if (!categoriesResponse.error) {
            setCategories(categoriesResponse.data || [])
          }
          resetForm()
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

  const handleEdit = (category: ArrangementType) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description,
      price: category.price.toString(),
      totalQuantityFlowers: category.totalQuantityFlowers.toString(),
      typeCategory: category.typeCategory,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que quieres eliminar esta categoría?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      try {
        const response = await apiService.deleteCategory(id)
        if (!response.error) {
          // Recargar categorías
          const categoriesResponse = await apiService.getCategories()
          if (!categoriesResponse.error) {
            setCategories(categoriesResponse.data || [])
          }
          Swal.fire("Eliminado", "La categoría ha sido eliminada", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo eliminar la categoría", "error")
        }
      } catch (error) {
        console.error('Error deleting category:', error)
        Swal.fire("Error", "Error de conexión al servidor", "error")
      }
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: "", 
      description: "", 
      price: "", 
      totalQuantityFlowers: "", 
      typeCategory: selectedCategory || (categoryTypes[0] || "")
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const filteredCategories = categories.filter((c) => c.typeCategory === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
        </div>
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
                onClick={() => onNavigate("superadmin-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Categorías</h1>
                <p className="text-sm text-slate-600">Administra todas las categorías de productos florales</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setFormData({ ...formData, typeCategory: selectedCategory || (categoryTypes[0] || "") })
                setIsCreating(true)
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Categories List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Flower2 className="w-5 h-5 mr-2 text-rose-600" />
                  Gestión de Categorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-auto bg-slate-100">
                    {categoryTypes.map((type) => (
                      <TabsTrigger
                        key={type}
                        value={type}
                        className="data-[state=active]:bg-white text-sm"
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
                              <Badge className="bg-green-100 text-green-800">
                                Activo
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(category)}
                                className="border-slate-200"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(category.id)}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{category.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-600">
                                <strong>Precio:</strong> ${category.price.toFixed(2)}
                              </span>
                              <span className="text-slate-600">
                                <strong>Máx. flores:</strong> {category.totalQuantityFlowers}
                              </span>
                            </div>
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
          </div>

          {/* Create/Edit Form */}
          <div>
            {isCreating && (
              <Card className="shadow-sm border-slate-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    {editingId ? "Editar Categoría" : "Nueva Categoría"}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos de la categoría" : "Crea una nueva categoría"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="typeCategory">Tipo de Categoría</Label>
                      <select
                        id="typeCategory"
                        title="Selecciona el tipo de categoría"
                        value={formData.typeCategory}
                        onChange={(e) => setFormData((prev) => ({ ...prev, typeCategory: e.target.value }))}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                        required
                      >
                        <option value="">Selecciona un tipo</option>
                        {categoryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre de la categoría</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Ramos de Bodas"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe la categoría..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                          placeholder="35.00"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="totalQuantityFlowers">Cantidad de flores</Label>
                        <Input
                          id="totalQuantityFlowers"
                          type="number"
                          min="1"
                          value={formData.totalQuantityFlowers}
                          onChange={(e) => setFormData((prev) => ({ ...prev, totalQuantityFlowers: e.target.value }))}
                          placeholder="12"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                      >
                        {editingId ? "Actualizar" : "Crear"} Categoría
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="border-slate-200 bg-transparent"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Stats Card */}
            <Card className="shadow-sm border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryTypes.map((type) => {
                    const typeCategories = categories.filter((c) => c.typeCategory === type)
                    return (
                      <div key={type} className="flex justify-between">
                        <span className="text-slate-600">
                          {type}:
                        </span>
                        <span className="font-semibold">
                          {typeCategories.length}
                        </span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total categorías:</span>
                      <span className="font-semibold text-green-600">
                        {categories.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
