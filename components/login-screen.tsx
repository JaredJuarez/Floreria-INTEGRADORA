"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flower2, Mail, Lock, User, Phone } from "lucide-react"
import type { UserType } from "@/app/page"
import { apiService } from "@/lib/api"

interface LoginScreenProps {
  onLogin: (userType: UserType) => void
}

// Interfaz para la respuesta de la API
interface LoginResponse {
  message: string
  data: {
    token: string
    role: "ADMIN" | "EMPLOYEE" | "CUSTOMER"
  }
  error: boolean
  status: string
}

interface RegisterResponse {
  message: string
  data: any
  error: boolean
  status: string
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Mapear roles de la API a tipos de usuario de la aplicación
  const mapRoleToUserType = (role: string): UserType => {
    switch (role) {
      case "ADMIN":
        return "superadmin"
      case "EMPLOYEE":
        return "florist"
      case "CUSTOMER":
        return "client"
      default:
        return "client"
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Por favor, ingresa tu correo y contraseña")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")
      
      const response: LoginResponse = await apiService.login(email, password)
      
      if (!response.error && response.data) {
        // Guardar token en localStorage si es necesario
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('userRole', response.data.role)
        
        // Mapear el rol y hacer login
        const userType = mapRoleToUserType(response.data.role)
        onLogin(userType)
      } else {
        setErrorMessage(response.message || "Error en el inicio de sesión")
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage("Error de conexión. Verifica tu conexión a internet.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!name || !phone || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setLoading(true)
      setErrorMessage("")
      setSuccessMessage("")
      
      const response: RegisterResponse = await apiService.register(name, phone, email, password)
      
      if (!response.error) {
        setSuccessMessage("Cuenta creada exitosamente. Ahora puedes iniciar sesión.")
        // Limpiar formulario y cambiar a login
        setName("")
        setPhone("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setTimeout(() => {
          setShowRegister(false)
          setSuccessMessage("")
        }, 2000)
      } else {
        setErrorMessage(response.message || "Error al crear la cuenta")
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage("Error de conexión. Verifica tu conexión a internet.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setName("")
    setPhone("")
    setConfirmPassword("")
    setErrorMessage("")
    setSuccessMessage("")
  }

  const handlePasswordReset = () => {
    // Placeholder para reset de contraseña si se necesita en el futuro
    alert("Funcionalidad de reset de contraseña no disponible")
  }

  if (showRegister) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-slate-800">Crear Cuenta</CardTitle>
              <CardDescription className="text-slate-600">Únete a la comunidad de FLOREVER</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-md border border-red-200">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded-md border border-green-200">
                {successMessage}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name" className="text-slate-700">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-phone" className="text-slate-700">
                  Teléfono
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="Tu número de teléfono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-email" className="text-slate-700">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register-password" className="text-slate-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-slate-700">
                  Confirmar contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5"
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowRegister(false)
                  resetForm()
                }}
                disabled={loading}
                className="w-full text-slate-600 hover:text-slate-800"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <Flower2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-serif text-slate-800">FLOREVER</CardTitle>
            <CardDescription className="text-slate-600">Arreglos florales personalizados</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              {errorMessage && (
                <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                    disabled={loading}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5"
                >
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowRegister(true)
                    resetForm()
                  }}
                  disabled={loading}
                  className="w-full text-slate-600 hover:text-slate-800"
                >
                  ¿No tienes cuenta? Regístrate
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
