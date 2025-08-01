"use client"

import type React from "react"

import { useState } from "react"
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

interface CategoryManagementProps {
  onNavigate: (screen: Screen) => void
}

interface Category {
  id: string
  name: string
  description: string
  price: number
  maxFlowers: number
  allowedFlowerTypes: string[]
  productType: string
  isActive: boolean
}

const initialCategories: Category[] = [
  // Ramos
  {
    id: "1",
    name: "Ramo Clásico",
    description: "Ramo tradicional perfecto para cualquier ocasión",
    price: 35.0,
    maxFlowers: 12,
    allowedFlowerTypes: ["roses", "tulips", "lilies"],
    productType: "bouquet",
    isActive: true,
  },
  {
    id: "2",
    name: "Ramo Premium",
    description: "Ramo elegante con flores de alta calidad",
    price: 65.0,
    maxFlowers: 18,
    allowedFlowerTypes: ["roses", "orchids", "lilies", "peonies"],
    productType: "bouquet",
    isActive: true,
  },
  // Centros de Mesa
  {
    id: "4",
    name: "Centro Clásico",
    description: "Centro de mesa tradicional para eventos",
    price: 45.0,
    maxFlowers: 15,
    allowedFlowerTypes: ["roses", "carnations", "baby_breath"],
    productType: "centerpiece",
    isActive: true,
  },
  // Coronas
  {
    id: "7",
    name: "Corona Clásica",
    description: "Corona tradicional para ceremonias",
    price: 55.0,
    maxFlowers: 20,
    allowedFlowerTypes: ["chrysanthemums", "roses", "lilies"],
    productType: "wreath",
    isActive: true,
  },
]

const productTypes = [
  { id: "bouquet", name: "Ramos", icon: "💐" },
  { id: "centerpiece", name: "Centros de Mesa", icon: "🌸" },
  { id: "wreath", name: "Coronas", icon: "🌿" },
  { id: "arrangement", name: "Arreglos", icon: "🌺" },
]

const flowerTypes = [
  { id: "roses", name: "Rosas" },
  { id: "tulips", name: "Tulipanes" },
  { id: "lilies", name: "Lirios" },
  { id: "orchids", name: "Orquídeas" },
  { id: "sunflowers", name: "Girasoles" },
  { id: "carnations", name: "Claveles" },
  { id: "chrysanthemums", name: "Crisantemos" },
  { id: "peonies", name: "Peonías" },
  { id: "baby_breath", name: "Aliento de Bebé" },
]

export function CategoryManagement({ onNavigate }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedProductType, setSelectedProductType] = useState("bouquet")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxFlowers: "",
    allowedFlowerTypes: [] as string[],
    productType: "bouquet",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCategory: Category = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      maxFlowers: Number.parseInt(formData.maxFlowers),
      allowedFlowerTypes: formData.allowedFlowerTypes,
      productType: formData.productType,
      isActive: true,
    }

    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id === editingId ? newCategory : c)))
    } else {
      setCategories((prev) => [...prev, newCategory])
    }

    resetForm()
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      description: category.description,
      price: category.price.toString(),
      maxFlowers: category.maxFlowers.toString(),
      allowedFlowerTypes: category.allowedFlowerTypes,
      productType: category.productType,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
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
      setCategories((prev) => prev.filter((c) => c.id !== id))
      Swal.fire("Eliminado", "La categoría ha sido eliminada", "success")
    }
  }

  const toggleActive = (id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      maxFlowers: "",
      allowedFlowerTypes: [],
      productType: selectedProductType,
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleFlowerTypeToggle = (flowerTypeId: string) => {
    setFormData((prev) => ({
      ...prev,
      allowedFlowerTypes: prev.allowedFlowerTypes.includes(flowerTypeId)
        ? prev.allowedFlowerTypes.filter((id) => id !== flowerTypeId)
        : [...prev.allowedFlowerTypes, flowerTypeId],
    }))
  }

  const filteredCategories = categories.filter((c) => c.productType === selectedProductType)

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
                <p className="text-sm text-slate-600">Administra los subtipos de arreglos con precios y límites</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setFormData({ ...formData, productType: selectedProductType })
                setIsCreating(true)
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
                  <Grid3X3 className="w-5 h-5 mr-2 text-blue-600" />
                  Categorías por Tipo de Producto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedProductType} onValueChange={setSelectedProductType} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                    {productTypes.map((type) => (
                      <TabsTrigger key={type.id} value={type.id} className="data-[state=active]:bg-white text-sm">
                        <span className="mr-1">{type.icon}</span>
                        {type.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {productTypes.map((type) => (
                    <TabsContent key={type.id} value={type.id} className="space-y-4">
                      {filteredCategories.map((category) => (
                        <div
                          key={category.id}
                          className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-slate-800">{category.name}</h3>
                              <Badge
                                className={
                                  category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }
                              >
                                {category.isActive ? "Activo" : "Inactivo"}
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
                                onClick={() => toggleActive(category.id)}
                                className={
                                  category.isActive
                                    ? "border-yellow-200 text-yellow-700"
                                    : "border-green-200 text-green-700"
                                }
                              >
                                {category.isActive ? "Desactivar" : "Activar"}
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
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-600">
                                <strong>Precio:</strong> ${category.price.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-600">
                                <strong>Máx. flores:</strong> {category.maxFlowers}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-slate-600 text-sm">
                              <strong>Tipos de flores permitidas:</strong>
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {category.allowedFlowerTypes.map((typeId) => {
                                const flowerType = flowerTypes.find((ft) => ft.id === typeId)
                                return (
                                  <Badge key={typeId} className="bg-blue-100 text-blue-800 text-xs">
                                    {flowerType?.name}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredCategories.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          No hay categorías de {type.name.toLowerCase()} creadas aún
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
                  <CardTitle className="text-slate-800">{editingId ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos de la categoría" : "Crea una nueva categoría de arreglo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="productType">Tipo de Producto</Label>
                      <select
                        id="productType"
                        value={formData.productType}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productType: e.target.value }))}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                        required
                      >
                        {productTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
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
                        placeholder="Ej: Ramo Clásico"
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
                        <Label htmlFor="maxFlowers">Máx. flores</Label>
                        <Input
                          id="maxFlowers"
                          type="number"
                          min="1"
                          value={formData.maxFlowers}
                          onChange={(e) => setFormData((prev) => ({ ...prev, maxFlowers: e.target.value }))}
                          placeholder="12"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipos de flores permitidas</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-slate-200 rounded-md p-2">
                        {flowerTypes.map((flowerType) => (
                          <label key={flowerType.id} className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.allowedFlowerTypes.includes(flowerType.id)}
                              onChange={() => handleFlowerTypeToggle(flowerType.id)}
                              className="rounded border-slate-300"
                            />
                            <span>{flowerType.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
                  {productTypes.map((type) => {
                    const typeCategories = categories.filter((c) => c.productType === type.id)
                    const activeCategories = typeCategories.filter((c) => c.isActive)
                    return (
                      <div key={type.id} className="flex justify-between">
                        <span className="text-slate-600">
                          {type.icon} {type.name}:
                        </span>
                        <span className="font-semibold">
                          {activeCategories.length}/{typeCategories.length}
                        </span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total activas:</span>
                      <span className="font-semibold text-green-600">
                        {categories.filter((c) => c.isActive).length}
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
