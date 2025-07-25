"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Mail, Phone, Edit, Save, X, Star, Package, Clock } from "lucide-react"
import type { Screen } from "@/app/page"

interface FloristProfileProps {
  onNavigate: (screen: Screen) => void
}

export function FloristProfile({ onNavigate }: FloristProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "Carmen López García",
    email: "carmen.lopez@floralcraft.com",
    phone: "+1 234 567 8901",
    joinDate: "2023-01-15",
    completedOrders: 156,
    rating: 4.8,
    specialties: ["Ramos de novia", "Centros de mesa", "Arreglos fúnebres"],
    status: "Activo",
  })

  const [editData, setEditData] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    phone: profileData.phone,
  })

  const handleSave = () => {
    setProfileData((prev) => ({
      ...prev,
      fullName: editData.fullName,
      email: editData.email,
      phone: editData.phone,
    }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
    })
    setIsEditing(false)
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
                onClick={() => onNavigate("florist-dashboard")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Mi Perfil</h1>
                <p className="text-sm text-slate-600">Administra tu información profesional</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <User className="w-5 h-5 mr-2 text-rose-600" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  {isEditing ? "Edita tu información personal" : "Tu información profesional registrada"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre completo</Label>
                      <Input
                        id="fullName"
                        value={editData.fullName}
                        onChange={(e) => setEditData((prev) => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="border-slate-200 bg-transparent">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                      <User className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-800">{profileData.fullName}</p>
                        <p className="text-sm text-slate-600">Nombre completo</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-800">{profileData.email}</p>
                        <p className="text-sm text-slate-600">Correo electrónico</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-800">{profileData.phone}</p>
                        <p className="text-sm text-slate-600">Teléfono</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-800">Miembro desde {profileData.joinDate}</p>
                        <p className="text-sm text-slate-600">Fecha de ingreso</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="shadow-sm border-slate-200 mt-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Especialidades</CardTitle>
                <CardDescription>Tipos de arreglos en los que te especializas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.map((specialty, index) => (
                    <Badge key={index} className="bg-rose-100 text-rose-800">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{profileData.completedOrders}</p>
                    <p className="text-sm text-slate-600">Pedidos completados</p>
                  </div>

                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">{profileData.rating}</p>
                    <p className="text-sm text-slate-600">Calificación promedio</p>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Badge
                      className={
                        profileData.status === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {profileData.status}
                    </Badge>
                    <p className="text-sm text-slate-600 mt-2">Estado actual</p>
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
