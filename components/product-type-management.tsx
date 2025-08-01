"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Package } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"

interface ProductTypeManagementProps {
  onNavigate: (screen: Screen) => void
}

interface ProductType {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
}

const initialProductTypes: ProductType[] = [
  {
    id: "bouquet",
    name: "Ramos",
    description: "Arreglos florales en forma de ramo para ocasiones especiales",
    icon: "💐",
    isActive: true,
  },
  {
    id: "centerpiece",
    name: "Centros de Mesa",
    description: "Arreglos decorativos para mesas en eventos y celebraciones",
    icon: "🌸",
    isActive: true,
  },
  {
    id: "wreath",
    name: "Coronas",
    description: "Arreglos circulares para ceremonias y eventos especiales",
    icon: "🌿",
    isActive: true,
  },
  {
    id: "arrangement",
    name: "Arreglos",
    description: "Composiciones florales decorativas para espacios",
    icon: "🌺",
    isActive: true,
  },
]

export function ProductTypeManagement({ onNavigate }: ProductTypeManagementProps) {
  const [productTypes, setProductTypes] = useState<ProductType[]>(initialProductTypes)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newProductType: ProductType = {
      id: editingId || formData.name.toLowerCase().replace(/\s+/g, "-"),
      name: formData.name,
      description: formData.description,
      icon: formData.icon,
      isActive: true,
    }

    if (editingId) {
      setProductTypes((prev) => prev.map((pt) => (pt.id === editingId ? newProductType : pt)))
    } else {
      setProductTypes((prev) => [...prev, newProductType])
    }

    resetForm()
  }

  const handleEdit = (productType: ProductType) => {
    setEditingId(productType.id)
    setFormData({
      name: productType.name,
      description: productType.description,
      icon: productType.icon,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que quieres eliminar este tipo de producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      setProductTypes((prev) => prev.filter((pt) => pt.id !== id))
      Swal.fire("Eliminado", "El tipo de producto ha sido eliminado", "success")
    }
  }

  const toggleActive = (id: string) => {
    setProductTypes((prev) => prev.map((pt) => (pt.id === id ? { ...pt, isActive: !pt.isActive } : pt)))
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", icon: "" })
    setIsCreating(false)
    setEditingId(null)
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
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Tipos de Producto</h1>
                <p className="text-sm text-slate-600">Administra los tipos base de productos disponibles</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tipo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Types List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Tipos de Producto ({productTypes.length})
                </CardTitle>
                <CardDescription>Lista de tipos base de productos disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productTypes.map((productType) => (
                    <div
                      key={productType.id}
                      className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-blue-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{productType.icon}</div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{productType.name}</h3>
                            <Badge
                              className={
                                productType.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }
                            >
                              {productType.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(productType)}
                            className="border-slate-200 text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(productType.id)}
                            className={
                              productType.isActive
                                ? "border-yellow-200 text-yellow-700 text-xs"
                                : "border-green-200 text-green-700 text-xs"
                            }
                          >
                            {productType.isActive ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(productType.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50 text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{productType.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create/Edit Form */}
          <div>
            {isCreating && (
              <Card className="shadow-sm border-slate-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    {editingId ? "Editar Tipo de Producto" : "Nuevo Tipo de Producto"}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos del tipo de producto" : "Crea un nuevo tipo de producto"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del tipo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Ramos"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe el tipo de producto..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icono (emoji)</Label>
                      <Input
                        id="icon"
                        value={formData.icon}
                        onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                        placeholder="💐"
                        maxLength={2}
                        required
                      />
                      <p className="text-xs text-slate-500">Usa un emoji para representar este tipo de producto</p>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
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
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total tipos:</span>
                    <span className="font-semibold">{productTypes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Activos:</span>
                    <span className="font-semibold text-green-600">
                      {productTypes.filter((pt) => pt.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inactivos:</span>
                    <span className="font-semibold text-gray-600">
                      {productTypes.filter((pt) => !pt.isActive).length}
                    </span>
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
