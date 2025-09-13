import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import chartService from '../../services/api/chartService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import ChartSectionManager from '../../components/charts/ChartSectionManager';
import ChartManager from '../../components/charts/ChartManager';
import ChartDisplay from '../../components/charts/ChartDisplay';
import { PlusIcon, SettingsIcon } from '../../components/common/Icons';
import '../../styles/pages/charts.css';

const ChartsPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sections, setSections] = useState([]);
    const [charts, setCharts] = useState({});
    const [indicators, setIndicators] = useState([]);
    
    // Modal states
    const [showSectionManager, setShowSectionManager] = useState(false);
    const [showChartManager, setShowChartManager] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedChart, setSelectedChart] = useState(null);
    const [editingSection, setEditingSection] = useState(null);

    const isAdmin = user?.roles?.includes('Admin') || false;

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Load chart sections
            const sectionsResponse = await chartService.getChartSections();
            const sectionsData = sectionsResponse.data || [];
            
            console.log('Raw sections data from API:', sectionsData);
            
            // Map backend response to frontend format
            const mappedSections = sectionsData.map(section => ({
                id: section.sectionId,
                title: section.sectionName || section.description || 'İsimsiz Başlık',
                description: section.description,
                parentSectionId: null, // Root sections
                orderIndex: section.displayOrder,
                chartCount: section.chartCount,
                subSections: section.children?.map(child => ({
                    id: child.sectionId,
                    title: child.sectionName || child.description || 'İsimsiz Başlık', 
                    description: child.description,
                    parentSectionId: section.sectionId,
                    orderIndex: child.displayOrder,
                    chartCount: child.chartCount,
                    subSections: child.children?.map(grandChild => ({
                        id: grandChild.sectionId,
                        title: grandChild.sectionName || grandChild.description || 'İsimsiz Başlık',
                        description: grandChild.description,
                        parentSectionId: child.sectionId,
                        orderIndex: grandChild.displayOrder,
                        chartCount: grandChild.chartCount,
                        subSections: []
                    })) || []
                })) || []
            }));
            
            console.log('Mapped sections for frontend:', mappedSections);
            
            // Force re-render by using functional state update
            setSections(() => mappedSections);
            
            // Load charts for each section
            const chartsData = {};
            if (mappedSections && mappedSections.length > 0) {
                for (const section of mappedSections) {
                    try {
                        const sectionCharts = await chartService.getChartsBySection(section.id);
                        chartsData[section.id] = sectionCharts.data || [];
                    } catch (err) {
                        console.error(`Error loading charts for section ${section.id}:`, err);
                        chartsData[section.id] = [];
                    }
                    
                    // Also load charts for subsections
                    if (section.subSections) {
                        for (const subSection of section.subSections) {
                            try {
                                const subSectionCharts = await chartService.getChartsBySection(subSection.id);
                                chartsData[subSection.id] = subSectionCharts.data || [];
                            } catch (err) {
                                console.error(`Error loading charts for subsection ${subSection.id}:`, err);
                                chartsData[subSection.id] = [];
                            }
                            
                            // Load charts for sub-subsections
                            if (subSection.subSections) {
                                for (const grandChild of subSection.subSections) {
                                    try {
                                        const grandChildCharts = await chartService.getChartsBySection(grandChild.id);
                                        chartsData[grandChild.id] = grandChildCharts.data || [];
                                    } catch (err) {
                                        console.error(`Error loading charts for sub-subsection ${grandChild.id}:`, err);
                                        chartsData[grandChild.id] = [];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            console.log('Charts data loaded:', chartsData);
            setCharts(() => chartsData);
            
            // Load indicators for chart creation/editing
            if (isAdmin) {
                try {
                    const indicatorsResponse = await chartService.getIndicators();
                    setIndicators(indicatorsResponse.data || []);
                } catch (err) {
                    console.error('Error loading indicators:', err);
                    setIndicators([]);
                }
            }
            
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Veriler yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        console.log('ChartsPage useEffect triggered, isAdmin:', isAdmin);
        const fetchData = async () => {
            try {
                await loadData();
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Veriler yüklenirken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [loadData, isAdmin]); // Include all dependencies

    const handleSectionUpdate = async () => {
        await loadData();
        setShowSectionManager(false);
        setEditingSection(null);
    };

    const handleChartUpdate = async () => {
        await loadData();
        setShowChartManager(false);
        setSelectedChart(null);
        setSelectedSection(null);
    };

    const handleCreateChart = (sectionId) => {
        setSelectedSection(sectionId);
        setSelectedChart(null);
        setShowChartManager(true);
    };

    const handleEditChart = (chart) => {
        setSelectedChart(chart);
        setSelectedSection(chart.sectionId);
        setShowChartManager(true);
    };

    const handleDeleteChart = async (chartId) => {
        if (!window.confirm('Bu grafiği silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            await chartService.deleteChart(chartId);
            await loadData();
        } catch (err) {
            console.error('Error deleting chart:', err);
            setError('Grafik silinirken bir hata oluştu.');
        }
    };

    const renderSection = (section, level = 0) => {
        console.log(`Rendering section at level ${level}:`, section);
        const sectionCharts = charts[section.id] || [];
        const hasSubSections = section.subSections && section.subSections.length > 0;

        return (
            <div key={`section-${section.id}`} className={`chart-section level-${level}`}>
                <div className="section-header">
                    <h3 className={`section-title level-${level}`}>
                        {section.title}
                    </h3>
                    {isAdmin && (
                        <div className="section-actions">
                            <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => handleCreateChart(section.id)}
                                title="Grafik Ekle"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Grafik Ekle
                            </button>
                            <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    setEditingSection(section);
                                    setShowSectionManager(true);
                                }}
                                title="Başlık Düzenle"
                            >
                                <SettingsIcon className="w-4 h-4" />
                                Düzenle
                            </button>
                        </div>
                    )}
                </div>

                {section.description && (
                    <p className="section-description">{section.description}</p>
                )}

                {/* Charts in this section */}
                {sectionCharts.length > 0 && (
                    <div className="charts-container">
                        {sectionCharts.map(chart => (
                            <div key={`chart-${chart.chartId || chart.id}`} className="chart-item">
                                <div className="chart-header">
                                    <h4 className="chart-title">{chart.title || chart.chartName}</h4>
                                    {isAdmin && (
                                        <div className="chart-actions">
                                            <button 
                                                className="btn btn-xs btn-primary"
                                                onClick={() => handleEditChart(chart)}
                                            >
                                                Düzenle
                                            </button>
                                            <button 
                                                className="btn btn-xs btn-danger"
                                                onClick={() => handleDeleteChart(chart.chartId || chart.id)}
                                            >
                                                Sil
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <ChartDisplay chart={chart} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Sub sections */}
                {hasSubSections && (
                    <div className="sub-sections">
                        {section.subSections.map(subSection => 
                            renderSection(subSection, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <LoadingSpinner message="Grafikler yükleniyor..." />;
    }

    return (
        <ErrorBoundary>
            <div className="charts-page">
            <div className="page-header">
                <div className="header-content">
                    <h1>Grafikler</h1>
                    <p>Üniversite verilerinin görsel analizi</p>
                </div>
                {isAdmin && (
                    <div className="header-actions">
                        <button 
                            className="btn btn-primary"
                            onClick={() => {
                                setEditingSection(null);
                                setShowSectionManager(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5" />
                            Başlık Yönetimi
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <ErrorMessage 
                    message={error} 
                    onClose={() => setError('')} 
                />
            )}

            <div className="charts-content">
                {sections.length === 0 ? (
                    <div className="empty-state">
                        <p>Henüz grafik başlığı oluşturulmamış.</p>
                        {isAdmin && (
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowSectionManager(true)}
                            >
                                İlk Başlığı Oluştur
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="sections-container">
                        {sections.map(section => renderSection(section))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showSectionManager && (
                <ChartSectionManager
                    isOpen={showSectionManager}
                    onClose={() => {
                        setShowSectionManager(false);
                        setEditingSection(null);
                    }}
                    onSuccess={handleSectionUpdate}
                    sections={sections}
                    editingSection={editingSection}
                />
            )}

            {showChartManager && (
                <ChartManager
                    isOpen={showChartManager}
                    onClose={() => {
                        setShowChartManager(false);
                        setSelectedChart(null);
                        setSelectedSection(null);
                    }}
                    onSuccess={handleChartUpdate}
                    sectionId={selectedSection}
                    chart={selectedChart}
                    indicators={indicators}
                />
            )}
            </div>
        </ErrorBoundary>
    );
};

export default ChartsPage;
