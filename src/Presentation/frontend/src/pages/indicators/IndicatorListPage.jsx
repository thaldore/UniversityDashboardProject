import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import indicatorService from '../../services/api/indicatorService';
import { formatDate } from '../../services/utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/pages/indicator-list.css';

const IndicatorListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [indicators, setIndicators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expandedRootValues, setExpandedRootValues] = useState(new Set());
    const [exporting, setExporting] = useState(false);

    // Rol kontrolü - sadece Admin erişebilir
    const isAdmin = user?.roles?.includes('Admin');

    useEffect(() => {
        // Sadece Admin ise veri yükle
        if (isAdmin) {
            loadIndicators();
        } else {
            setLoading(false);
        }
    }, [isAdmin]);

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
        const indicator = indicators.find(ind => ind.indicatorId === id);
        
        if (!indicator) return;
        
        const isActive = indicator.isActive;
        const confirmMessage = isActive 
            ? 'Bu göstergeyi pasif duruma getirmek istediğinizden emin misiniz?'
            : 'Bu göstergeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!';
            
        if (window.confirm(confirmMessage)) {
            try {
                if (isActive) {
                    // Aktif göstergeyi soft delete yap (pasif yap)
                    await indicatorService.deleteIndicator(id);
                    setIndicators(prev => prev.map(indicator => 
                        indicator.indicatorId === id 
                            ? { ...indicator, isActive: false }
                            : indicator
                    ));
                } else {
                    // Pasif göstergeyi kalıcı olarak sil
                    await indicatorService.permanentDeleteIndicator(id);
                    setIndicators(prev => prev.filter(indicator => indicator.indicatorId !== id));
                }
            } catch (error) {
                setError('Gösterge silinirken hata oluştu.');
                console.error('Error deleting indicator:', error);
            }
        }
    };

    const toggleStatus = async (indicator) => {
        try {
            await indicatorService.toggleIndicatorStatus(indicator.indicatorId, !indicator.isActive);
            // Update status in state immediately
            setIndicators(prev => prev.map(ind => 
                ind.indicatorId === indicator.indicatorId 
                    ? { ...ind, isActive: !indicator.isActive }
                    : ind
            ));
        } catch (error) {
            setError('Gösterge durumu güncellenirken hata oluştu.');
            console.error('Error updating indicator status:', error);
        }
    };

    const toggleRootValuesExpansion = (indicatorId) => {
        setExpandedRootValues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(indicatorId)) {
                newSet.delete(indicatorId);
            } else {
                newSet.add(indicatorId);
            }
            return newSet;
        });
    };

    const handleExportToExcel = async () => {
        if (!window.confirm('Gösterge listesini Excel olarak indirmek istiyor musunuz?\n\nDosya tarayıcınızın varsayılan indirme klasörüne kaydedilecektir.')) {
            return;
        }

        setExporting(true);
        setError('');

        try {
            const blobData = await indicatorService.exportToExcel();
            
            console.log('Blob received:', blobData);
            console.log('Blob type:', typeof blobData);
            console.log('Is Blob:', blobData instanceof Blob);
            
            // Blob'un doğru şekilde oluşturulduğundan emin ol
            const blob = new Blob([blobData], { 
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            });
            
            console.log('Created Blob:', blob);
            console.log('Blob size:', blob.size);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Dosya adı - Tarayıcının indirme klasörüne indirilecek
            const fileName = `Gostergeler_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.download = fileName;
            
            // DOM'a ekle, tıkla ve temizle
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
            
            // Başarı mesajı
            setError(''); // Hata mesajını temizle
            alert(`✅ Excel dosyası başarıyla indirildi!\n\nDosya adı: ${fileName}\n\nDosya tarayıcınızın varsayılan indirme klasöründe (genellikle "İndirilenler" klasörü) bulunmaktadır.`);
        } catch (err) {
            console.error('Export error:', err);
            console.error('Error details:', err.message);
            console.error('Error stack:', err.stack);
            setError(`Excel dışa aktarımı sırasında bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
        } finally {
            setExporting(false);
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

    // Admin değilse erişim reddedildi mesajı göster
    if (!isAdmin) {
        return (
            <div className="access-denied">
                <div className="access-denied-content">
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h2>Erişim Reddedildi</h2>
                    <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
                    <p>Sadece Admin kullanıcıları gösterge yönetimi sayfasına erişebilir.</p>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div className="indicator-list-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Gösterge Yönetimi</h1>
                    <p className="page-subtitle">Sistem göstergelerini görüntüleyin ve yönetin</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-secondary btn-large"
                        onClick={handleExportToExcel}
                        disabled={exporting || loading}
                    >
                        {exporting ? (
                            <>
                                <svg className="icon spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                İndiriliyor...
                            </>
                        ) : (
                            <>
                                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Excel'e Aktar
                            </>
                        )}
                    </button>
                    <Link to="/indicators/new" className="btn btn-primary btn-large">
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Gösterge Ekle
                    </Link>
                </div>
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

            <div className="indicators-table-container scrollable">
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
                                    <span 
                                        className={`status-badge clickable ${indicator.isActive ? 'status-active' : 'status-inactive'}`}
                                        onClick={() => toggleStatus(indicator)}
                                        title="Durumu değiştirmek için tıklayın"
                                    >
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
                                        {expandedRootValues.has(indicator.indicatorId) ? (
                                            // Show all root values when expanded
                                            <>
                                                {indicator.rootValues.map((value, index) => (
                                                    <span key={index} className="root-value-tag small">{value}</span>
                                                ))}
                                                {indicator.rootValues.length > 2 && (
                                                    <button 
                                                        className="root-value-toggle small"
                                                        onClick={() => toggleRootValuesExpansion(indicator.indicatorId)}
                                                    >
                                                        Daralt
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            // Show limited root values
                                            <>
                                                {indicator.rootValues.slice(0, 2).map((value, index) => (
                                                    <span key={index} className="root-value-tag small">{value}</span>
                                                ))}
                                                {indicator.rootValues.length > 2 && (
                                                    <button 
                                                        className="root-value-more small"
                                                        onClick={() => toggleRootValuesExpansion(indicator.indicatorId)}
                                                    >
                                                        +{indicator.rootValues.length - 2} daha
                                                    </button>
                                                )}
                                            </>
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
                                            className={`action-btn ${indicator.isActive ? 'delete-btn' : 'permanent-delete-btn'}`}
                                            onClick={() => handleDelete(indicator.indicatorId)}
                                            title={indicator.isActive ? "Pasife Al" : "Kalıcı Sil"}
                                        >
                                            {indicator.isActive ? (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 12M6 6l12 12" />
                                                </svg>
                                            ) : (
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
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
