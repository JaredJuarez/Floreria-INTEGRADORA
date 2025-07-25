"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Mail, Phone, Edit, Save, X, Eye, Package } from "lucide-react"
import type { Screen } from "@/app/page"

interface ClientProfileProps {
  onNavigate: (screen: Screen) => void
  onOrderSelect: (order: any) => void
}

const orderHistory = [
  {
    id: "ORD-001",
    type: "Ramo de Rosas",
    status: "Completado",
    date: "2024-01-15",
    deliveryDate: "2024-01-17",
    total: "$45.00",
    statusColor: "bg-green-100 text-green-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-002",
    type: "Centro de Mesa",
    status: "En proceso",
    date: "2024-01-10",
    deliveryDate: "2024-01-18",
    total: "$75.00",
    statusColor: "bg-yellow-100 text-yellow-800",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "ORD-003",
    type: "Arreglo Personalizado",
    status: "Entregado",
    date: "2024-01-08",
    deliveryDate: "2024-01-12",
    total: "$120.00",
    statusColor: "bg-blue-100 text-blue-800",
    image: "/placeholder.svg?height=80&width=80",
  },
]

export function ClientProfile({ onNavigate, onOrderSelect }: ClientProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+1 234 567 8900",
    password: "••••••••",
    memberSince: "2023-01-15",
    totalOrders: 12,
    favoriteFlowers: ["Rosas", "Tulipanes", "Lirios"],
  })

  const [editData, setEditData] = useState({
    fullName: profileData.fullName,
    email: profileData.email,
    phone: profileData.phone,
    password: "",
  })

  const handleSave = () => {
    setProfileData((prev) => ({
      ...prev,
      fullName: editData.fullName,
      email: editData.email,
      phone: editData.phone,
      ...(editData.password && { password: "••••••••" }),
    }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      password: "",
    })
    setIsEditing(false)
  }

  const handleViewDetails = (order: any) => {
    onOrderSelect(order)
    onNavigate("order-details")
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
                onClick={() => onNavigate("arrangement-builder")}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Mi Perfil</h1>
                <p className="text-sm text-slate-600">Administra tu información y pedidos</p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
              <User className="w-4 h-4 mr-2" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Package className="w-4 h-4 mr-2" />
              Historial de Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800">
                      <User className="w-5 h-5 mr-2 text-green-600" />
                      Información Personal
                    </CardTitle>
                    <CardDescription>
                      {isEditing ? "Edita tu información personal" : "Tu información personal registrada"}
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

                        <div className="space-y-2">
                          <Label htmlFor="password">Nueva contraseña (opcional)</Label>
                          <Input
                            id="password"
                            type="password"
                            value={editData.password}
                            onChange={(e) => setEditData((prev) => ({ ...prev, password: e.target.value }))}
                            placeholder="Dejar vacío para mantener la actual"
                          />
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button
                            onClick={handleSave}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
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
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{profileData.password}</p>
                            <p className="text-sm text-slate-600">Contraseña</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Stats and Preferences */}
              <div className="space-y-6">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{profileData.totalOrders}</p>
                        <p className="text-sm text-slate-600">Pedidos realizados</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-lg font-semibold text-blue-600">Miembro desde</p>
                        <p className="text-sm text-slate-600">{profileData.memberSince}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Flores Favoritas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profileData.favoriteFlowers.map((flower, index) => (
                        <div key={index} className="p-2 bg-rose-50 rounded-lg text-center">
                          <p className="text-sm font-medium text-rose-700">{flower}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Historial de Pedidos
                </CardTitle>
                <CardDescription>Todos tus arreglos florales ordenados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {orderHistory.map((order) => (
                    <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Order Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt={order.type}
                              className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover"
                            />
                          </div>

                          {/* Order Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{order.type}</h3>
                                <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                                  <span>ID: {order.id}</span>
                                  <span>Pedido: {order.date}</span>
                                  <span>Entrega: {order.deliveryDate}</span>
                                </div>
                                <Badge className={order.statusColor}>{order.status}</Badge>
                              </div>
                              <div className="text-right mt-4 md:mt-0">
                                <div className="text-2xl font-bold text-slate-800 mb-2">{order.total}</div>
                                <div className="flex flex-col md:flex-row gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(order)}
                                    className="border-slate-200 bg-transparent"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver detalles
                                  </Button>
                                  {order.status === "Completado" && (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => onNavigate("arrangement-builder")}
                                    >
                                      Reordenar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Order Progress */}
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.status === "Completado" || order.status === "Entregado"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span>Pedido confirmado</span>
                              <div className="w-4 h-px bg-slate-200"></div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.status === "En proceso" ||
                                  order.status === "Completado" ||
                                  order.status === "Entregado"
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span>En preparación</span>
                              <div className="w-4 h-px bg-slate-200"></div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.status === "Completado" || order.status === "Entregado"
                                    ? "bg-blue-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <span>Listo para entrega</span>
                              <div className="w-4 h-px bg-slate-200"></div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  order.status === "Entregado" ? "bg-green-500" : "bg-gray-300"
                                }`}
                              ></div>
                              <span>Entregado</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    Cargar más pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
