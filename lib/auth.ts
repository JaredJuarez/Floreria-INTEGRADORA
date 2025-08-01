// Utilidades para manejo de autenticación y localStorage

export const authUtils = {
  // Guardar datos de autenticación
  saveAuthData: (token: string, role: string) => {
    try {
      localStorage.setItem('authToken', token)
      localStorage.setItem('userRole', role)
    } catch (error) {
      console.error('Error saving auth data:', error)
    }
  },

  // Obtener datos de autenticación
  getAuthData: () => {
    try {
      const token = localStorage.getItem('authToken')
      const role = localStorage.getItem('userRole')
      return { token, role }
    } catch (error) {
      console.error('Error getting auth data:', error)
      return { token: null, role: null }
    }
  },

  // Limpiar datos de autenticación
  clearAuthData: () => {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')
    } catch (error) {
      console.error('Error clearing auth data:', error)
    }
  },

  // Verificar si existe una sesión válida
  hasValidSession: () => {
    const { token, role } = authUtils.getAuthData()
    return !!(token && role)
  },

  // Mapear roles de la API a tipos de usuario de la aplicación
  mapRoleToUserType: (role: string) => {
    switch (role) {
      case "ADMIN":
        return "superadmin"
      case "FLORIST":
        return "florist"
      case "CUSTOMER":
        return "client"
      default:
        return null
    }
  }
}
