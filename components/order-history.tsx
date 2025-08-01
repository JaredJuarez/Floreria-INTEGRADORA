"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Flower2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { Screen } from "@/app/page";
import { apiService } from "@/lib/api";

interface OrderHistoryProps {
  onNavigate: (screen: Screen) => void;
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

export function OrderHistory({ onNavigate }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await apiService.getUserOrderHistory();
        console.log("Order history response:", response);
        
        if (!response.error) {
          // Ordenar los pedidos por id descendente (último pedido primero)
          const sortedOrders = [...response.data].sort((a, b) => b.id - a.id);
          setOrders(sortedOrders);
        } else {
          setError(response.message || "No se pudo cargar el historial de pedidos");
        }
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError("No se pudo cargar el historial de pedidos");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "OPEN":
        return {
          label: "Pendiente",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "COMPLETED":
        return {
          label: "Completado",
          icon: CheckCircle,
          className: "bg-green-100 text-green-800",
        };
      case "CANCELLED":
        return {
          label: "Cancelado",
          icon: XCircle,
          className: "bg-red-100 text-red-800",
        };
      case "IN_PROGRESS":
        return {
          label: "En Proceso",
          icon: AlertCircle,
          className: "bg-blue-100 text-blue-800",
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
    // Como no tenemos fecha en la respuesta, simularemos una basada en el ID
    const date = new Date();
    date.setDate(date.getDate() - orderId);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500 text-lg">Cargando historial de pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-rose-50">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
            <Button onClick={() => onNavigate("arrangement-builder")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
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
                <h1 className="text-xl font-serif font-semibold text-slate-800">
                  Historial de Pedidos
                </h1>
                <p className="text-sm text-slate-600">
                  Revisa todos tus pedidos anteriores
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {orders.length} pedidos
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Área principal - Lista de pedidos (3/4 de la pantalla) */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto py-8 pr-6">
              {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay pedidos aún
                </h3>
                <p className="text-gray-500 mb-6">
                  Cuando realices tu primer pedido, aparecerá aquí.
                </p>
                <Button
                  onClick={() => onNavigate("arrangement-builder")}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Flower2 className="w-4 h-4 mr-2" />
                  Crear mi primer arreglo
                </Button>
              </div>
            ) : (
              <div className="space-y-6 pr-4">
                {orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <Card key={order.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-slate-800">
                                Pedido #{order.id}
                              </CardTitle>
                              <CardDescription className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(order.id)}
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="w-4 h-4 mr-1" />
                                  ${order.totalPrice.toFixed(2)}
                                </span>
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={statusInfo.className}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Información del Arreglo */}
                          <div>
                            <h4 className="font-medium text-slate-800 mb-3">
                              Detalles del Arreglo
                            </h4>
                            <div className="bg-slate-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-slate-800">
                                  {order.category.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {order.category.typeCategory}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600 mb-3">
                                {order.category.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                  Precio base:
                                </span>
                                <span className="font-medium text-slate-800">
                                  ${order.category.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Flores del Pedido */}
                          <div>
                            <h4 className="font-medium text-slate-800 mb-3">
                              Flores ({order.orderHasFlowers.length} tipos)
                            </h4>
                            <div className="space-y-2">
                              {order.orderHasFlowers.map((flower, index) => (
                                <div
                                  key={flower.id}
                                  className="bg-slate-50 rounded-lg p-3 flex justify-between items-center"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                                      <Flower2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-slate-800">
                                        Flores
                                      </p>
                                      <p className="text-xs text-slate-600">
                                        Cantidad: {flower.cuantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-slate-800">
                                      ${flower.price.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-slate-600">
                                      ${(flower.price / flower.cuantity).toFixed(2)} c/u
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Resumen de Precio */}
                        <div className="border-t mt-6 pt-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-600">
                                Total de flores: {order.orderHasFlowers.reduce((sum, flower) => sum + flower.cuantity, 0)}
                              </p>
                              <p className="text-sm text-slate-600">
                                Arreglo base + Flores
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">
                                ${order.totalPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-slate-600">Total pagado</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral derecho - Resumen (1/4 de la pantalla) */}
        {orders.length > 0 && (
          <div className="w-1/4 border-l border-slate-200 bg-white/50 backdrop-blur-sm">
            <div className="h-full p-6 overflow-y-auto">
              <div className="sticky top-0">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-slate-800 text-lg">Resumen</CardTitle>
                    <CardDescription>Estadísticas de tus pedidos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
                      <p className="text-3xl font-bold text-slate-800">
                        {orders.length}
                      </p>
                      <p className="text-sm text-slate-600 font-medium">Total de pedidos</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">
                        ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-green-700 font-medium">Total gastado</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">
                          {orders.filter(order => order.status === "OPEN").length}
                        </p>
                        <p className="text-xs text-yellow-700 font-medium">Pendientes</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {orders.filter(order => order.status === "PROCESSING").length}
                        </p>
                        <p className="text-xs text-blue-700 font-medium">En proceso</p>
                      </div>
                      
                      <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">
                          {orders.filter(order => order.status === "CLOSED").length}
                        </p>
                        <p className="text-xs text-emerald-700 font-medium">Completados</p>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Promedio por pedido:</span>
                        <span className="text-sm font-medium text-slate-800">
                          ${(orders.reduce((sum, order) => sum + order.totalPrice, 0) / orders.length).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total de flores:</span>
                        <span className="text-sm font-medium text-slate-800">
                          {orders.reduce((sum, order) => 
                            sum + order.orderHasFlowers.reduce((flowerSum, flower) => flowerSum + flower.cuantity, 0), 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Último pedido:</span>
                        <span className="text-sm font-medium text-slate-800">
                          #{Math.max(...orders.map(order => order.id))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
