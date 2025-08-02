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
import { ArrowLeft, Plus, Edit, Trash2, Grid3X3 } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"
import { apiService } from "@/lib/api"

interface CategoryManagementProps {
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

const productTypes = [
  { id: "RAMO", name: "Ramos", icon: "💐" },
  { id: "CENTRO_MESA", name: "Centros de Mesa", icon: "🌸" },
  { id: "CORONA", name: "Coronas", icon: "🌿" },
  { id: "ARREGLO", name: "Arreglos", icon: "🌺" },
]

export function CategoryManagement({ onNavigate }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedProductType, setSelectedProductType] = useState("RAMO")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    totalQuantityFlowers: "",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await apiService.getCategories()
      if (!response.error) {
        setCategories(response.data || [])
      } else {
        setError(response.message || "Error al cargar las categorías")
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      setError("Error de conexión al servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const categoryData: Category = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      totalQuantityFlowers: Number.parseInt(formData.totalQuantityFlowers),
      typeCategory: selectedProductType,
    }

    try {
      if (editingId) {
        // Actualizar categoría existente
        const response = await apiService.updateCategory(editingId, categoryData)
        if (!response.error) {
          await loadCategories() // Recargar categorías
          resetForm()
          Swal.fire("Éxito", "Categoría actualizada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo actualizar la categoría", "error")
        }
      } else {
        // Crear nueva categoría
        const response = await apiService.createCategory(categoryData)
        if (!response.error) {
          await loadCategories() // Recargar categorías
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

  const handleEdit = (category: Category) => {
    if (category.id) {
      setEditingId(category.id)
      setFormData({
        name: category.name,
        description: category.description,
        price: category.price.toString(),
        totalQuantityFlowers: category.totalQuantityFlowers.toString(),
      })
      setSelectedProductType(category.typeCategory)
      setIsCreating(true)
    }
  }

  const handleDelete = async (category: Category) => {
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
            await loadCategories() // Recargar categorías
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      totalQuantityFlowers: "",
    })
    setEditingId(null)
    setIsCreating(false)
  }

  const filteredCategories = categories.filter((c) => c.typeCategory === selectedProductType)

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
                onClick={() => onNavigate("superadmin-dashboard")}
                className="hover:bg-green-50 hover:text-green-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Panel Admin
              </Button>
              <div className="h-6 w-px bg-green-200" />
              <h1 className="text-xl font-bold text-slate-800">Gestión de Categorías</h1>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
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
            <Tabs value={selectedProductType} onValueChange={setSelectedProductType}>
              <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                {productTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                    onClick={() => setFormData({ ...formData })}
                  >
                    <span className="mr-2">{type.icon}</span>
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {productTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-slate-800 flex items-center">
                        <Grid3X3 className="w-5 h-5 mr-2" />
                        {type.name}
                      </CardTitle>
                      <CardDescription>
                        Gestiona las categorías de {type.name.toLowerCase()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredCategories.map((category) => (
                          <div key={category.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
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
                                  onClick={() => handleEdit(category)}
                                  className="border-slate-200"
                                >
                                  <Edit className="w-3 h-3 mr-1" /> Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(category)}
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
                            <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No hay categorías en esta sección</p>
                            <p className="text-sm">Crea tu primera categoría</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Create / Edit Form */}
          {isCreating && (
            <div>
              <Card className="shadow-sm border-slate-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-slate-800">{editingId ? "Editar" : "Nueva"} Categoría</CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos de la categoría" : "Crea una nueva categoría"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalQuantityFlowers">Máximo de Flores</Label>
                      <Input
                        id="totalQuantityFlowers"
                        type="number"
                        value={formData.totalQuantityFlowers}
                        onChange={(e) => setFormData((prev) => ({ ...prev, totalQuantityFlowers: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Categoría</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {productTypes.map((type) => (
                          <Button
                            key={type.id}
                            type="button"
                            variant={selectedProductType === type.id ? "default" : "outline"}
                            onClick={() => setSelectedProductType(type.id)}
                            className="h-auto p-3 flex-col items-center"
                          >
                            <span className="text-lg mb-1">{type.icon}</span>
                            <span className="text-xs">{type.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
