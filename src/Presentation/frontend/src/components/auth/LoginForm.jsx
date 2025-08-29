import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from '../common/Icons';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    clearError();

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <LoadingSpinner message="Giriş yapılıyor..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span>Ü</span>
            </div>
            <h2 className="auth-title">Hoş Geldiniz</h2>
            <p className="auth-subtitle">Üniversite sistemine giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <ErrorMessage 
                message={error} 
                onClose={clearError}
                type="error"
              />
            )}
            
            <div className="auth-form-group">
              <label htmlFor="username" className="auth-form-label">
                Kullanıcı Adı
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-icon">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`auth-form-input auth-form-input-with-icon ${errors.username ? 'error' : ''}`}
                  placeholder="Kullanıcı adınızı girin"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="password" className="auth-form-label">
                Şifre
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-icon">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`auth-form-input auth-form-input-with-icon ${errors.password ? 'error' : ''}`}
                  placeholder="Şifrenizi girin"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Hesabınız yok mu?{' '}
              <Link to="/auth/register" className="auth-footer-link">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;