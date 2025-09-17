import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import chartService from '../../services/api/chartService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import ChartSectionManager from '../../components/charts/ChartSectionManager';
import ChartManager from '../../components/charts/ChartManager';
import ChartDisplay from '../../components/charts/ChartDisplay';
import { PlusIcon, SettingsIcon, ChevronDownIcon, ChevronRightIcon } from '../../components/common/Icons';
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
    
    // Hierarchical states
    const [expandedSections, setExpandedSections] = useState(new Set());
    const [loadingSections, setLoadingSections] = useState(new Set());
    const [loadingCharts, setLoadingCharts] = useState(new Set());

    const isAdmin = user?.roles?.includes('Admin') || false;

    // Helper function to find section in nested hierarchy
    const findSectionInHierarchy = (sectionsData, targetId) => {
        for (const section of sectionsData) {
            if (section.sectionId === targetId) {
                return section;
            }
            if (section.children) {
                const found = findSectionInHierarchy(section.children, targetId);
                if (found) return found;
            }
        }
        return null;
    };

    // Helper function to update nested subsections recursively
    const updateNestedSubSections = (sections, parentSectionId, subSectionId, updates) => {
        return sections.map(section => {
            // Check if this is the parent section
            if (section.id === parentSectionId) {
                return {
                    ...section,
                    subSections: section.subSections?.map(subSection =>
                        subSection.id === subSectionId
                            ? { ...subSection, ...updates }
                            : subSection
                    ) || []
                };
            }
            
            // Recursively search in subsections
            if (section.subSections) {
                const updateSubSections = (subSections) => {
                    return subSections.map(subSection => {
                        if (subSection.id === parentSectionId) {
                            return {
                                ...subSection,
                                subSections: subSection.subSections?.map(nestedSub =>
                                    nestedSub.id === subSectionId
                                        ? { ...nestedSub, ...updates }
                                        : nestedSub
                                ) || []
                            };
                        }
                        if (subSection.subSections) {
                            return {
                                ...subSection,
                                subSections: updateSubSections(subSection.subSections)
                            };
                        }
                        return subSection;
                    });
                };
                
                return {
                    ...section,
                    subSections: updateSubSections(section.subSections)
                };
            }
            
            return section;
        });
    };

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Load only root level chart sections (without charts)
            const sectionsResponse = await chartService.getChartSections();
            const sectionsData = sectionsResponse.data || [];
            
            console.log('Raw sections data from API:', sectionsData);
            
            // Map only root sections, don't preload subsections or charts
            const mappedSections = sectionsData.map(section => ({
                id: section.sectionId,
                title: section.sectionName || section.description || 'İsimsiz Başlık',
                description: section.description,
                parentSectionId: null,
                orderIndex: section.displayOrder,
                chartCount: section.chartCount,
                hasSubSections: section.children && section.children.length > 0,
                subSections: [], // We'll load these on demand
                isExpanded: false,
                isLoaded: false
            }));
            
            console.log('Mapped root sections for frontend:', mappedSections);
            setSections(() => mappedSections);
            
            // Clear charts - we'll load them on demand
            setCharts({});
            
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

    const handleSectionDelete = async () => {
        // Reload data but keep the modal open
        await loadData();
        // Don't close the modal for deletion
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

    // Load subsections and charts for a section when expanded
    const loadSectionData = async (sectionId, sectionData) => {
        try {
            setLoadingSections(prev => new Set(prev).add(sectionId));
            
            // If section has subsections, load them from API
            if (sectionData.hasSubSections && sectionData.subSections.length === 0) {
                const sectionsResponse = await chartService.getChartSections();
                const fullSectionData = sectionsResponse.data.find(s => s.sectionId === sectionId);
                
                if (fullSectionData && fullSectionData.children) {
                    const mappedSubSections = fullSectionData.children.map(child => ({
                        id: child.sectionId,
                        title: child.sectionName || child.description || 'İsimsiz Başlık',
                        description: child.description,
                        parentSectionId: sectionId,
                        orderIndex: child.displayOrder,
                        chartCount: child.chartCount,
                        hasSubSections: child.children && child.children.length > 0,
                        subSections: [],
                        isExpanded: false,
                        isLoaded: false
                    }));
                    
                    // Update sections with subsections
                    setSections(prevSections => {
                        return prevSections.map(section => 
                            section.id === sectionId 
                                ? { ...section, subSections: mappedSubSections, isLoaded: true }
                                : section
                        );
                    });
                }
            }
            
            // Load charts for this section if not already loaded
            if (!charts[sectionId]) {
                try {
                    const sectionCharts = await chartService.getChartsBySection(sectionId);
                    setCharts(prev => ({
                        ...prev,
                        [sectionId]: sectionCharts.data || []
                    }));
                } catch (err) {
                    console.error(`Error loading charts for section ${sectionId}:`, err);
                    setCharts(prev => ({
                        ...prev,
                        [sectionId]: []
                    }));
                }
            }
            
        } catch (err) {
            console.error('Error loading section data:', err);
            setError('Bölüm verileri yüklenirken bir hata oluştu.');
        } finally {
            setLoadingSections(prev => {
                const newSet = new Set(prev);
                newSet.delete(sectionId);
                return newSet;
            });
        }
    };

    // Toggle section expansion
    const toggleSection = async (sectionId) => {
        const section = sections.find(s => s.id === sectionId);
        if (!section) return;
        
        if (!section.isExpanded) {
            // Expanding - load data if needed
            if (!section.isLoaded) {
                await loadSectionData(sectionId, section);
            }
        }
        
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
        
        setSections(prevSections => {
            return prevSections.map(section => 
                section.id === sectionId 
                    ? { ...section, isExpanded: !section.isExpanded }
                    : section
            );
        });
    };

    // Toggle subsection expansion (recursive for nested subsections)
    const toggleSubSection = async (parentSectionId, subSectionId) => {
        // Find the parent section (could be a main section or a subsection)
        let parentSection = sections.find(s => s.id === parentSectionId);
        let subSection = null;
        
        if (parentSection) {
            subSection = parentSection.subSections?.find(s => s.id === subSectionId);
        } else {
            // Look for nested subsections
            for (const section of sections) {
                const findNestedSubSection = (subs, targetParentId, targetSubId) => {
                    for (const sub of subs || []) {
                        if (sub.id === targetParentId) {
                            return sub.subSections?.find(s => s.id === targetSubId);
                        }
                        if (sub.subSections) {
                            const found = findNestedSubSection(sub.subSections, targetParentId, targetSubId);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                
                subSection = findNestedSubSection(section.subSections, parentSectionId, subSectionId);
                if (subSection) break;
            }
        }
        
        if (!subSection) return;
        
        if (!subSection.isExpanded) {
            // Load subsections for this subsection if it has them and they're not loaded
            if (subSection.hasSubSections && (!subSection.subSections || subSection.subSections.length === 0)) {
                try {
                    const sectionsResponse = await chartService.getChartSections();
                    const fullSubSectionData = findSectionInHierarchy(sectionsResponse.data, subSectionId);
                    
                    if (fullSubSectionData && fullSubSectionData.children) {
                        const mappedNestedSubSections = fullSubSectionData.children.map(child => ({
                            id: child.sectionId,
                            title: child.sectionName || child.description || 'İsimsiz Başlık',
                            description: child.description,
                            parentSectionId: subSectionId,
                            orderIndex: child.displayOrder,
                            chartCount: child.chartCount,
                            hasSubSections: child.children && child.children.length > 0,
                            subSections: [],
                            isExpanded: false,
                            isLoaded: false
                        }));
                        
                        // Update the subsection with its nested subsections
                        setSections(prevSections => {
                            return updateNestedSubSections(prevSections, parentSectionId, subSectionId, {
                                subSections: mappedNestedSubSections
                            });
                        });
                    }
                } catch (err) {
                    console.error(`Error loading nested subsections for ${subSectionId}:`, err);
                }
            }
            
            // Load charts for subsection if not already loaded
            if (!charts[subSectionId]) {
                setLoadingCharts(prev => new Set(prev).add(subSectionId));
                try {
                    const subSectionCharts = await chartService.getChartsBySection(subSectionId);
                    setCharts(prev => ({
                        ...prev,
                        [subSectionId]: subSectionCharts.data || []
                    }));
                } catch (err) {
                    console.error(`Error loading charts for subsection ${subSectionId}:`, err);
                    setCharts(prev => ({
                        ...prev,
                        [subSectionId]: []
                    }));
                } finally {
                    setLoadingCharts(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(subSectionId);
                        return newSet;
                    });
                }
            }
        }
        
        // Toggle the expansion state
        setSections(prevSections => {
            return updateNestedSubSections(prevSections, parentSectionId, subSectionId, {
                isExpanded: !subSection.isExpanded
            });
        });
    };

    const renderSection = (section, level = 0) => {
        console.log(`Rendering section at level ${level}:`, section);
        const sectionCharts = charts[section.id] || [];
        const hasSubSections = section.hasSubSections || (section.subSections && section.subSections.length > 0);
        const isExpanded = section.isExpanded || expandedSections.has(section.id);
        const isLoadingSection = loadingSections.has(section.id);

        return (
            <div key={`section-${section.id}`} className={`chart-section level-${level}`}>
                <div className="section-header" onClick={() => level === 0 ? toggleSection(section.id) : null}>
                    <div className="section-title-container">
                        {/* Always show expand button for level 0 sections */}
                        {level === 0 && (
                            <button 
                                className="expand-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSection(section.id);
                                }}
                                disabled={isLoadingSection}
                            >
                                {isLoadingSection ? (
                                    <div className="loading-spinner small" />
                                ) : isExpanded ? (
                                    <ChevronDownIcon className="w-4 h-4" />
                                ) : (
                                    <ChevronRightIcon className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        <h3 className={`section-title level-${level} ${level === 0 ? 'expandable' : ''}`}>
                            {section.title}
                        </h3>
                    </div>
                    {isAdmin && (
                        <div className="section-actions" onClick={(e) => e.stopPropagation()}>
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

                {/* Expanded content */}
                {isExpanded && (
                    <div className="section-content">
                        {/* Sub sections */}
                        {hasSubSections && section.subSections.length > 0 && (
                            <div className="sub-sections">
                                {section.subSections.map(subSection => 
                                    renderSubSection(subSection, section.id, level + 1)
                                )}
                            </div>
                        )}

                        {/* Charts in this section (show only if expanded) */}
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

                        {/* Show message if expanded but no content */}
                        {isExpanded && !hasSubSections && sectionCharts.length === 0 && (
                            <div className="empty-content">
                                <p>Bu bölümde henüz içerik bulunmuyor.</p>
                                {isAdmin && (
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleCreateChart(section.id)}
                                    >
                                        İlk Grafiği Ekle
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderSubSection = (subSection, parentSectionId, level = 1) => {
        const subSectionCharts = charts[subSection.id] || [];
        const isExpanded = subSection.isExpanded;
        const isLoadingCharts = loadingCharts.has(subSection.id);
        const hasSubSections = subSection.hasSubSections || (subSection.subSections && subSection.subSections.length > 0);

        return (
            <div key={`subsection-${subSection.id}`} className={`chart-section level-${level}`}>
                <div className="section-header" onClick={() => toggleSubSection(parentSectionId, subSection.id)}>
                    <div className="section-title-container">
                        <button 
                            className="expand-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSubSection(parentSectionId, subSection.id);
                            }}
                            disabled={isLoadingCharts}
                        >
                            {isLoadingCharts ? (
                                <div className="loading-spinner small" />
                            ) : isExpanded ? (
                                <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                                <ChevronRightIcon className="w-4 h-4" />
                            )}
                        </button>
                        <h4 className={`section-title level-${level} expandable`}>
                            {subSection.title}
                        </h4>
                        {subSection.chartCount > 0 && (
                            <span className="chart-count">({subSection.chartCount} grafik)</span>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="section-actions" onClick={(e) => e.stopPropagation()}>
                            <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => handleCreateChart(subSection.id)}
                                title="Grafik Ekle"
                            >
                                <PlusIcon className="w-4 h-4" />
                            </button>
                            <button 
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                    setEditingSection(subSection);
                                    setShowSectionManager(true);
                                }}
                                title="Başlık Düzenle"
                            >
                                <SettingsIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {subSection.description && (
                    <p className="section-description">{subSection.description}</p>
                )}

                {/* Expanded content */}
                {isExpanded && (
                    <div className="section-content">
                        {/* Sub-subsections (nested subsections) */}
                        {hasSubSections && subSection.subSections && subSection.subSections.length > 0 && (
                            <div className="sub-sections">
                                {subSection.subSections.map(nestedSubSection => 
                                    renderSubSection(nestedSubSection, subSection.id, level + 1)
                                )}
                            </div>
                        )}

                        {/* Charts in subsection */}
                        {subSectionCharts.length > 0 && (
                            <div className="charts-container">
                                {subSectionCharts.map(chart => (
                                    <div key={`chart-${chart.chartId || chart.id}`} className="chart-item">
                                        <div className="chart-header">
                                            <h5 className="chart-title">{chart.title || chart.chartName}</h5>
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

                        {/* Show empty message only if no charts and no subsections */}
                        {!hasSubSections && subSectionCharts.length === 0 && (
                            <div className="empty-content">
                                <p>Bu alt bölümde henüz grafik bulunmuyor.</p>
                                {isAdmin && (
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleCreateChart(subSection.id)}
                                    >
                                        İlk Grafiği Ekle
                                    </button>
                                )}
                            </div>
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
                    onDelete={handleSectionDelete}
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
