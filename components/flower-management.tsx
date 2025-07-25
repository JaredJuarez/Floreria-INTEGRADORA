"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Flower2 } from "lucide-react"
import type { Screen } from "@/app/page"

interface FlowerManagementProps {
  onNavigate: (screen: Screen) => void
}

interface Flower {
  id: string
  name: string
  color: string
  inStock: boolean
}

const initialFlowers: Flower[] = [
  { id: "1", name: "Rosa Roja", color: "Rojo", inStock: true },
  { id: "2", name: "Rosa Blanca", color: "Blanco", inStock: true },
  { id: "3", name: "Orquídea Morada", color: "Morado", inStock: false },
]

export function FlowerManagement({ onNavigate }: FlowerManagementProps) {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", color: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newFlower: Flower = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      color: formData.color,
      inStock: true,
    }

    if (editingId) {
      setFlowers((prev) => prev.map((f) => (f.id === editingId ? newFlower : f)))
    } else {
      setFlowers((prev) => [...prev, newFlower])
    }
    resetForm()
  }

  const handleEdit = (flower: Flower) => {
    setEditingId(flower.id)
    setFormData({ name: flower.name, color: flower.color })
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta flor?")) {
      setFlowers((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const toggleStock = (id: string) => {
    setFlowers((prev) => prev.map((f) => (f.id === id ? { ...f, inStock: !f.inStock } : f)))
  }

  const resetForm = () => {
    setFormData({ name: "", color: "" })
    setEditingId(null)
    setIsCreating(false)
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
                          <Badge className={flower.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {flower.inStock ? "En stock" : "Agotado"}
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
                            onClick={() => toggleStock(flower.id)}
                            className={
                              flower.inStock ? "border-yellow-200 text-yellow-700" : "border-green-200 text-green-700"
                            }
                          >
                            {flower.inStock ? "Marcar agotado" : "Marcar en stock"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(flower.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Color: <span className="font-medium">{flower.color}</span>
                      </p>
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
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
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
