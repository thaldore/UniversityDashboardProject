import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import indicatorService from '../../services/api/indicatorService';
import periodService from '../../services/periodService';
import { DataStatus, getDataStatusBadgeClass, formatValue } from '../../services/utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/pages/data-entry-compact.css';

const DataEntryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [indicators, setIndicators] = useState([]);
    const [availablePeriods, setAvailablePeriods] = useState([]);
    
    // Get current period as default
    const currentPeriod = periodService.getCurrentPeriod();
    const [period, setPeriod] = useState({
        year: currentPeriod.year,
        period: currentPeriod.period
    });
    
    const [formData, setFormData] = useState({
        dataItems: [],
        generalNotes: ''
    });

    useEffect(() => {
        loadDataEntryForm();
        loadAvailablePeriods();
    }, [period.year, period.period]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAvailablePeriods = () => {
        // Generate periods for the last 3 years and next 2 years
        const currentYear = new Date().getFullYear();
        const periods = periodService.generateAvailablePeriods(
            currentYear - 3,
            currentYear + 2,
            'Quarter' // Default to quarterly periods
        );
        setAvailablePeriods(periods);
    };

    const loadDataEntryForm = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await indicatorService.getDataEntryForm(period.year, period.period);
            setIndicators(data);
            
            // Form verilerini hazırla
            const dataItems = data.map(indicator => ({
                indicatorId: indicator.indicatorId,
                year: period.year,
                period: period.period,
                value: indicator.currentValue || '',
                status: indicator.status || DataStatus.Draft,
                notes: indicator.notes || ''
            }));
            
            setFormData(prev => ({
                ...prev,
                dataItems
            }));
        } catch (error) {
            setError('Veri giriş formu yüklenirken hata oluştu.');
            console.error('Error loading data entry form:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDataItemChange = (indicatorId, field, value) => {
        setFormData(prev => ({
            ...prev,
            dataItems: prev.dataItems.map(item =>
                item.indicatorId === indicatorId
                    ? { ...item, [field]: field === 'value' ? (value === '' ? '' : parseFloat(value)) : value }
                    : item
            )
        }));
    };

    const handleGeneralNotesChange = (value) => {
        setFormData(prev => ({
            ...prev,
            generalNotes: value
        }));
    };

    const validateForm = () => {
        const hasData = formData.dataItems.some(item => item.value !== '');
        if (!hasData) {
            setError('En az bir gösterge için değer girmelisiniz.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (isDraft = true) => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const submitData = {
                ...formData,
                dataItems: formData.dataItems.filter(item => item.value !== ''),
                isDraft
            };

            await indicatorService.saveIndicatorData(submitData);
            
            const message = isDraft 
                ? 'Veriler taslak olarak kaydedildi!' 
                : 'Veriler başarıyla gönderildi!';
            
            setSuccess(message);
            
            // Formu yeniden yükle
            setTimeout(() => {
                loadDataEntryForm();
                setSuccess('');
            }, 2000);
            
        } catch (error) {
            setError('Veriler kaydedilirken hata oluştu.');
            console.error('Error saving data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => handleSubmit(true);
    const handleSubmitForm = () => handleSubmit(false);

    const getStatusIcon = (status) => {
        switch (status) {
            case DataStatus.Draft:
                return (
                    <svg className="status-icon draft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case DataStatus.Submitted:
                return (
                    <svg className="status-icon submitted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                );
            case DataStatus.Approved:
                return (
                    <svg className="status-icon approved" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    if (loading && indicators.length === 0) return <LoadingSpinner />;

    return (
        <div className="data-entry-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Gösterge Veri Girişi</h1>
                    <p className="page-subtitle">Gösterge değerlerini girin ve kaydedin</p>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}
            {success && (
                <div className="success-message">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {success}
                </div>
            )}

            <div className="data-entry-container">
                {/* Dönem Seçimi */}
                <div className="period-selection">
                    <h2 className="section-title">Dönem Seçimi</h2>
                    <div className="period-controls">
                        <div className="period-group">
                            <label htmlFor="period-select" className="period-label">Dönem</label>
                            <select
                                id="period-select"
                                value={`${period.year}-${period.period}`}
                                onChange={(e) => {
                                    const [year, periodNum] = e.target.value.split('-');
                                    setPeriod({
                                        year: parseInt(year),
                                        period: parseInt(periodNum)
                                    });
                                }}
                                className="period-select"
                                disabled={loading}
                            >
                                {availablePeriods.map(p => (
                                    <option key={p.value} value={p.value}>
                                        {p.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="period-info">
                            <span className="current-period-indicator">
                                {period.year === new Date().getFullYear() && 
                                 period.period === periodService.getCurrentPeriod().period ? 
                                 '● Mevcut Dönem' : '○ Geçmiş/Gelecek Dönem'}
                            </span>
                        </div>
                    </div>
                </div>

            {/* Veri Giriş Tablosu */}
            <div className="data-table-container">
                <h2 className="section-title">Gösterge Verileri</h2>
                
                {indicators.length === 0 && !loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3>Veri girişi için gösterge bulunamadı</h3>
                        <p>Seçilen dönem için size atanmış gösterge bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Gösterge Kodu</th>
                                    <th>Gösterge Adı</th>
                                    <th>Açıklama</th>
                                    <th>Otomatik</th>
                                    <th>Değer</th>
                                    <th>Geçmiş Dönem 1</th>
                                    <th>Geçmiş Dönem 2</th>
                                    <th>Durum</th>
                                    <th>Açıklama</th>
                                </tr>
                            </thead>
                            <tbody>
                                {indicators.map((indicator) => {
                                    const dataItem = formData.dataItems.find(item => item.indicatorId === indicator.indicatorId);
                                    return (
                                        <tr key={indicator.indicatorId}>
                                            <td>
                                                <span className="indicator-code">{indicator.indicatorCode}</span>
                                            </td>
                                            <td>
                                                <div className="indicator-name-cell">
                                                    <span className="indicator-name">{indicator.indicatorName}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="indicator-description">
                                                    {indicator.description || '-'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="automatic-indicator">
                                                    {indicator.isAutomatic ? (
                                                        <div className="automatic-badge">
                                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                            </svg>
                                                            <span>Otomatik</span>
                                                        </div>
                                                    ) : (
                                                        <span className="manual-text">Manuel</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="value-input-container">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={dataItem?.value || ''}
                                                        onChange={(e) => handleDataItemChange(indicator.indicatorId, 'value', e.target.value)}
                                                        className="value-input"
                                                        disabled={indicator.isAutomatic || loading}
                                                        placeholder="Değer girin"
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="historical-data">
                                                    {indicator.historicalData && indicator.historicalData.length > 0 ? (
                                                        <div className="historical-item">
                                                            <span className="historical-value">
                                                                {formatValue(indicator.historicalData[0].value, indicator.dataType)}
                                                            </span>
                                                            <small className="historical-period">
                                                                {indicator.historicalData[0].periodLabel}
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <span className="no-data">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="historical-data">
                                                    {indicator.historicalData && indicator.historicalData.length > 1 ? (
                                                        <div className="historical-item">
                                                            <span className="historical-value">
                                                                {formatValue(indicator.historicalData[1].value, indicator.dataType)}
                                                            </span>
                                                            <small className="historical-period">
                                                                {indicator.historicalData[1].periodLabel}
                                                            </small>
                                                        </div>
                                                    ) : (
                                                        <span className="no-data">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="status-cell">
                                                    <select
                                                        value={dataItem?.status || DataStatus.Draft}
                                                        onChange={(e) => handleDataItemChange(indicator.indicatorId, 'status', parseInt(e.target.value))}
                                                        className={`status-select ${getDataStatusBadgeClass(dataItem?.status || DataStatus.Draft)}`}
                                                        disabled={loading}
                                                    >
                                                        <option value={DataStatus.Draft}>Taslak</option>
                                                        <option value={DataStatus.Submitted}>Gönderildi</option>
                                                        <option value={DataStatus.Approved}>Onaylandı</option>
                                                    </select>
                                                    {getStatusIcon(dataItem?.status || DataStatus.Draft)}
                                                </div>
                                            </td>
                                            <td>
                                                <textarea
                                                    value={dataItem?.notes || ''}
                                                    onChange={(e) => handleDataItemChange(indicator.indicatorId, 'notes', e.target.value)}
                                                    className="notes-input"
                                                    placeholder="Açıklama..."
                                                    rows={2}
                                                    disabled={loading}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

                {/* Genel Açıklama */}
                {indicators.length > 0 && (
                    <div className="general-notes">
                        <div className="notes-group">
                            <label className="notes-label">Genel Açıklama</label>
                            <textarea
                                value={formData.generalNotes}
                                onChange={(e) => handleGeneralNotesChange(e.target.value)}
                                className="general-notes-textarea"
                                placeholder="Bu dönem için genel açıklama yazın..."
                                disabled={loading}
                            />
                        </div>
                    </div>
                )}

                {/* Form Butonları */}
                {indicators.length > 0 && (
                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            İptal
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            {loading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitForm}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {loading ? 'Gönderiliyor...' : 'Kaydet ve Gönder'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataEntryPage;
