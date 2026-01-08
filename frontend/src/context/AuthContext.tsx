import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  role: string | null; // <-- Rol eklendi
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(null);

  // Token değiştiğinde rolü güncelle
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setRole(decoded.role || 'user');
      } catch (error) {
        console.error("Token decode edilemedi", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, [token]);

  // Sayfa ilk açıldığında hafızada token var mı diye bakar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken); // Tarayıcı hafızasına kaydet
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Hafızadan sil
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

// Bu kancayı (hook) diğer sayfalarda kullanacağız
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};