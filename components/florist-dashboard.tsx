"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flower2, 
  LogOut, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  DollarSign,
  Eye,
  PlayCircle,
  XCircle
} from "lucide-react";
import type { Screen } from "@/app/page";
import { apiService } from "@/lib/api";

interface FloristDashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

interface OrderFlower {
  id: number;
  cuantity: number;
  price: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  price: number;
  totalQuantityFlowers: number;
  typeCategory: string;
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  category: Category;
  orderHasFlowers: OrderFlower[];
}

export function FloristDashboard({ onNavigate, onLogout }: FloristDashboardProps) {
  const [openOrders, setOpenOrders] = useState<Order[]>([]);
  const [processingOrders, setProcessingOrders] = useState<Order[]>([]);
  const [closedOrders, setClosedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'PROCESSING' | 'CLOSED'>('OPEN');

  // Obtener órdenes por estado
  const fetchOrdersByStatus = async () => {
    try {
      setLoading(true);
      const [openResponse, processingResponse, closedResponse] = await Promise.all([
        apiService.getOrdersByStatus('OPEN'),
        apiService.getOrdersByStatus('PROCESSING'), 
        apiService.getOrdersByStatus('CLOSED')
      ]);

      if (!openResponse.error) setOpenOrders(openResponse.data || []);
      if (!processingResponse.error) setProcessingOrders(processingResponse.data || []);
      if (!closedResponse.error) setClosedOrders(closedResponse.data || []);

    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener detalles de una orden específica
  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await apiService.getOrderById(orderId);
      if (!response.error) {
        setSelectedOrder(response.data);
        setShowOrderModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Asignar orden al florista
  const handleAssignOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      const response = await apiService.assignOrder(orderId);
      if (!response.error) {
        // Refrescar las órdenes después de asignar
        await fetchOrdersByStatus();
      }
    } catch (error) {
      console.error('Error assigning order:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Cerrar orden
  const handleCloseOrder = async (orderId: number) => {
    try {
      setActionLoading(orderId);
      const response = await apiService.closeOrder(orderId);
      if (!response.error) {
        // Refrescar las órdenes después de cerrar
        await fetchOrdersByStatus();
      }
    } catch (error) {
      console.error('Error closing order:', error);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchOrdersByStatus();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          label: "Pendiente",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "PROCESSING":
        return {
          label: "En Proceso",
          icon: AlertCircle,
          className: "bg-blue-100 text-blue-800",
        };
      case "CLOSED":
        return {
          label: "Completado",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800",
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const formatDate = (orderId: number) => {
    // Simulamos una fecha basada en el ID
    const date = new Date();
    date.setDate(date.getDate() - orderId);
    return date.toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    });
  };

  // Estadísticas calculadas
  const stats = [
    {
      title: "Pedidos Pendientes",
      value: openOrders.length.toString(),
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "En Proceso",
      value: processingOrders.length.toString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completados",
      value: closedOrders.length.toString(),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total del Día",
      value: (openOrders.length + processingOrders.length + closedOrders.length).toString(),
      icon: Package,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Cargando panel de florista...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-semibold text-slate-800">Panel Florista</h1>
                <p className="text-sm text-slate-600">¡Hola, Florista!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-600 hover:text-slate-800">
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-rose-500 to-pink-600 border-0 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-3xl font-serif font-bold mb-2">¡Buenos días, Florista!</h2>
                  <p className="text-rose-100 text-lg mb-4">
                    Tienes {openOrders.length} pedidos pendientes por revisar
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                    <Flower2 className="w-16 h-16 text-white/80" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders with Tabs */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Package className="w-5 h-5 mr-2 text-rose-600" />
                  Gestión de Pedidos
                </CardTitle>
                <CardDescription>Organiza y gestiona todos los pedidos por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'OPEN' | 'PROCESSING' | 'CLOSED')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="OPEN" className="relative">
                      Pendientes
                      {openOrders.length > 0 && (
                        <Badge className="ml-2 bg-yellow-500 text-white text-xs px-1.5 py-0.5">
                          {openOrders.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="PROCESSING" className="relative">
                      En Proceso
                      {processingOrders.length > 0 && (
                        <Badge className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5">
                          {processingOrders.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="CLOSED" className="relative">
                      Completados
                      {closedOrders.length > 0 && (
                        <Badge className="ml-2 bg-green-500 text-white text-xs px-1.5 py-0.5">
                          {closedOrders.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content for OPEN Orders */}
                  <TabsContent value="OPEN" className="mt-6">
                    <div className="space-y-4">
                      {openOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No hay pedidos pendientes</p>
                          <p className="text-gray-400 text-sm">Los nuevos pedidos aparecerán aquí</p>
                        </div>
                      ) : (
                        openOrders.map((order) => {
                          const statusInfo = getStatusInfo(order.status);
                          const StatusIcon = statusInfo.icon;
                          
                          return (
                            <div key={order.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-medium text-slate-800">{order.category.name}</h3>
                                  <Badge className={statusInfo.className}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {order.category.typeCategory}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-slate-800">${order.totalPrice.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                  <p>ID: #{order.id} • {formatDate(order.id)}</p>
                                  <p>Flores: {order.orderHasFlowers.reduce((sum, flower) => sum + flower.cuantity, 0)} unidades</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-slate-600 bg-white"
                                    onClick={() => fetchOrderDetails(order.id)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver detalles
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-rose-600 hover:bg-rose-700 text-white"
                                    onClick={() => handleAssignOrder(order.id)}
                                    disabled={actionLoading === order.id}
                                  >
                                    {actionLoading === order.id ? (
                                      "Asignando..."
                                    ) : (
                                      <>
                                        <PlayCircle className="w-3 h-3 mr-1" />
                                        Aceptar
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab Content for PROCESSING Orders */}
                  <TabsContent value="PROCESSING" className="mt-6">
                    <div className="space-y-4">
                      {processingOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No hay pedidos en proceso</p>
                          <p className="text-gray-400 text-sm">Los pedidos asignados aparecerán aquí</p>
                        </div>
                      ) : (
                        processingOrders.map((order) => {
                          const statusInfo = getStatusInfo(order.status);
                          const StatusIcon = statusInfo.icon;
                          
                          return (
                            <div key={order.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-medium text-slate-800">{order.category.name}</h3>
                                  <Badge className={statusInfo.className}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {order.category.typeCategory}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-slate-800">${order.totalPrice.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                  <p>ID: #{order.id} • {formatDate(order.id)}</p>
                                  <p>Flores: {order.orderHasFlowers.reduce((sum, flower) => sum + flower.cuantity, 0)} unidades</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-slate-600 bg-white"
                                    onClick={() => fetchOrderDetails(order.id)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver detalles
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleCloseOrder(order.id)}
                                    disabled={actionLoading === order.id}
                                  >
                                    {actionLoading === order.id ? (
                                      "Completando..."
                                    ) : (
                                      <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Completar
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </TabsContent>

                  {/* Tab Content for CLOSED Orders */}
                  <TabsContent value="CLOSED" className="mt-6">
                    <div className="space-y-4">
                      {closedOrders.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                          <p className="text-gray-500 font-medium">No hay pedidos completados</p>
                          <p className="text-gray-400 text-sm">Los pedidos terminados aparecerán aquí</p>
                        </div>
                      ) : (
                        closedOrders.slice(0, 10).map((order) => {
                          const statusInfo = getStatusInfo(order.status);
                          const StatusIcon = statusInfo.icon;
                          
                          return (
                            <div key={order.id} className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <h3 className="font-medium text-slate-800">{order.category.name}</h3>
                                  <Badge className={statusInfo.className}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {order.category.typeCategory}
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-slate-800">${order.totalPrice.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-600">
                                  <p>ID: #{order.id} • {formatDate(order.id)}</p>
                                  <p>Flores: {order.orderHasFlowers.reduce((sum, flower) => sum + flower.cuantity, 0)} unidades</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-slate-600 bg-white"
                                    onClick={() => fetchOrderDetails(order.id)}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    Ver detalles
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                      {closedOrders.length > 10 && (
                        <div className="text-center pt-4">
                          <p className="text-sm text-gray-500">
                            Mostrando 10 de {closedOrders.length} pedidos completados
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Summary */}
          <div>
            <Card className="shadow-sm border-slate-200 mb-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-yellow-200 hover:bg-yellow-50 bg-transparent"
                  onClick={() => setActiveTab('OPEN')}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Ver Pendientes ({openOrders.length})
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-blue-200 hover:bg-blue-50 bg-transparent"
                  onClick={() => setActiveTab('PROCESSING')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  En Proceso ({processingOrders.length})
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-green-200 hover:bg-green-50 bg-transparent"
                  onClick={() => setActiveTab('CLOSED')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completados ({closedOrders.length})
                </Button>
                <div className="border-t pt-3 mt-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-rose-200 hover:bg-rose-50 bg-transparent"
                    onClick={fetchOrdersByStatus}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Actualizar Pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Summary */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Resumen del Día</CardTitle>
                <CardDescription>Estadísticas de tu actividad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Pendientes</p>
                        <p className="text-xs text-slate-600">Por asignar</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-yellow-600">{openOrders.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">En Proceso</p>
                        <p className="text-xs text-slate-600">Trabajando</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{processingOrders.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Completados</p>
                        <p className="text-xs text-slate-600">Finalizados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{closedOrders.length}</p>
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Ingresos del día:</span>
                      <span className="text-sm font-bold text-green-600">
                        ${closedOrders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Total pedidos:</span>
                      <span className="text-sm font-medium text-slate-800">
                        {openOrders.length + processingOrders.length + closedOrders.length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles del Pedido #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Información completa del pedido
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{selectedOrder.category.name}</h3>
                  <p className="text-slate-600">{selectedOrder.category.description}</p>
                </div>
                <Badge className={getStatusInfo(selectedOrder.status).className}>
                  {getStatusInfo(selectedOrder.status).label}
                </Badge>
              </div>

              {/* Category Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Detalles del Arreglo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Tipo</p>
                      <p className="font-medium">{selectedOrder.category.typeCategory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Precio Base</p>
                      <p className="font-medium">${selectedOrder.category.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Cantidad de Flores</p>
                      <p className="font-medium">{selectedOrder.category.totalQuantityFlowers}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="font-medium text-green-600">${selectedOrder.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Flowers Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Flores del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.orderHasFlowers.map((flower, index) => (
                      <div key={flower.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                            <Flower2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Flor #{flower.id}</p>
                            <p className="text-xs text-slate-600">Cantidad: {flower.cuantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">${flower.price.toFixed(2)}</p>
                          <p className="text-xs text-slate-600">
                            ${(flower.price / flower.cuantity).toFixed(2)} c/u
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {selectedOrder.status === "OPEN" && (
                  <Button
                    onClick={() => {
                      handleAssignOrder(selectedOrder.id);
                      setShowOrderModal(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={actionLoading === selectedOrder.id}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Asignar a mí
                  </Button>
                )}
                {selectedOrder.status === "PROCESSING" && (
                  <Button
                    onClick={() => {
                      handleCloseOrder(selectedOrder.id);
                      setShowOrderModal(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={actionLoading === selectedOrder.id}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar como Completado
                  </Button>
                )}
                <Button variant="outline" onClick={() => setShowOrderModal(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
