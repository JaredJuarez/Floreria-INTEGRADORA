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
import { ArrowLeft, Plus, Edit, Trash2, Flower2 } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"

interface ArrangementManagementProps {
  onNavigate: (screen: Screen) => void
}

interface ArrangementType {
  id: string
  name: string
  description: string
  price: number
  maxFlowers: number
  category: string
  isActive: boolean
}

const initialArrangementTypes: ArrangementType[] = [
  // Ramos
  {
    id: "1",
    name: "Ramo Clásico",
    description: "Ramo tradicional perfecto para cualquier ocasión",
    price: 35.0,
    maxFlowers: 12,
    category: "bouquet",
    isActive: true,
  },
  {
    id: "2",
    name: "Ramo Premium",
    description: "Ramo elegante con flores de alta calidad",
    price: 65.0,
    maxFlowers: 18,
    category: "bouquet",
    isActive: true,
  },
  {
    id: "3",
    name: "Ramo Deluxe",
    description: "Ramo exclusivo con las mejores flores disponibles",
    price: 95.0,
    maxFlowers: 24,
    category: "bouquet",
    isActive: true,
  },
  // Centros de Mesa
  {
    id: "4",
    name: "Centro Clásico",
    description: "Centro de mesa tradicional para eventos",
    price: 45.0,
    maxFlowers: 15,
    category: "centerpiece",
    isActive: true,
  },
  {
    id: "5",
    name: "Centro Premium",
    description: "Centro de mesa elegante para ocasiones especiales",
    price: 75.0,
    maxFlowers: 22,
    category: "centerpiece",
    isActive: true,
  },
  {
    id: "6",
    name: "Centro Deluxe",
    description: "Centro de mesa exclusivo para eventos de lujo",
    price: 120.0,
    maxFlowers: 30,
    category: "centerpiece",
    isActive: true,
  },
  // Coronas
  {
    id: "7",
    name: "Corona Clásica",
    description: "Corona tradicional para ceremonias",
    price: 55.0,
    maxFlowers: 20,
    category: "wreath",
    isActive: true,
  },
  {
    id: "8",
    name: "Corona Premium",
    description: "Corona elegante con flores selectas",
    price: 85.0,
    maxFlowers: 28,
    category: "wreath",
    isActive: true,
  },
  {
    id: "9",
    name: "Corona Deluxe",
    description: "Corona exclusiva para ocasiones especiales",
    price: 130.0,
    maxFlowers: 35,
    category: "wreath",
    isActive: true,
  },
  // Arreglos
  {
    id: "10",
    name: "Arreglo Clásico",
    description: "Arreglo floral tradicional para decoración",
    price: 40.0,
    maxFlowers: 14,
    category: "arrangement",
    isActive: true,
  },
  {
    id: "11",
    name: "Arreglo Premium",
    description: "Arreglo floral elegante para espacios especiales",
    price: 70.0,
    maxFlowers: 20,
    category: "arrangement",
    isActive: true,
  },
  {
    id: "12",
    name: "Arreglo Deluxe",
    description: "Arreglo floral exclusivo para decoración de lujo",
    price: 110.0,
    maxFlowers: 26,
    category: "arrangement",
    isActive: true,
  },
]

const categories = [
  { id: "bouquet", name: "Ramos", icon: "💐" },
  { id: "centerpiece", name: "Centros de Mesa", icon: "🌸" },
  { id: "wreath", name: "Coronas", icon: "🌿" },
  { id: "arrangement", name: "Arreglos", icon: "🌺" },
]

export function ArrangementManagement({ onNavigate }: ArrangementManagementProps) {
  const [arrangementTypes, setArrangementTypes] = useState<ArrangementType[]>(initialArrangementTypes)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("bouquet")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxFlowers: "",
    category: "bouquet",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newArrangement: ArrangementType = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      maxFlowers: Number.parseInt(formData.maxFlowers),
      category: formData.category,
      isActive: true,
    }

    if (editingId) {
      setArrangementTypes((prev) => prev.map((a) => (a.id === editingId ? newArrangement : a)))
    } else {
      setArrangementTypes((prev) => [...prev, newArrangement])
    }

    resetForm()
  }

  const handleEdit = (arrangement: ArrangementType) => {
    setEditingId(arrangement.id)
    setFormData({
      name: arrangement.name,
      description: arrangement.description,
      price: arrangement.price.toString(),
      maxFlowers: arrangement.maxFlowers.toString(),
      category: arrangement.category,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que quieres eliminar este tipo de arreglo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      setArrangementTypes((prev) => prev.filter((a) => a.id !== id))
      Swal.fire("Eliminado", "El tipo de arreglo ha sido eliminado", "success")
    }
  }

  const toggleActive = (id: string) => {
    setArrangementTypes((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)))
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", maxFlowers: "", category: selectedCategory })
    setIsCreating(false)
    setEditingId(null)
  }

  const filteredArrangements = arrangementTypes.filter((a) => a.category === selectedCategory)

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
                onClick={() => onNavigate("admin-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Tipos de Arreglos</h1>
                <p className="text-sm text-slate-600">Administra todos los tipos de arreglos disponibles</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setFormData({ ...formData, category: selectedCategory })
                setIsCreating(true)
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tipo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Arrangement Types List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Flower2 className="w-5 h-5 mr-2 text-rose-600" />
                  Tipos de Arreglos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-100">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-white text-sm"
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((category) => (
                    <TabsContent key={category.id} value={category.id} className="space-y-4">
                      {filteredArrangements.map((arrangement) => (
                        <div
                          key={arrangement.id}
                          className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-slate-800">{arrangement.name}</h3>
                              <Badge
                                className={
                                  arrangement.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }
                              >
                                {arrangement.isActive ? "Activo" : "Inactivo"}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(arrangement)}
                                className="border-slate-200"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleActive(arrangement.id)}
                                className={
                                  arrangement.isActive
                                    ? "border-yellow-200 text-yellow-700"
                                    : "border-green-200 text-green-700"
                                }
                              >
                                {arrangement.isActive ? "Desactivar" : "Activar"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(arrangement.id)}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{arrangement.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-slate-600">
                                <strong>Precio:</strong> ${arrangement.price.toFixed(2)}
                              </span>
                              <span className="text-slate-600">
                                <strong>Máx. flores:</strong> {arrangement.maxFlowers}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredArrangements.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          No hay tipos de {category.name.toLowerCase()} creados aún
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
                    {editingId ? "Editar Tipo de Arreglo" : "Nuevo Tipo de Arreglo"}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos del tipo de arreglo" : "Crea un nuevo tipo de arreglo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del arreglo</Label>
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
                        placeholder="Describe el tipo de arreglo..."
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

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                      >
                        {editingId ? "Actualizar" : "Crear"} Tipo
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
                  {categories.map((category) => {
                    const categoryTypes = arrangementTypes.filter((a) => a.category === category.id)
                    const activeTypes = categoryTypes.filter((a) => a.isActive)
                    return (
                      <div key={category.id} className="flex justify-between">
                        <span className="text-slate-600">
                          {category.icon} {category.name}:
                        </span>
                        <span className="font-semibold">
                          {activeTypes.length}/{categoryTypes.length}
                        </span>
                      </div>
                    )
                  })}
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total activos:</span>
                      <span className="font-semibold text-green-600">
                        {arrangementTypes.filter((a) => a.isActive).length}
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
