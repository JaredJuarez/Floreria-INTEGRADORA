import { API_URL } from "../url.js";

// Funciones para llamadas a la API
export const apiService = {
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

  // Obtener flores (placeholder para cuando esté disponible)
  getFlowers: async () => {
    try {
      const response = await fetch(`${API_URL}/flowers`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching flowers:', error);
      throw error;
    }
  }
};
