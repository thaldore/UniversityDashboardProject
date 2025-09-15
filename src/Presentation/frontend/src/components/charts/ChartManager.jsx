import React, { useState, useEffect } from 'react';
import chartService from '../../services/api/chartService';
import { ChartType, HistoricalDataDisplayType, CHART_COLORS } from '../../services/utils/chartConstants';
import { CloseIcon, PlusIcon, TrashIcon } from '../common/Icons';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import '../../styles/components/chart-modals.css';

const ChartManager = ({ isOpen, onClose, onSuccess, sectionId, chart, indicators = [] }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartDetail, setChartDetail] = useState(null);
    const [formData, setFormData] = useState({
        chartName: '',
        chartType: ChartType.PieChart,
        title: '',
        subtitle: '',
        description: '',
        sectionId: sectionId || null,
        displayOrder: 1,
        isActive: true,
        showHistoricalData: false,
        historicalDataDisplayType: null,
        showHistoricalInChart: false,
        historicalPeriodCount: 3
    });

    const [selectedIndicators, setSelectedIndicators] = useState([]);
    const [chartFilters, setChartFilters] = useState([]);
    const [chartGroups, setChartGroups] = useState([]);
    const [indicatorSearchTerm, setIndicatorSearchTerm] = useState('');

    // Fetch chart details when editing
    useEffect(() => {
        const fetchChartDetail = async () => {
            if (chart && chart.chartId) {
                try {
                    setLoading(true);
                    console.log('Fetching chart detail for chartId:', chart.chartId);
                    const response = await chartService.getChartById(chart.chartId);
                    console.log('Chart detail response:', response);
                    console.log('Chart detail data:', response.data);
                    setChartDetail(response);
                } catch (err) {
                    console.error('Error fetching chart detail:', err);
                    setError('Chart detayları yüklenirken hata oluştu');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (isOpen && chart) {
            fetchChartDetail();
        }
    }, [isOpen, chart]);

    // Initialize form data when component mounts or chart changes
    useEffect(() => {
        const sourceChart = chartDetail ? chartDetail.data : (chart ? chart : null);
        if (sourceChart) {
            // Edit mode - populate form with existing chart data
            console.log('ChartManager editing chart - ALL PROPERTIES:', sourceChart);
            console.log('Chart object keys:', Object.keys(sourceChart));
            console.log('Chart historical settings:', {
                showHistoricalData: sourceChart.showHistoricalData,
                showHistoricalInChart: sourceChart.showHistoricalInChart,
                historicalPeriodCount: sourceChart.historicalPeriodCount,
                historicalDataDisplayType: sourceChart.historicalDataDisplayType,
                // PascalCase versions
                ShowHistoricalData: sourceChart.ShowHistoricalData,
                ShowHistoricalInChart: sourceChart.ShowHistoricalInChart,
                HistoricalPeriodCount: sourceChart.HistoricalPeriodCount,
                HistoricalDataDisplayType: sourceChart.HistoricalDataDisplayType
            });

            setFormData({
                chartName: sourceChart.chartName || sourceChart.ChartName || '',
                chartType: sourceChart.chartType || sourceChart.ChartType || ChartType.PieChart,
                title: sourceChart.title || sourceChart.Title || '',
                subtitle: sourceChart.subtitle || sourceChart.Subtitle || '',
                description: sourceChart.description || sourceChart.Description || '',
                sectionId: sourceChart.sectionId || sourceChart.SectionId || sectionId,
                displayOrder: sourceChart.displayOrder || sourceChart.DisplayOrder || 1,
                isActive: sourceChart.isActive !== undefined ? sourceChart.isActive : true,
                showHistoricalData: sourceChart.showHistoricalData || sourceChart.ShowHistoricalData || false,
                historicalDataDisplayType: sourceChart.historicalDataDisplayType || sourceChart.HistoricalDataDisplayType || null,
                showHistoricalInChart: sourceChart.showHistoricalInChart || sourceChart.ShowHistoricalInChart || false,
                historicalPeriodCount: sourceChart.historicalPeriodCount || sourceChart.HistoricalPeriodCount || 3
            });

            // Load existing indicators, filters, and groups if editing
            if ((sourceChart.indicators && sourceChart.indicators.length > 0) || (sourceChart.Indicators && sourceChart.Indicators.length > 0)) {
                const indicators = sourceChart.indicators || sourceChart.Indicators || [];
                console.log('Original chart indicators:', indicators);
                console.log('Indicators array length:', indicators.length);
                
                const mappedIndicators = indicators.map((ind, index) => {
                    console.log(`Processing indicator ${index}:`, ind);
                    const mapped = {
                        indicatorId: ind.indicatorId || ind.IndicatorId || ind.id,
                        displayOrder: ind.displayOrder || ind.DisplayOrder || index + 1,
                        color: ind.color || ind.Color || CHART_COLORS[index % CHART_COLORS.length],
                        label: ind.label || ind.Label || ind.indicatorName || ind.IndicatorName || ind.name || '',
                        isVisible: ind.isVisible !== undefined ? ind.isVisible : (ind.IsVisible !== undefined ? ind.IsVisible : true)
                    };
                    console.log(`Mapped indicator ${index}:`, { original: ind, mapped });
                    return mapped;
                });
                
                console.log('Final mapped indicators:', mappedIndicators);
                setSelectedIndicators(mappedIndicators);
            } else {
                console.log('No indicators found in chart. Checking both camelCase and PascalCase:', {
                    'sourceChart.indicators': sourceChart.indicators,
                    'sourceChart.Indicators': sourceChart.Indicators
                });
                setSelectedIndicators([]);
            }

            if (sourceChart.filters || sourceChart.Filters) {
                const filters = sourceChart.filters || sourceChart.Filters || [];
                console.log('Chart filters found:', filters);
                setChartFilters(filters);
            } else {
                console.log('No filters found');
                setChartFilters([]);
            }

            if (sourceChart.groups || sourceChart.Groups) {
                const groups = sourceChart.groups || sourceChart.Groups || [];
                console.log('Chart groups found:', groups);
                setChartGroups(groups);
            } else {
                console.log('No groups found');
                setChartGroups([]);
            }
        } else {
            // Create mode - reset form
            setFormData({
                chartName: '',
                chartType: ChartType.PieChart,
                title: '',
                subtitle: '',
                description: '',
                sectionId: sectionId || null,
                displayOrder: 1,
                isActive: true,
                showHistoricalData: false,
                historicalDataDisplayType: null,
                showHistoricalInChart: false,
                historicalPeriodCount: 3
            });
            setSelectedIndicators([]);
            setChartFilters([]);
            setChartGroups([]);
        }
    }, [chart, chartDetail, sectionId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddIndicator = (indicator) => {
        if (selectedIndicators.find(ind => ind.indicatorId === indicator.id)) {
            return; // Already added
        }

        const newIndicator = {
            indicatorId: indicator.id,
            displayOrder: selectedIndicators.length + 1,
            color: CHART_COLORS[selectedIndicators.length % CHART_COLORS.length],
            label: indicator.name,
            isVisible: true
        };

        setSelectedIndicators(prev => [...prev, newIndicator]);
    };

    const handleRemoveIndicator = (indicatorId) => {
        setSelectedIndicators(prev => 
            prev.filter(ind => ind.indicatorId !== indicatorId)
                .map((ind, index) => ({ ...ind, displayOrder: index + 1 }))
        );
    };

    const handleIndicatorChange = (indicatorId, field, value) => {
        setSelectedIndicators(prev =>
            prev.map(ind =>
                ind.indicatorId === indicatorId
                    ? { ...ind, [field]: value }
                    : ind
            )
        );
    };

    const handleAddFilter = () => {
        const newFilter = {
            filterName: '',
            filterType: 2, // Faculty
            filterValue: '',
            isDefault: chartFilters.length === 0,
            displayOrder: chartFilters.length + 1,
            indicatorIds: []
        };
        setChartFilters(prev => [...prev, newFilter]);
    };

    const handleRemoveFilter = (index) => {
        setChartFilters(prev => prev.filter((_, i) => i !== index));
    };

    const handleFilterChange = (index, field, value) => {
        setChartFilters(prev =>
            prev.map((filter, i) =>
                i === index ? { ...filter, [field]: value } : filter
            )
        );
    };

    const handleAddGroup = () => {
        const newGroup = {
            groupName: '',
            description: '',
            displayOrder: chartGroups.length + 1,
            color: CHART_COLORS[chartGroups.length % CHART_COLORS.length],
            indicatorIds: []
        };
        setChartGroups(prev => [...prev, newGroup]);
    };

    const handleRemoveGroup = (index) => {
        setChartGroups(prev => prev.filter((_, i) => i !== index));
    };

    const handleGroupChange = (index, field, value) => {
        setChartGroups(prev =>
            prev.map((group, i) =>
                i === index ? { ...group, [field]: value } : group
            )
        );
    };

    // Filter indicators based on search term
    const filteredIndicators = indicators.filter(indicator =>
        indicator.name.toLowerCase().includes(indicatorSearchTerm.toLowerCase()) ||
        indicator.indicatorCode.toLowerCase().includes(indicatorSearchTerm.toLowerCase())
    );

    // Handle adding indicator to filter
    const handleAddIndicatorToFilter = (filterIndex, indicatorId) => {
        setChartFilters(prev =>
            prev.map((filter, i) =>
                i === filterIndex
                    ? { ...filter, indicatorIds: [...filter.indicatorIds, indicatorId] }
                    : filter
            )
        );
    };

    // Handle removing indicator from filter
    const handleRemoveIndicatorFromFilter = (filterIndex, indicatorId) => {
        setChartFilters(prev =>
            prev.map((filter, i) =>
                i === filterIndex
                    ? { ...filter, indicatorIds: filter.indicatorIds.filter(id => id !== indicatorId) }
                    : filter
            )
        );
    };

    // Handle adding indicator to group
    const handleAddIndicatorToGroup = (groupIndex, indicatorId) => {
        setChartGroups(prev =>
            prev.map((group, i) =>
                i === groupIndex
                    ? { ...group, indicatorIds: [...group.indicatorIds, indicatorId] }
                    : group
            )
        );
    };

    // Handle removing indicator from group
    const handleRemoveIndicatorFromGroup = (groupIndex, indicatorId) => {
        setChartGroups(prev =>
            prev.map((group, i) =>
                i === groupIndex
                    ? { ...group, indicatorIds: group.indicatorIds.filter(id => id !== indicatorId) }
                    : group
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            setError('Grafik başlığı gereklidir.');
            return;
        }

        if (!formData.sectionId) {
            setError('Grafik bölümü seçilmelidir.');
            return;
        }

        if (selectedIndicators.length === 0) {
            setError('En az bir gösterge seçilmelidir.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const chartData = {
                chartName: formData.chartName || formData.title.toLowerCase().replace(/\s+/g, '_'),
                chartType: parseInt(formData.chartType),
                title: formData.title,
                subtitle: formData.subtitle || null,
                description: formData.description || null,
                sectionId: parseInt(formData.sectionId),
                displayOrder: parseInt(formData.displayOrder),
                isActive: formData.isActive,
                showHistoricalData: formData.showHistoricalData,
                historicalDataDisplayType: formData.showHistoricalData ? 
                    parseInt(formData.historicalDataDisplayType) : null,
                showHistoricalInChart: formData.showHistoricalInChart,
                historicalPeriodCount: formData.showHistoricalInChart ? 
                    parseInt(formData.historicalPeriodCount) : null,
                indicators: selectedIndicators.map(ind => ({
                    indicatorId: parseInt(ind.indicatorId),
                    displayOrder: parseInt(ind.displayOrder),
                    color: ind.color,
                    label: ind.label,
                    isVisible: ind.isVisible
                })),
                filters: chartFilters.map(filter => ({
                    filterName: filter.filterName,
                    filterType: parseInt(filter.filterType),
                    filterValue: filter.filterValue,
                    isDefault: filter.isDefault,
                    displayOrder: parseInt(filter.displayOrder),
                    indicatorIds: filter.indicatorIds.map(id => parseInt(id))
                })),
                groups: chartGroups.map(group => ({
                    groupName: group.groupName,
                    description: group.description,
                    displayOrder: parseInt(group.displayOrder),
                    color: group.color,
                    indicatorIds: group.indicatorIds.map(id => parseInt(id))
                }))
            };

            console.log('Sending chart data:', chartData);

            let response;
            if (chart) {
                // Update existing chart
                response = await chartService.updateChart(chart.chartId || chart.id, chartData);
            } else {
                // Create new chart
                response = await chartService.createChart(chartData);
            }

            console.log('Chart operation response:', response);
            onSuccess();
        } catch (err) {
            console.error('Error saving chart:', err);
            setError(err.response?.data?.message || 'Grafik kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container chart-manager-modal ultra-wide" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{chart ? 'Grafik Düzenle' : 'Yeni Grafik Oluştur'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="modal-body">
                    {error && <ErrorMessage message={error} onClose={() => setError('')} />}
                    
                    <form onSubmit={handleSubmit} className="chart-form">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3>Temel Bilgiler</h3>
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label className="form-label required">Grafik Başlığı</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        required
                                        placeholder="Örn: Akademik Personel Dağılımı"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Alt Başlık</label>
                                    <input
                                        type="text"
                                        name="subtitle"
                                        value={formData.subtitle}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="Örn: 2025 Yılı Verileri"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label required">Grafik Türü</label>
                                    <select
                                        name="chartType"
                                        value={formData.chartType}
                                        onChange={handleInputChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value={ChartType.PieChart}>Pasta Grafiği</option>
                                        <option value={ChartType.ColumnChart}>Sütun Grafiği</option>
                                        <option value={ChartType.ComboChart}>Kombine Grafik</option>
                                        <option value={ChartType.DifferenceChart}>Fark Grafiği</option>
                                        <option value={ChartType.Column3D}>3D Sütun Grafiği</option>
                                        <option value={ChartType.Difference3D}>3D Fark Grafiği</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Sıralama</label>
                                    <input
                                        type="number"
                                        name="displayOrder"
                                        value={formData.displayOrder}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group span-2">
                                    <label className="form-label">Açıklama</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="form-textarea"
                                        rows="3"
                                        placeholder="Grafik hakkında açıklama..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Historical Data Settings */}
                        <div className="form-section">
                            <h3>Geçmiş Veri Ayarları</h3>
                            <div className="form-grid">
                                {/* Geçmiş Verileri Göster - Ayrı bölümde */}
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="showHistoricalData"
                                            checked={formData.showHistoricalData}
                                            onChange={handleInputChange}
                                        />
                                        Geçmiş verileri göster (Ayrı bölümde)
                                    </label>
                                </div>

                                {formData.showHistoricalData && (
                                    <div className="form-group">
                                        <label className="form-label">Geçmiş Veri Görünümü</label>
                                        <select
                                            name="historicalDataDisplayType"
                                            value={formData.historicalDataDisplayType || ''}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value="">Seçiniz</option>
                                            <option value={HistoricalDataDisplayType.Table}>Tablo</option>
                                            <option value={HistoricalDataDisplayType.ComboChart}>Kombine Grafik</option>
                                            <option value={HistoricalDataDisplayType.StackedColumn}>Yığılmış Sütun</option>
                                            <option value={HistoricalDataDisplayType.Column3D}>3D Sütun</option>
                                        </select>
                                    </div>
                                )}

                                {/* Geçmiş Verileri Grafik İçinde Göster - Bağımsız */}
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="showHistoricalInChart"
                                            checked={formData.showHistoricalInChart}
                                            onChange={handleInputChange}
                                        />
                                        Geçmiş verileri grafik içinde göster
                                    </label>
                                </div>

                                {formData.showHistoricalInChart && (
                                    <div className="form-group">
                                        <label className="form-label">Gösterilecek Geçmiş Dönem Sayısı</label>
                                        <select
                                            name="historicalPeriodCount"
                                            value={formData.historicalPeriodCount}
                                            onChange={handleInputChange}
                                            className="form-select"
                                        >
                                            <option value={2}>2 Dönem (Geçmiş 1 + Güncel)</option>
                                            <option value={3}>3 Dönem (Geçmiş 2 + Geçmiş 1 + Güncel)</option>
                                            <option value={4}>4 Dönem (Geçmiş 3 + Geçmiş 2 + Geçmiş 1 + Güncel)</option>
                                            <option value={5}>5 Dönem (Geçmiş 4 + Geçmiş 3 + Geçmiş 2 + Geçmiş 1 + Güncel)</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            
                            {formData.showHistoricalInChart && (
                                <div className="historical-info-box">
                                    <div className="info-icon">ℹ️</div>
                                    <div className="info-text">
                                        <strong>Grafik İçi Geçmiş Veri Görünümü:</strong>
                                        <br />
                                        Her gösterge için seçilen dönem sayısı kadar geçmiş veri grafikte gösterilecek.
                                        <br />
                                        Örnek: "Profesör Sayısı" göstergesi için 3 dönem seçilirse:
                                        <br />
                                        <em>• Geçmiş Dönem 2 • Geçmiş Dönem 1 • Güncel Dönem</em>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Indicators Selection */}
                        <div className="form-section">
                            <h3>Göstergeler</h3>
                            
                            {/* Available Indicators */}
                            <div className="indicators-selection">
                                <div className="indicators-header">
                                    <h4>Mevcut Göstergeler</h4>
                                    <div className="indicator-search">
                                        <input
                                            type="text"
                                            value={indicatorSearchTerm}
                                            onChange={(e) => setIndicatorSearchTerm(e.target.value)}
                                            className="form-input"
                                            placeholder="Gösterge ara..."
                                        />
                                    </div>
                                </div>
                                <div className="indicators-grid">
                                    {filteredIndicators.map(indicator => (
                                        <button
                                            key={indicator.id}
                                            type="button"
                                            className={`indicator-item ${
                                                selectedIndicators.find(ind => ind.indicatorId === indicator.id) 
                                                    ? 'selected' : ''
                                            }`}
                                            onClick={() => handleAddIndicator(indicator)}
                                            disabled={selectedIndicators.find(ind => ind.indicatorId === indicator.id)}
                                        >
                                            <div className="indicator-code">{indicator.indicatorCode}</div>
                                            <div className="indicator-name">{indicator.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Indicators */}
                            {selectedIndicators.length > 0 && (
                                <div className="selected-indicators">
                                    <h4>Seçili Göstergeler</h4>
                                    {selectedIndicators.map((indicator) => (
                                        <div key={indicator.indicatorId} className="selected-indicator">
                                            <div className="indicator-controls">
                                                <input
                                                    type="text"
                                                    value={indicator.label}
                                                    onChange={(e) => handleIndicatorChange(indicator.indicatorId, 'label', e.target.value)}
                                                    className="form-input"
                                                    placeholder="Etiket"
                                                />
                                                <input
                                                    type="color"
                                                    value={indicator.color}
                                                    onChange={(e) => handleIndicatorChange(indicator.indicatorId, 'color', e.target.value)}
                                                    className="color-input"
                                                />
                                                <input
                                                    type="number"
                                                    value={indicator.displayOrder}
                                                    onChange={(e) => handleIndicatorChange(indicator.indicatorId, 'displayOrder', parseInt(e.target.value))}
                                                    className="form-input"
                                                    placeholder="Sıra"
                                                    min="1"
                                                />
                                                <label className="checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={indicator.isVisible}
                                                        onChange={(e) => handleIndicatorChange(indicator.indicatorId, 'isVisible', e.target.checked)}
                                                    />
                                                    Görünür
                                                </label>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveIndicator(indicator.indicatorId)}
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="form-section">
                            <div className="section-header-with-button">
                                <h3>Filtreler</h3>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary add-button"
                                    onClick={handleAddFilter}
                                >
                                    <PlusIcon className="w-3 h-3" />
                                    Ekle
                                </button>
                            </div>
                            
                            {chartFilters.map((filter, index) => (
                                <div key={index} className="filter-item">
                                    <div className="filter-controls">
                                        <input
                                            type="text"
                                            value={filter.filterName}
                                            onChange={(e) => handleFilterChange(index, 'filterName', e.target.value)}
                                            className="form-input"
                                            placeholder="Filtre Adı"
                                        />
                                        <select
                                            value={filter.filterType}
                                            onChange={(e) => handleFilterChange(index, 'filterType', parseInt(e.target.value))}
                                            className="form-select"
                                        >
                                            <option value={1}>Bölüm</option>
                                            <option value={2}>Fakülte</option>
                                            <option value={3}>Ünvan</option>
                                            <option value={4}>Cinsiyet</option>
                                            <option value={5}>Özel</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={filter.filterValue}
                                            onChange={(e) => handleFilterChange(index, 'filterValue', e.target.value)}
                                            className="form-input"
                                            placeholder="Filtre Değeri"
                                        />
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={filter.isDefault}
                                                onChange={(e) => handleFilterChange(index, 'isDefault', e.target.checked)}
                                            />
                                            Varsayılan
                                        </label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemoveFilter(index)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Filter Indicators */}
                                    <div className="filter-indicators">
                                        <h5>Filtre Göstergeleri</h5>
                                        <div className="filter-indicator-selection">
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    if (e.target.value && !filter.indicatorIds.includes(parseInt(e.target.value))) {
                                                        handleAddIndicatorToFilter(index, parseInt(e.target.value));
                                                        e.target.value = '';
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="">Gösterge Seçin...</option>
                                                {selectedIndicators
                                                    .filter(ind => !filter.indicatorIds.includes(ind.indicatorId))
                                                    .map(ind => (
                                                        <option key={ind.indicatorId} value={ind.indicatorId}>
                                                            {ind.label}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="selected-filter-indicators">
                                            {filter.indicatorIds.map(indicatorId => {
                                                const indicator = selectedIndicators.find(ind => ind.indicatorId === indicatorId);
                                                return indicator ? (
                                                    <div key={indicatorId} className="mini-indicator-tag">
                                                        <span>{indicator.label}</span>
                                                        <button
                                                            type="button"
                                                            className="remove-indicator-btn"
                                                            onClick={() => handleRemoveIndicatorFromFilter(index, indicatorId)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Groups */}
                        <div className="form-section">
                            <div className="section-header-with-button">
                                <h3>Gruplar</h3>
                                <button
                                    type="button"
                                    className="btn btn-xs btn-primary add-button"
                                    onClick={handleAddGroup}
                                >
                                    <PlusIcon className="w-3 h-3" />
                                    Ekle
                                </button>
                            </div>
                            
                            {chartGroups.map((group, index) => (
                                <div key={index} className="group-item">
                                    <div className="group-controls">
                                        <input
                                            type="text"
                                            value={group.groupName}
                                            onChange={(e) => handleGroupChange(index, 'groupName', e.target.value)}
                                            className="form-input"
                                            placeholder="Grup Adı"
                                        />
                                        <input
                                            type="text"
                                            value={group.description}
                                            onChange={(e) => handleGroupChange(index, 'description', e.target.value)}
                                            className="form-input"
                                            placeholder="Açıklama"
                                        />
                                        <input
                                            type="color"
                                            value={group.color}
                                            onChange={(e) => handleGroupChange(index, 'color', e.target.value)}
                                            className="color-input"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleRemoveGroup(index)}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                    
                                    {/* Group Indicators */}
                                    <div className="group-indicators">
                                        <h5>Grup Göstergeleri</h5>
                                        <div className="group-indicator-selection">
                                            <select
                                                className="form-select"
                                                onChange={(e) => {
                                                    if (e.target.value && !group.indicatorIds.includes(parseInt(e.target.value))) {
                                                        handleAddIndicatorToGroup(index, parseInt(e.target.value));
                                                        e.target.value = '';
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="">Gösterge Seçin...</option>
                                                {selectedIndicators
                                                    .filter(ind => !group.indicatorIds.includes(ind.indicatorId))
                                                    .map(ind => (
                                                        <option key={ind.indicatorId} value={ind.indicatorId}>
                                                            {ind.label}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="selected-group-indicators">
                                            {group.indicatorIds.map(indicatorId => {
                                                const indicator = selectedIndicators.find(ind => ind.indicatorId === indicatorId);
                                                return indicator ? (
                                                    <div key={indicatorId} className="mini-indicator-tag">
                                                        <span>{indicator.label}</span>
                                                        <button
                                                            type="button"
                                                            className="remove-indicator-btn"
                                                            onClick={() => handleRemoveIndicatorFromGroup(index, indicatorId)}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        İptal
                    </button>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner size="sm" /> : (chart ? 'Güncelle' : 'Oluştur')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChartManager;
