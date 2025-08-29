import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../services/utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon } from '../common/Icons';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    departmentId: 1 // Default department
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, error, clearError } = useAuth();
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
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad gereklidir';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad gereklidir';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Kullanıcı adı gereklidir';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    
    if (!formData.password) {
      newErrors.password = 'Şifre gereklidir';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Şifre en az 6 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifre tekrarı gereklidir';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
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
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <LoadingSpinner message="Hesap oluşturuluyor..." />
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
            <h2 className="auth-title">Kayıt Ol</h2>
            <p className="auth-subtitle">Üniversite sistemine katılın</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <ErrorMessage 
                message={error} 
                onClose={clearError}
                type="error"
              />
            )}
            
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label htmlFor="firstName" className="auth-form-label">
                  Ad
                </label>
                <div className="auth-input-wrapper">
                  <div className="auth-input-icon">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`auth-form-input auth-form-input-with-icon ${errors.firstName ? 'error' : ''}`}
                    placeholder="Adınız"
                    autoComplete="given-name"
                  />
                </div>
                {errors.firstName && (
                  <span className="field-error">{errors.firstName}</span>
                )}
              </div>
              
              <div className="auth-form-group">
                <label htmlFor="lastName" className="auth-form-label">
                  Soyad
                </label>
                <div className="auth-input-wrapper">
                  <div className="auth-input-icon">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`auth-form-input auth-form-input-with-icon ${errors.lastName ? 'error' : ''}`}
                    placeholder="Soyadınız"
                    autoComplete="family-name"
                  />
                </div>
                {errors.lastName && (
                  <span className="field-error">{errors.lastName}</span>
                )}
              </div>
            </div>
            
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
                  placeholder="Kullanıcı adınız"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <span className="field-error">{errors.username}</span>
              )}
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="email" className="auth-form-label">
                E-posta
              </label>
              <div className="auth-input-wrapper">
                <div className="auth-input-icon">
                  <EmailIcon className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`auth-form-input auth-form-input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="E-posta adresiniz"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}
            </div>
            
            <div className="auth-form-row">
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
                    placeholder="Şifreniz"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="field-error">{errors.password}</span>
                )}
              </div>
              
              <div className="auth-form-group">
                <label htmlFor="confirmPassword" className="auth-form-label">
                  Şifre Tekrar
                </label>
                <div className="auth-input-wrapper">
                  <div className="auth-input-icon">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`auth-form-input auth-form-input-with-icon ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Şifre tekrar"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="field-error">{errors.confirmPassword}</span>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  Hesap oluşturuluyor...
                </div>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Zaten hesabınız var mı?{' '}
              <Link to="/auth/login" className="auth-footer-link">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
