"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Users,
  Phone,
  Mail,
  User,
  Lock,
  Unlock,
} from "lucide-react";
import type { Screen } from "@/app/page";

import { useEffect } from "react";
import Swal from "sweetalert2";
import { apiService } from "@/lib/api";

interface FloristManagementProps {
  onNavigate: (screen: Screen) => void;
}

interface Florist {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: boolean;
  completedOrders: number;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
}

export function FloristManagement({ onNavigate }: FloristManagementProps) {
  const [florists, setFlorists] = useState<Florist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFlorists = async () => {
      try {
        const response = await apiService.getFlorists();
        console.log("Florists response:", response);
        if (!response.error) {
          setFlorists(response.data);
        } else {
          setError("No se pudieron cargar los floristas 🥲");
          Swal.fire("Error", response.message || "No se pudieron cargar los floristas 🥲", "error");
        }
      } catch (err) {
        console.error("Error fetching florists:", err);
        setError("No se pudieron cargar los floristas 🥲");
        Swal.fire("Error", "No se pudieron cargar los floristas 🥲", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchFlorists();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Cargando floristas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  const validate = (data: FormData) => {
    const errors: FormErrors = {};

    if (!data.name.trim()) {
      errors.name = "El nombre no puede estar vacío o solo espacios";
    }

    // Teléfono: solo números, + y espacios permitidos, pero debe tener mínimo 7 dígitos
    const phoneRegex = /^[\d+\s]{7,}$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = "Ingresa un teléfono válido (solo números, + y espacios)";
    }
    // Email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = "Correo electrónico inválido";
    }

    // Contraseña: mínimo 6 caracteres, pero solo si estás creando o editando con password
    if (!editingId && data.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (
      editingId &&
      data.password &&
      data.password.length > 0 &&
      data.password.length < 6
    ) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate(formData);
    setFormErrors(error);
    if (Object.keys(error).length > 0) {
      Swal.fire(
        "Error",
        "Por favor corrige los errores del formulario",
        "error"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await apiService.createFlorist({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      if (!response.error) {
        const updated = await apiService.getFlorists();
        if (!updated.error) {
          setFlorists(updated.data);
        }
        resetForm();
        Swal.fire("Éxito", "Florista creado correctamente 🌸", "success");
      } else {
        Swal.fire("Error", response.message || "No se pudo crear el florista 😢", "error");
      }
    } catch (error) {
      console.error("Error al crear florista:", error);
      Swal.fire("Error", "No se pudo crear el florista 😢", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const floristToUpdate = florists.find((f) => f.id === editingId);
      if (!floristToUpdate) throw new Error("Florista no encontrado");

      const floristPayload: any = {
        id: floristToUpdate.id,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      };

      if (formData.password.trim() !== "") {
        floristPayload.password = formData.password;
      }

      const response = await apiService.updateFlorist(floristPayload);

      if (!response.error) {
        setFlorists((prev) =>
          prev.map((f) => (f.id === editingId ? { ...f, ...floristPayload } : f))
        );
        resetForm();
        Swal.fire(
          "Actualizado",
          "Florista actualizado exitosamente ✅",
          "success"
        );
      } else {
        Swal.fire("Error", response.message || "No se pudo actualizar el florista 😢", "error");
      }
    } catch (error) {
      console.error("Error al actualizar florista:", error);
      Swal.fire("Error", "No se pudo actualizar el florista 😢", "error");
    }
  };

  const openEditForm = (floristId: string) => {
    const florist = florists.find((f) => f.id === floristId);
    if (!florist) return;

    setEditingId(florist.id);
    setFormData({
      name: florist.name,
      phone: florist.phone,
      email: florist.email,
      password: "", // No mostrar la contraseña por seguridad
    });
    setIsCreating(true);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await apiService.toggleFloristStatus(id, !currentStatus);
      
      if (!response.error) {
        setFlorists((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: !currentStatus } : f))
        );
        Swal.fire(
          "Éxito",
          `Florista ${!currentStatus ? "activado" : "desactivado"} correctamente`,
          "success"
        );
      } else {
        Swal.fire("Error", response.message || "No se pudo cambiar el estado del florista", "error");
      }
    } catch (error: any) {
      console.error("Error al cambiar el estado:", error);
      Swal.fire(
        "Error",
        "No se pudo cambiar el estado del florista, intenta de nuevo",
        "error"
      );
    }
  };

  const resetForm = () => {
    setFormData({ name: "", phone: "", email: "", password: "" });
    setIsCreating(false);
    setEditingId(null);
  };

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
                <h1 className="text-xl font-serif font-semibold text-slate-800">
                  Gestión de Floristas
                </h1>
                <p className="text-sm text-slate-600">
                  Administra los floristas y sus datos de contacto
                </p>
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
                <CardDescription>
                  Todos los floristas registrados en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {florists.map((florist) => (
                    <div
                      key={florist.id}
                      className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {florist.name}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold ${
                              florist.status
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {florist.status ? "Activo" : "Inactivo"}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditForm(florist.id)}
                            className="border-slate-200"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toggleActive(florist.id, florist.status)
                            }
                            className={
                              florist.status
                                ? "border-red-200 text-red-700 hover:bg-red-100"
                                : "border-green-200 text-green-700 hover:bg-green-100"
                            }
                          >
                            {florist.status ? (
                              <>
                                <Lock className="w-4 h-4 mr-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {florist.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {florist.email}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-200">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-slate-800">
                            {florist.completedOrders}
                          </p>
                          <p className="text-xs text-slate-600">
                            Pedidos completados
                          </p>
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
                    {editingId ? "Editar Florista" : "Nuevo Florista"}
                  </CardTitle>
                  <CardDescription>
                    {editingId
                      ? "Modifica los datos del florista"
                      : "Registra un nuevo florista en el sistema"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={editingId ? handleEdit : handleSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej: Carmen López García"
                        required
                      />
                      {formErrors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        required
                      />
                      {formErrors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="florista@FLOREVER.com"
                        required
                      />
                      {formErrors.email && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password || ""}
                        onChange={handleChange}
                        placeholder="Contraseña segura"
                        required={!editingId} // No requerir contraseña al editar
                      />
                      {formErrors.password && (
                        <p className="text-red-600 text-sm mt-1">
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
                      >
                        {isSubmitting
                          ? "Procesando..."
                          : editingId
                          ? "Actualizar"
                          : "Crear"}{" "}
                        Florista
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
                    <span className="font-semibold text-green-600">
                      {florists.filter((f) => f.status).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Inactivos:</span>
                    <span className="font-semibold text-gray-600">
                      {florists.filter((f) => !f.status).length}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pedidos totales:</span>
                      <span className="font-semibold">
                        {florists.reduce(
                          (sum, f) =>
                            sum +
                            (typeof f.completedOrders === "number" &&
                            !isNaN(f.completedOrders)
                              ? f.completedOrders
                              : 0),
                          0
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Calificación promedio:
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
