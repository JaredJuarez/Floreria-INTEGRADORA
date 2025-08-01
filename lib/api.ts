import { API_URL } from "../url.js";

// Funciones para llamadas a la API
export const apiService = {
  // Autenticación
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Registro de usuario
  register: async (name: string, phone: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          password,
          rol: {
            id: 3,
            name: "CUSTOMER"
          }
        })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  // Verificar si el token es válido
  validateToken: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validating token:', error);
      throw error;
    }
  },

  // Obtener tipos de categorías
  getCategoryTypes: async () => {
    try {
      const response = await fetch(`${API_URL}/category/types`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching category types:', error);
      throw error;
    }
  },

  // Obtener arreglos por tipo de categoría
  getArrangementsByCategory: async (typeCategory: string) => {
    try {
      const response = await fetch(`${API_URL}/category/${typeCategory}/all`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching arrangements by category:', error);
      throw error;
    }
  },

  // Obtener flores (actualizado para usar API real)
  getFlowers: async () => {
    try {
      const response = await fetch(`${API_URL}/flowers`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching flowers:', error);
      throw error;
    }
  },

  // Crear orden
  createOrder: async (orderData: { category: number; flowers: { cuantity: number; flowerId: number }[] }) => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Gestión de Floristas
  getFlorists: async () => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/floristas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching florists:', error);
      throw error;
    }
  },

  createFlorist: async (floristData: { name: string; phone: string; email: string; password: string }) => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/floristas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(floristData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating florist:', error);
      throw error;
    }
  },

  updateFlorist: async (floristData: { id: string; name: string; phone: string; email: string; password?: string }) => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/floristas`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(floristData)
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating florist:', error);
      throw error;
    }
  },

  toggleFloristStatus: async (id: string, status: boolean) => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/floristas/${id}/status?status=${status}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        // Manejar diferentes códigos de error
        if (response.status === 403) {
          return {
            error: true,
            message: 'No tienes permisos para realizar esta acción',
            status: 'FORBIDDEN'
          };
        } else if (response.status === 401) {
          return {
            error: true,
            message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
            status: 'UNAUTHORIZED'
          };
        } else {
          return {
            error: true,
            message: `Error del servidor: ${response.status}`,
            status: 'ERROR'
          };
        }
      }

      // Intentar parsear JSON solo si hay contenido
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        // Si no hay JSON, retornar éxito
        return {
          error: false,
          message: 'Estado actualizado correctamente',
          status: 'SUCCESS'
        };
      }
    } catch (error) {
      console.error('Error toggling florist status:', error);
      return {
        error: true,
        message: 'Error de conexión al servidor',
        status: 'CONNECTION_ERROR'
      };
    }
  },

  // Historial de pedidos del usuario
  getUserOrderHistory: async () => {
    try {
      const { token } = typeof window !== 'undefined' ? {
        token: localStorage.getItem('authToken')
      } : { token: null };

      const response = await fetch(`${API_URL}/order/user/history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          return {
            error: true,
            message: 'No tienes permisos para ver el historial de pedidos',
            status: 'FORBIDDEN'
          };
        } else if (response.status === 401) {
          return {
            error: true,
            message: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
            status: 'UNAUTHORIZED'
          };
        } else {
          return {
            error: true,
            message: `Error del servidor: ${response.status}`,
            status: 'ERROR'
          };
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user order history:', error);
      return {
        error: true,
        message: 'Error de conexión al servidor',
        status: 'CONNECTION_ERROR'
      };
    }
  }
};
