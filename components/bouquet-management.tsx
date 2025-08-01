"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Flower2 } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"

interface BouquetManagementProps {
  onNavigate: (screen: Screen) => void
}

interface BouquetType {
  id: string
  name: string
  description: string
  price: number
  maxFlowers: number
  isActive: boolean
}

const initialBouquetTypes: BouquetType[] = [
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
]

export function BouquetManagement({ onNavigate }: BouquetManagementProps) {
  const [bouquetTypes, setBouquetTypes] = useState<BouquetType[]>(initialBouquetTypes)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    maxFlowers: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newBouquet: BouquetType = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      maxFlowers: Number.parseInt(formData.maxFlowers),
      isActive: true,
    }

    if (editingId) {
      setBouquetTypes((prev) => prev.map((b) => (b.id === editingId ? newBouquet : b)))
    } else {
      setBouquetTypes((prev) => [...prev, newBouquet])
    }

    resetForm()
  }

  const handleEdit = (bouquet: BouquetType) => {
    setEditingId(bouquet.id)
    setFormData({
      name: bouquet.name,
      description: bouquet.description,
      price: bouquet.price.toString(),
      maxFlowers: bouquet.maxFlowers.toString(),
    })
    setIsCreating(true)
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Estás seguro de que quieres eliminar este tipo de ramo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    })

    if (result.isConfirmed) {
      setBouquetTypes((prev) => prev.filter((b) => b.id !== id))
      Swal.fire("Eliminado", "El tipo de ramo ha sido eliminado", "success")
    }
  }

  const toggleActive = (id: string) => {
    setBouquetTypes((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)))
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", maxFlowers: "" })
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
                onClick={() => onNavigate("admin-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Tipos de Ramos</h1>
                <p className="text-sm text-slate-600">Administra los tipos de ramos disponibles</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Tipo de Ramo
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bouquet Types List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Flower2 className="w-5 h-5 mr-2 text-rose-600" />
                  Tipos de Ramos ({bouquetTypes.length})
                </CardTitle>
                <CardDescription>Lista de todos los tipos de ramos disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bouquetTypes.map((bouquet) => (
                    <div key={bouquet.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-slate-800">{bouquet.name}</h3>
                          <Badge
                            className={bouquet.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {bouquet.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(bouquet)}
                            className="border-slate-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(bouquet.id)}
                            className={
                              bouquet.isActive ? "border-yellow-200 text-yellow-700" : "border-green-200 text-green-700"
                            }
                          >
                            {bouquet.isActive ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(bouquet.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{bouquet.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-600">
                            <strong>Precio:</strong> ${bouquet.price.toFixed(2)}
                          </span>
                          <span className="text-slate-600">
                            <strong>Máx. flores:</strong> {bouquet.maxFlowers}
                          </span>
                        </div>
                      </div>
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
                    {editingId ? "Editar Tipo de Ramo" : "Nuevo Tipo de Ramo"}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos del tipo de ramo" : "Crea un nuevo tipo de ramo"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del ramo</Label>
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
                        placeholder="Describe el tipo de ramo..."
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
                        {editingId ? "Actualizar" : "Crear"} Tipo de Ramo
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
                    <span className="font-semibold">{bouquetTypes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Activos:</span>
                    <span className="font-semibold text-green-600">
                      {bouquetTypes.filter((b) => b.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inactivos:</span>
                    <span className="font-semibold text-gray-600">
                      {bouquetTypes.filter((b) => !b.isActive).length}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Precio promedio:</span>
                      <span className="font-semibold">
                        ${(bouquetTypes.reduce((sum, b) => sum + b.price, 0) / bouquetTypes.length).toFixed(2)}
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
