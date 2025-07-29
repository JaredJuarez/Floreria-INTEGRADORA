"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Edit, Trash2, Users, Phone, Mail, User } from "lucide-react"
import type { Screen } from "@/app/page"

interface FloristManagementProps {
  onNavigate: (screen: Screen) => void
}

interface Florist {
  id: string
  fullName: string
  phone: string
  email: string
  isActive: boolean
  joinDate: string
  completedOrders: number
  rating: number
}

const initialFlorists: Florist[] = [
  {
    id: "1",
    fullName: "Carmen López García",
    phone: "+1 234 567 8901",
    email: "carmen.lopez@FLOREVER.com",
    isActive: true,
    joinDate: "2023-01-15",
    completedOrders: 156,
    rating: 4.8,
  },
  {
    id: "2",
    fullName: "María Elena Rodríguez",
    phone: "+1 234 567 8902",
    email: "maria.rodriguez@FLOREVER.com",
    isActive: true,
    joinDate: "2023-03-20",
    completedOrders: 98,
    rating: 4.6,
  },
  {
    id: "3",
    fullName: "Ana Sofía Martínez",
    phone: "+1 234 567 8903",
    email: "ana.martinez@FLOREVER.com",
    isActive: false,
    joinDate: "2023-06-10",
    completedOrders: 45,
    rating: 4.3,
  },
  {
    id: "4",
    fullName: "Isabella Torres Vega",
    phone: "+1 234 567 8904",
    email: "isabella.torres@FLOREVER.com",
    isActive: true,
    joinDate: "2023-08-05",
    completedOrders: 67,
    rating: 4.7,
  },
]

export function FloristManagement({ onNavigate }: FloristManagementProps) {
  const [florists, setFlorists] = useState<Florist[]>(initialFlorists)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newFlorist: Florist = {
      id: editingId || Date.now().toString(),
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      isActive: true,
      joinDate: new Date().toISOString().split("T")[0],
      completedOrders: 0,
      rating: 0,
    }

    if (editingId) {
      setFlorists((prev) =>
        prev.map((f) => (f.id === editingId ? { ...prev.find((p) => p.id === editingId)!, ...newFlorist } : f)),
      )
    } else {
      setFlorists((prev) => [...prev, newFlorist])
    }

    resetForm()
  }

  const handleEdit = (florist: Florist) => {
    setEditingId(florist.id)
    setFormData({
      fullName: florist.fullName,
      phone: florist.phone,
      email: florist.email,
    })
    setIsCreating(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este florista?")) {
      setFlorists((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setFlorists((prev) => prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)))
  }

  const resetForm = () => {
    setFormData({ fullName: "", phone: "", email: "" })
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
                <h1 className="text-xl font-serif font-semibold text-slate-800">Gestión de Floristas</h1>
                <p className="text-sm text-slate-600">Administra los floristas y sus datos de contacto</p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Florista
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Florists List */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Lista de Floristas ({florists.length})
                </CardTitle>
                <CardDescription>Todos los floristas registrados en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {florists.map((florist) => (
                    <div key={florist.id} className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{florist.fullName}</h3>
                            <p className="text-sm text-slate-600">Miembro desde {florist.joinDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={florist.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {florist.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(florist)}
                            className="border-slate-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(florist.id)}
                            className={
                              florist.isActive ? "border-yellow-200 text-yellow-700" : "border-green-200 text-green-700"
                            }
                          >
                            {florist.isActive ? "Desactivar" : "Activar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(florist.id)}
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{florist.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">{florist.email}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-slate-800">{florist.completedOrders}</p>
                          <p className="text-xs text-slate-600">Pedidos completados</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-slate-800">
                            {florist.rating > 0 ? florist.rating.toFixed(1) : "N/A"}
                          </p>
                          <p className="text-xs text-slate-600">Calificación promedio</p>
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
                  <CardTitle className="text-slate-800">{editingId ? "Editar Florista" : "Nuevo Florista"}</CardTitle>
                  <CardDescription>
                    {editingId ? "Modifica los datos del florista" : "Registra un nuevo florista en el sistema"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Ej: Carmen López García"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 234 567 8900"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="florista@FLOREVER.com"
                        required
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      >
                        {editingId ? "Actualizar" : "Crear"} Florista
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
                    <span className="text-slate-600">Total floristas:</span>
                    <span className="font-semibold">{florists.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Activos:</span>
                    <span className="font-semibold text-green-600">{florists.filter((f) => f.isActive).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inactivos:</span>
                    <span className="font-semibold text-gray-600">{florists.filter((f) => !f.isActive).length}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pedidos totales:</span>
                      <span className="font-semibold">{florists.reduce((sum, f) => sum + f.completedOrders, 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Calificación promedio:</span>
                    <span className="font-semibold">
                      {(
                        florists.filter((f) => f.rating > 0).reduce((sum, f) => sum + f.rating, 0) /
                        florists.filter((f) => f.rating > 0).length
                      ).toFixed(1)}
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
