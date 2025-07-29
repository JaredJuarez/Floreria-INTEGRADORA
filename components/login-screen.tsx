"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flower2, Mail, Lock, User, Shield } from "lucide-react"
import type { UserType } from "@/app/page"

interface LoginScreenProps {
  onLogin: (userType: UserType) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [showReset, setShowReset] = useState(false)

  const handleLogin = (userType: UserType) => {
    // Simulación de login
    onLogin(userType)
  }

  const handlePasswordReset = () => {
    // Simulación de reset
    alert("Instrucciones enviadas a tu correo electrónico")
    setShowReset(false)
    setResetEmail("")
  }

  if (showReset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-slate-800">Recuperar Contraseña</CardTitle>
              <CardDescription className="text-slate-600">Ingresa tu correo para recibir instrucciones</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-slate-700">
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="pl-10 border-slate-200 focus:border-green-400 focus:ring-green-400"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handlePasswordReset}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5"
              >
                Enviar Instrucciones
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowReset(false)}
                className="w-full text-slate-600 hover:text-slate-800"
              >
                Volver al inicio de sesión
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
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-white">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="demo" className="data-[state=active]:bg-white">
                Demo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
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
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => handleLogin("client")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5"
                >
                  Iniciar Sesión
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowReset(true)}
                  className="w-full text-slate-600 hover:text-slate-800"
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <div className="text-center text-sm text-slate-600 mb-4">Explora la aplicación con diferentes roles:</div>
              <div className="space-y-3">
                <Button
                  onClick={() => handleLogin("client")}
                  variant="outline"
                  className="w-full justify-start border-green-200 hover:bg-green-50 hover:border-green-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Entrar como Cliente
                </Button>
                <Button
                  onClick={() => handleLogin("florist")}
                  variant="outline"
                  className="w-full justify-start border-rose-200 hover:bg-rose-50 hover:border-rose-300"
                >
                  <Flower2 className="w-4 h-4 mr-2" />
                  Entrar como Florista
                </Button>
                <Button
                  onClick={() => handleLogin("superadmin")}
                  variant="outline"
                  className="w-full justify-start border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Entrar como SuperAdmin
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
