import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData && userData !== 'undefined') {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Token'ın geçerliliğini kontrol et
          try {
            // Basit bir API çağrısı yap token'ı test etmek için
            await authService.getProfile(parsedUser.id);
          } catch (tokenError) {
            console.log('Token validation failed, clearing auth data:', tokenError.message);
            // Token geçersiz, temizle
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Bozuk verileri temizle
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.login(credentials);
      const responseData = response.data; // Axios response.data kullan
      
      // Backend response yapısına göre düzenle
      const token = responseData.token || responseData.accessToken;
      const refreshToken = responseData.refreshToken;
      const userData = responseData.user || responseData;
      
      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
        return responseData;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Giriş yapılırken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authService.register(userData);
      const responseData = response.data;
      
      const token = responseData.token || responseData.accessToken;
      const refreshToken = responseData.refreshToken;
      const user = responseData.user || responseData;
      
      if (token) {
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        return responseData;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Kayıt olurken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (user?.username) {
        await authService.revokeToken(user.username);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
