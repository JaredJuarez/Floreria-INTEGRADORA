"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Flower2 } from "lucide-react"
import type { Screen } from "@/app/page"
import Swal from "sweetalert2"
import { apiService } from "@/lib/api"

interface FlowerManagementProps {
  onNavigate: (screen: Screen) => void
}

interface Flower {
  id: number
  name: string
  type: string
  price: number
  amount: number
  description: string
  image: string
}

export function FlowerManagement({ onNavigate }: FlowerManagementProps) {
  const [flowers, setFlowers] = useState<Flower[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ 
    name: "", 
    type: "", 
    price: "", 
    amount: "", 
    description: "", 
    image: "" 
  })

  // Cargar flores al iniciar
  useEffect(() => {
    const fetchFlowers = async () => {
      try {
        setLoading(true)
        const response = await apiService.getAllFlowers()
        if (!response.error) {
          setFlowers(response.data || [])
        } else {
          setError("No se pudieron cargar las flores")
          Swal.fire("Error", response.message || "No se pudieron cargar las flores", "error")
        }
      } catch (err) {
        console.error('Error fetching flowers:', err)
        setError("Error de conexión al servidor")
        Swal.fire("Error", "Error de conexión al servidor", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchFlowers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const flowerData = {
      name: formData.name,
      type: formData.type,
      price: Number.parseFloat(formData.price),
      amount: Number.parseInt(formData.amount),
      description: formData.description,
      image: formData.image,
    }

    try {
      if (editingId) {
        // Actualizar flor existente
        const response = await apiService.updateFlower({
          id: editingId,
          ...flowerData
        })
        if (!response.error) {
          // Recargar flores
          const flowersResponse = await apiService.getAllFlowers()
          if (!flowersResponse.error) {
            setFlowers(flowersResponse.data || [])
          }
          resetForm()
          Swal.fire("Éxito", "Flor actualizada correctamente", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo actualizar la flor", "error")
        }
      } else {
        // Crear nueva flor
        const response = await apiService.createFlower(flowerData)
        if (!response.error) {
          // Recargar flores
          const flowersResponse = await apiService.getAllFlowers()
          if (!flowersResponse.error) {
            setFlowers(flowersResponse.data || [])
          }
          resetForm()
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

  const handleEdit = (flower: Flower) => {
    setEditingId(flower.id)
    setFormData({ 
      name: flower.name, 
      type: flower.type,
      price: flower.price.toString(),
      amount: flower.amount.toString(),
      description: flower.description,
      image: flower.image
    })
    setIsCreating(true)
  }

  const handleDelete = async (flower: Flower) => {
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
        const response = await apiService.deleteFlower(flower)
        if (!response.error) {
          // Recargar flores
          const flowersResponse = await apiService.getAllFlowers()
          if (!flowersResponse.error) {
            setFlowers(flowersResponse.data || [])
          }
          Swal.fire("Eliminado", "La flor ha sido eliminada", "success")
        } else {
          Swal.fire("Error", response.message || "No se pudo eliminar la flor", "error")
        }
      } catch (error) {
        console.error('Error deleting flower:', error)
        Swal.fire("Error", "Error de conexión al servidor", "error")
      }
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: "", 
      type: "", 
      price: "", 
      amount: "", 
      description: "", 
      image: "" 
    })
    setIsCreating(false)
    setEditingId(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Cargando flores...</p>
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
              <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Flores</h1>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Flor
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flower List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Flower2 className="w-5 h-5 mr-2 text-rose-600" />
                  Catálogo de Flores ({flowers.length})
                </CardTitle>
                <CardDescription>Lista de flores disponibles en inventario</CardDescription>
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
                            onClick={() => handleEdit(flower)}
                            className="border-slate-200"
                          >
                            <Edit className="w-3 h-3 mr-1" /> Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(flower)}
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create / Edit Form */}
          {isCreating && (
            <div>
              <Card className="shadow-sm border-slate-200 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-slate-800">{editingId ? "Editar" : "Nueva"} Flor</CardTitle>
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
                      <Label htmlFor="type">Tipo</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio</Label>
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
                      <Label htmlFor="amount">Cantidad</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">URL de Imagen</Label>
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                      >
                        {editingId ? "Actualizar" : "Crear"} Flor
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
