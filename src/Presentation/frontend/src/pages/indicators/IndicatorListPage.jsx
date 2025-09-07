import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import indicatorService from '../../services/api/indicatorService';
import { formatDate } from '../../services/utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/pages/indicator-list.css';

const IndicatorListPage = () => {
    const navigate = useNavigate();
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadIndicators();
    }, []);

    const loadIndicators = async () => {
        try {
            setLoading(true);
            const data = await indicatorService.getIndicatorList();
            setIndicators(data);
        } catch (error) {
            setError('Göstergeler yüklenirken hata oluştu.');
            console.error('Error loading indicators:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu göstergeyi silmek istediğinizden emin misiniz?')) {
            try {
                await indicatorService.deleteIndicator(id);
                await loadIndicators();
            } catch (error) {
                setError('Gösterge silinirken hata oluştu.');
                console.error('Error deleting indicator:', error);
            }
        }
    };

    const filteredIndicators = indicators.filter(indicator => {
        const matchesSearch = indicator.indicatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            indicator.indicatorCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            indicator.departmentName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'active' && indicator.isActive) ||
                            (filterStatus === 'inactive' && !indicator.isActive);
        
        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingSpinner />;

    return (
        <div className="indicator-list-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Gösterge Yönetimi</h1>
                    <p className="page-subtitle">Sistem göstergelerini görüntüleyin ve yönetin</p>
                </div>
                <Link to="/indicators/new" className="btn btn-primary btn-large">
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Gösterge Ekle
                </Link>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="filters-section">
                <div className="search-container">
                    <div className="search-input-group">
                        <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Gösterge adı, kodu veya departman ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
                
                <div className="filter-tabs">
                    <button 
                        className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Tümü ({indicators.length})
                    </button>
                    <button 
                        className={`filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('active')}
                    >
                        Aktif ({indicators.filter(i => i.isActive).length})
                    </button>
                    <button 
                        className={`filter-tab ${filterStatus === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('inactive')}
                    >
                        Pasif ({indicators.filter(i => !i.isActive).length})
                    </button>
                </div>
            </div>

            <div className="indicators-table-container">
                <table className="indicators-table">
                    <thead>
                        <tr>
                            <th>Durum</th>
                            <th>Gösterge Kodu</th>
                            <th>Gösterge Adı</th>
                            <th>Departman</th>
                            <th>Gösterge Tipi</th>
                            <th>Kök Değerler</th>
                            <th>Atanan Kullanıcı</th>
                            <th>Oluşturma Tarihi</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredIndicators.map((indicator) => (
                            <tr key={indicator.indicatorId} className={!indicator.isActive ? 'inactive-row' : ''}>
                                <td>
                                    <span className={`status-badge ${indicator.isActive ? 'status-active' : 'status-inactive'}`}>
                                        {indicator.isActive ? 'Aktif' : 'Pasif'}
                                    </span>
                                </td>
                                <td>
                                    <span className="indicator-code">{indicator.indicatorCode}</span>
                                </td>
                                <td>
                                    <div className="indicator-name-cell">
                                        <span className="indicator-name">{indicator.indicatorName}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="department-name">{indicator.departmentName}</span>
                                </td>
                                <td>
                                    <span className="data-type">{indicator.dataTypeName}</span>
                                </td>
                                <td>
                                    <div className="root-values">
                                        {indicator.rootValues.slice(0, 2).map((value, index) => (
                                            <span key={index} className="root-value-tag">{value}</span>
                                        ))}
                                        {indicator.rootValues.length > 2 && (
                                            <span className="root-value-more">+{indicator.rootValues.length - 2} daha</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="assigned-user">{indicator.assignedUserName || '-'}</span>
                                </td>
                                <td>
                                    <span className="created-date">{formatDate(indicator.createdAt)}</span>
                                </td>
                                <td>
                                    <div className="actions-inline">
                                        <button 
                                            className="action-btn edit-btn"
                                            onClick={() => navigate(`/indicators/edit/${indicator.indicatorId}`)}
                                            title="Düzenle"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(indicator.indicatorId)}
                                            title="Sil"
                                        >
                                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredIndicators.length === 0 && !loading && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3>Gösterge bulunamadı</h3>
                        <p>Arama kriterlerinizle eşleşen gösterge bulunmamaktadır.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IndicatorListPage;
