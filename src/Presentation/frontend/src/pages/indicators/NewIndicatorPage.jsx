import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import indicatorService from '../../services/api/indicatorService';
import { IndicatorDataType, PeriodType, getIndicatorDataTypeText, getPeriodTypeText } from '../../services/utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/pages/indicator-form-compact.css';

const NewIndicatorPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [formData, setFormData] = useState({
        indicatorCode: '',
        indicatorName: '',
        description: '',
        departmentId: '',
        assignedUserId: '',
        notificationUserId: '',
        dataType: IndicatorDataType.Number,
        periodStartDate: '',
        periodType: PeriodType.Year,
        notificationPeriod: 7,
        isActive: true,
        isAutomatic: false,
        rootValues: [{ rootValue: '', description: '', sortOrder: 1 }],
        historicalData: [
            { periodLabel: 'Geçmiş Dönem 1', value: '', description: '' },
            { periodLabel: 'Geçmiş Dönem 2', value: '', description: '' }
        ]
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        if (formData.departmentId) {
            loadUsers(formData.departmentId);
        } else {
            setUsers([]);
        }
    }, [formData.departmentId]);

    const loadDepartments = async () => {
        try {
            const data = await indicatorService.getDepartments();
            setDepartments(data);
        } catch (error) {
            setError('Departmanlar yüklenirken hata oluştu.');
            console.error('Error loading departments:', error);
        }
    };

    const loadUsers = async (departmentId) => {
        try {
            setLoadingUsers(true);
            const data = await indicatorService.getUsersByDepartment(departmentId);
            setUsers(data);
        } catch (error) {
            setError('Kullanıcılar yüklenirken hata oluştu.');
            console.error('Error loading users:', error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRootValueChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            rootValues: prev.rootValues.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addRootValue = () => {
        setFormData(prev => ({
            ...prev,
            rootValues: [...prev.rootValues, { 
                rootValue: '', 
                description: '', 
                sortOrder: prev.rootValues.length + 1 
            }]
        }));
    };

    const removeRootValue = (index) => {
        if (formData.rootValues.length > 1) {
            setFormData(prev => ({
                ...prev,
                rootValues: prev.rootValues.filter((_, i) => i !== index)
            }));
        }
    };

    const handleHistoricalDataChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            historicalData: prev.historicalData.map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const validateForm = () => {
        if (!formData.indicatorCode.trim()) {
            setError('Gösterge kodu zorunludur.');
            return false;
        }
        if (!formData.indicatorName.trim()) {
            setError('Gösterge adı zorunludur.');
            return false;
        }
        if (!formData.departmentId) {
            setError('Departman seçimi zorunludur.');
            return false;
        }
        if (!formData.dataType) {
            setError('Veri tipi seçimi zorunludur.');
            return false;
        }
        if (!formData.periodType) {
            setError('Periyot tipi seçimi zorunludur.');
            return false;
        }
        if (formData.rootValues.some(rv => !rv.rootValue.trim())) {
            setError('Tüm kök değerler doldurulmalıdır.');
            return false;
        }
        if (formData.notificationPeriod < 1) {
            setError('Bildirim periyodu en az 1 gün olmalıdır.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');

            const submitData = {
                indicatorCode: formData.indicatorCode,
                indicatorName: formData.indicatorName,
                description: formData.description,
                departmentId: parseInt(formData.departmentId),
                dataType: parseInt(formData.dataType),
                periodType: parseInt(formData.periodType),
                periodStartDate: formData.periodStartDate ? new Date(formData.periodStartDate).toISOString() : null,
                notificationPeriod: parseInt(formData.notificationPeriod),
                isAutomatic: formData.isAutomatic,
                assignedUserId: formData.assignedUserId ? parseInt(formData.assignedUserId) : null,
                notificationUserId: formData.notificationUserId ? parseInt(formData.notificationUserId) : null,
                isActive: formData.isActive,
                rootValues: formData.rootValues
                    .filter(rv => rv.rootValue.trim())
                    .map(rv => ({
                        rootValue: rv.rootValue,
                        description: rv.description || null,
                        sortOrder: rv.sortOrder || 1
                    })),
                historicalData: formData.historicalData
                    .filter(hd => hd.value && hd.value.toString().trim())
                    .map(hd => ({
                        periodLabel: hd.periodLabel,
                        value: parseFloat(hd.value),
                        description: hd.description || null
                    }))
            };

            console.log('Submitting data:', submitData);
            await indicatorService.createIndicator(submitData);
            navigate('/indicators', { 
                state: { 
                    message: 'Gösterge başarıyla oluşturuldu!', 
                    type: 'success' 
                } 
            });
        } catch (error) {
            console.error('Error creating indicator:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.errors || 
                               'Gösterge oluşturulurken hata oluştu.';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/indicators');
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="indicator-form-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Yeni Gösterge Oluştur</h1>
                    <p className="page-subtitle">Sistem için yeni bir gösterge tanımlayın</p>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSubmit} className="indicator-form">
                {/* Temel Bilgiler */}
                <div className="form-section">
                    <h2 className="section-title">Temel Bilgiler</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="indicatorCode" className="form-label required">
                                Gösterge Kodu
                            </label>
                            <input
                                type="text"
                                id="indicatorCode"
                                name="indicatorCode"
                                value={formData.indicatorCode}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Örn: IND001"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="indicatorName" className="form-label required">
                                Gösterge Adı
                            </label>
                            <input
                                type="text"
                                id="indicatorName"
                                name="indicatorName"
                                value={formData.indicatorName}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Gösterge adını girin"
                                required
                            />
                        </div>

                        <div className="form-group span-2">
                            <label htmlFor="description" className="form-label">
                                Gösterge Açıklaması
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="form-textarea"
                                placeholder="Gösterge hakkında açıklama yazın"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Departman ve Atama */}
                <div className="form-section">
                    <h2 className="section-title">Departman ve Atama</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="departmentId" className="form-label required">
                                Gösterge Grubu (Departman)
                            </label>
                            <select
                                id="departmentId"
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                            >
                                <option value="">Departman seçin</option>
                                {departments.map(dept => (
                                    <option key={dept.departmentId} value={dept.departmentId}>
                                        {dept.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="assignedUserId" className="form-label">
                                Atanacak Kişi
                            </label>
                            <select
                                id="assignedUserId"
                                name="assignedUserId"
                                value={formData.assignedUserId}
                                onChange={handleInputChange}
                                className="form-select"
                                disabled={!formData.departmentId || loadingUsers}
                            >
                                <option value="">Kullanıcı seçin</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </select>
                            {loadingUsers && <span className="loading-text">Kullanıcılar yükleniyor...</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="notificationUserId" className="form-label">
                                Uyarının Gideceği Kişi
                            </label>
                            <select
                                id="notificationUserId"
                                name="notificationUserId"
                                value={formData.notificationUserId}
                                onChange={handleInputChange}
                                className="form-select"
                                disabled={!formData.departmentId || loadingUsers}
                            >
                                <option value="">Kullanıcı seçin</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Gösterge Ayarları */}
                <div className="form-section">
                    <h2 className="section-title">Gösterge Ayarları</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="dataType" className="form-label required">
                                Gösterge Tipi
                            </label>
                            <select
                                id="dataType"
                                name="dataType"
                                value={formData.dataType}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                            >
                                {Object.entries(IndicatorDataType).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {getIndicatorDataTypeText(value)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="periodType" className="form-label required">
                                Periyot
                            </label>
                            <select
                                id="periodType"
                                name="periodType"
                                value={formData.periodType}
                                onChange={handleInputChange}
                                className="form-select"
                                required
                            >
                                {Object.entries(PeriodType).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {getPeriodTypeText(value)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="periodStartDate" className="form-label">
                                Periyot Başlangıcı
                            </label>
                            <input
                                type="date"
                                id="periodStartDate"
                                name="periodStartDate"
                                value={formData.periodStartDate}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="notificationPeriod" className="form-label">
                                Bilgilendirme Periyodu (Gün)
                            </label>
                            <input
                                type="number"
                                id="notificationPeriod"
                                name="notificationPeriod"
                                value={formData.notificationPeriod}
                                onChange={handleInputChange}
                                className="form-input"
                                min="1"
                                max="365"
                            />
                        </div>
                    </div>

                    <div className="form-checkboxes">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="form-checkbox"
                            />
                            <label htmlFor="isActive" className="checkbox-label">
                                Bu gösterge aktif
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="isAutomatic"
                                name="isAutomatic"
                                checked={formData.isAutomatic}
                                onChange={handleInputChange}
                                className="form-checkbox"
                            />
                            <label htmlFor="isAutomatic" className="checkbox-label">
                                Gösterge otomatik hesaplanacak
                            </label>
                        </div>
                    </div>
                </div>

                {/* Kök Değerler */}
                <div className="form-section">
                    <h2 className="section-title">Kök Değerler</h2>
                    <div className="dynamic-fields">
                        {formData.rootValues.map((rootValue, index) => (
                            <div key={index} className="dynamic-field-group">
                                <div className="dynamic-field-header">
                                    <h3>Kök Değer {index + 1}</h3>
                                    {formData.rootValues.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRootValue(index)}
                                            className="btn-remove"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <div className="dynamic-field-content">
                                    <div className="form-group">
                                        <label className="form-label required">Kök Değer</label>
                                        <input
                                            type="text"
                                            value={rootValue.rootValue}
                                            onChange={(e) => handleRootValueChange(index, 'rootValue', e.target.value)}
                                            className="form-input"
                                            placeholder="Kök değer adını girin"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Kök Değer Açıklaması</label>
                                        <textarea
                                            value={rootValue.description}
                                            onChange={(e) => handleRootValueChange(index, 'description', e.target.value)}
                                            className="form-textarea"
                                            placeholder="Açıklama yazın"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addRootValue}
                            className="btn-add-field"
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Yeni Kök Değer Ekle
                        </button>
                    </div>
                </div>

                {/* Geçmiş Dönem Verileri */}
                <div className="form-section">
                    <h2 className="section-title">Geçmiş Dönem Verileri</h2>
                    <div className="historical-data-grid">
                        {formData.historicalData.map((data, index) => (
                            <div key={index} className="historical-data-item">
                                <h3>{data.periodLabel}</h3>
                                <div className="form-group">
                                    <label className="form-label">Değer</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.value}
                                        onChange={(e) => handleHistoricalDataChange(index, 'value', e.target.value)}
                                        className="form-input"
                                        placeholder="Değer girin"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => handleHistoricalDataChange(index, 'description', e.target.value)}
                                        className="form-textarea"
                                        placeholder="Açıklama yazın"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Butonları */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={loading}
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Kaydediliyor...' : 'Gösterge Oluştur'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewIndicatorPage;
