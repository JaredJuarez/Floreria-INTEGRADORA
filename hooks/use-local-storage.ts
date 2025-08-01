import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función para obtener el valor del localStorage
  const getValue = (): T => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Función para establecer el valor
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Inicializar el valor solo en el cliente
  useEffect(() => {
    if (!isInitialized) {
      setStoredValue(getValue());
      setIsInitialized(true);
    }
  }, [key, isInitialized]);

  return [storedValue, setValue];
}

// Hook específico para el token de autenticación
export function useAuthToken(): [string | null, (token: string | null) => void] {
  const [token, setToken] = useLocalStorage<string | null>('authToken', null);
  return [token, setToken];
}

// Hook para obtener valores de localStorage de manera segura
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
