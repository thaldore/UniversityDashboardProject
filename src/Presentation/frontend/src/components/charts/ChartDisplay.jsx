import React, { useState, useEffect } from 'react';
import chartService from '../../services/api/chartService';
import periodService from '../../services/periodService';
import { ChartType, CHART_COLORS } from '../../services/utils/chartConstants';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

const ChartDisplay = ({ chart }) => {
    const [chartData, setChartData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [chartDetails, setChartDetails] = useState(chart); // Detaylı chart bilgileri
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(null);
    
    const currentPeriod = periodService.getCurrentPeriod();

    useEffect(() => {
        if (chart) {
            loadChartDetails();
        }
    }, [chart]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (chartDetails) {
            loadChartData();
        }
    }, [chartDetails, selectedFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    // Default filtre ayarla
    useEffect(() => {
        if (chartDetails && chartDetails.filters && chartDetails.filters.length > 0 && selectedFilter === null) {
            const defaultFilter = chartDetails.filters.find(filter => filter.isDefault);
            if (defaultFilter) {
                setSelectedFilter(defaultFilter.filterId);
            }
        }
    }, [chartDetails, selectedFilter]);

    const loadChartDetails = async () => {
        try {
            const chartId = chart.chartId || chart.id;
            if (!chartId) {
                throw new Error('Chart ID not found');
            }

            console.log('Loading chart details for chartId:', chartId);
            const response = await chartService.getChartById(chartId);
            console.log('Chart details response:', response.data);
            setChartDetails(response.data);
        } catch (err) {
            console.error('Error loading chart details:', err);
            setChartDetails(chart); // Fallback to basic chart info
        }
    };

    const loadChartData = async () => {
        try {
            setLoading(true);
            setError('');

            const chartId = chartDetails.chartId || chartDetails.id;
            if (!chartId) {
                throw new Error('Chart ID not found');
            }

            console.log('Loading chart data for chartId:', chartId);
            console.log('Chart showHistoricalData:', chartDetails.showHistoricalData);
            console.log('Chart showHistoricalInChart:', chartDetails.showHistoricalInChart);
            console.log('Selected filter for request:', selectedFilter, 'Type:', typeof selectedFilter);

            const response = await chartService.getChartData(
                chartId,
                selectedFilter,
                currentPeriod.year,
                currentPeriod.period,
                true  // Her zaman tarihsel veri dahil et
            );

            console.log('Chart data response FULL:', response.data);
            console.log('Current data:', response.data.currentData);
            console.log('Historical data from response:', response.data.historicalData);
            console.log('Chart indicators:', chartDetails.indicators?.map(i => ({ id: i.indicatorId, name: i.indicatorName })));
            
            setChartData(response.data);
            
            // Always set historical data if it exists in response, regardless of chart.showHistoricalData setting
            if (response.data.historicalData && response.data.historicalData.length > 0) {
                console.log('Setting historical data:', response.data.historicalData);
                setHistoricalData(response.data.historicalData);
            } else {
                console.log('No historical data in response:', {
                    showHistoricalData: chartDetails.showHistoricalData,
                    hasHistoricalDataInResponse: !!response.data.historicalData,
                    historicalDataLength: response.data.historicalData?.length || 0
                });
                setHistoricalData(null);
            }

        } catch (err) {
            console.error('Error loading chart data:', err);
            setError('Grafik verileri yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const formatChartData = (data) => {
        if (!data || !data.currentData || data.currentData.length === 0) {
            return null;
        }

        // Eğer gruplar varsa, grup bazında veri düzenle
        if (chartDetails.groups && chartDetails.groups.length > 0) {
            return formatGroupedChartData(data);
        }

        // Check if chart should show historical data in the same chart
        if (chartDetails.showHistoricalInChart && historicalData && historicalData.length > 0) {
            console.log('HISTORICAL CHART MODE - historicalData:', historicalData);
            console.log('HISTORICAL CHART MODE - currentData:', data.currentData);
            return formatHistoricalChartData({
                currentData: data.currentData,
                historicalData: historicalData
            });
        }

        // Backend'den gelen veri zaten filtrelenmiş durumda, ek filtreleme yapmıyoruz
        const labels = data.currentData.map(item => item.label);
        const values = data.currentData.map(item => item.value);
        const backgroundColors = data.currentData.map(item => item.color || CHART_COLORS[data.currentData.indexOf(item) % CHART_COLORS.length]);
        const borderColors = backgroundColors.map(color => color);

        console.log('Chart data formatted:', { labels, values, filterId: selectedFilter });

        return {
            labels,
            datasets: [{
                label: data.chartTitle || chartDetails.title,
                data: values,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                tension: 0.1
            }]
        };
    };

    const formatHistoricalChartData = (data) => {
        console.log('formatHistoricalChartData called with:', {
            currentData: data.currentData,
            historicalData: data.historicalData,
            showHistoricalInChart: chartDetails.showHistoricalInChart
        });

        // Create labels for periods (X-axis: Geçmiş Dönem 2, Geçmiş Dönem 1, Güncel Dönem)
        const periodLabels = [];
        
        // Add historical periods in reverse order (oldest first)
        if (data.historicalData && data.historicalData.length > 0) {
            // Sort by period in descending order, then reverse to get oldest first
            const sortedHistorical = [...data.historicalData].sort((a, b) => (b.period || 0) - (a.period || 0));
            sortedHistorical.forEach(period => {
                periodLabels.push(period.periodLabel || `Geçmiş ${period.period || 'Dönem'}`);
            });
        }
        
        // Add current period
        periodLabels.push('Güncel Dönem');

        console.log('Period labels (X-axis):', periodLabels);

        // Extract indicators from current data
        const indicators = [];
        if (data.currentData && data.currentData.length > 0) {
            data.currentData.forEach(item => {
                indicators.push({
                    label: item.label,
                    color: CHART_COLORS[indicators.length % CHART_COLORS.length]
                });
            });
        }

        console.log('Indicators found:', indicators);

        // Create datasets for each indicator (not periods)
        const datasets = indicators.map((indicator) => {
            const indicatorData = [];
            
            // Collect data for this indicator across all periods
            if (data.historicalData && data.historicalData.length > 0) {
                const sortedHistorical = [...data.historicalData].sort((a, b) => (b.period || 0) - (a.period || 0));
                sortedHistorical.forEach(period => {
                    console.log(`Searching in ${period.periodLabel} for indicator:`, indicator.label);
                    console.log(`Available data in this period:`, period.data);
                    const item = period.data.find(d => d.label === indicator.label);
                    if (!item) {
                        // Try to find by partial match (remove period suffix)
                        const baseLabel = indicator.label.replace(/\s*-\s*Güncel Dönem\s*$/, '').trim();
                        const alternativeItem = period.data.find(d => 
                            d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim() === baseLabel
                        );
                        console.log(`Base label search: "${baseLabel}" -> found:`, alternativeItem);
                        indicatorData.push(alternativeItem ? alternativeItem.value : 0);
                    } else {
                        indicatorData.push(item.value);
                    }
                    console.log(`Historical period ${period.periodLabel}: ${indicator.label} = ${item ? item.value : 0}`);
                });
            }
            
            // Add current period data
            const currentItem = data.currentData.find(d => d.label === indicator.label);
            indicatorData.push(currentItem ? currentItem.value : 0);
            console.log(`Current period: ${indicator.label} = ${currentItem ? currentItem.value : 0}`);

            console.log(`Dataset for ${indicator.label}:`, indicatorData);

            return {
                label: indicator.label, // Use indicator name as legend
                data: indicatorData,
                backgroundColor: indicator.color,
                borderColor: indicator.color,
                borderWidth: 1,
                tension: 0.1
            };
        });

        const result = {
            labels: periodLabels,
            datasets: datasets
        };

        console.log('Historical chart data formatted FINAL:', result);

        return result;
    };

    const formatGroupedChartData = (data) => {
        const datasets = [];
        
        chartDetails.groups.forEach(group => {
            // Her grup için ayrı dataset oluştur
            const groupData = [];
            const groupLabels = [];
            
            group.indicators.forEach(indicator => {
                const dataItem = data.currentData.find(item => 
                    item.additionalData?.IndicatorId === indicator.indicatorId
                );
                
                if (dataItem) {
                    groupData.push(dataItem.value);
                    groupLabels.push(dataItem.label);
                }
            });

            if (groupData.length > 0) {
                datasets.push({
                    label: group.groupName,
                    data: groupData,
                    backgroundColor: group.color,
                    borderColor: group.color,
                    borderWidth: 1,
                    tension: 0.1
                });
            }
        });

        // Tüm group'ların label'larını birleştir
        const allLabels = [];
        chartDetails.groups.forEach(group => {
            group.indicators.forEach(indicator => {
                const dataItem = data.currentData.find(item => 
                    item.additionalData?.IndicatorId === indicator.indicatorId
                );
                if (dataItem && !allLabels.includes(dataItem.label)) {
                    allLabels.push(dataItem.label);
                }
            });
        });

        return {
            labels: allLabels,
            datasets
        };
    };

    const getChartOptions = () => {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    display: true,
                    // Show legend when there are multiple datasets (historical data)
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y || context.parsed;
                            const datasetLabel = context.dataset.label || '';
                            const indicatorName = chartData?.indicatorNames?.[context.dataIndex] || context.label;
                            
                            // If historical data is shown in chart, include period info
                            if (chartDetails.showHistoricalInChart && datasetLabel) {
                                return `${datasetLabel} - ${indicatorName}: ${value}`;
                            }
                            
                            return `${indicatorName}: ${value}`;
                        }
                    }
                }
            }
        };

        // Chart type specific options
        switch (chart.chartType) {
            case ChartType.PieChart:
                return {
                    ...baseOptions,
                    plugins: {
                        ...baseOptions.plugins,
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const value = context.parsed;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    const indicatorName = chartData?.indicatorNames?.[context.dataIndex] || context.label;
                                    return `${indicatorName}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                };
            case ChartType.ColumnChart:
                return {
                    ...baseOptions,
                    scales: {
                        y: {
                            beginAtZero: true,
                        }
                    }
                };
            default:
                return baseOptions;
        }
    };

    const renderChart = () => {
        if (!chartData) return null;

        const data = formatChartData(chartData);
        if (!data) {
            return (
                <div className="chart-empty">
                    <p>Seçilen filtre için veri bulunamadı.</p>
                </div>
            );
        }

        const options = getChartOptions();

        // Add note if historical data is shown in chart - REMOVED
        const historicalNote = null;

        switch (chart.chartType) {
            case ChartType.PieChart:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Pie data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.ColumnChart:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Bar data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.ComboChart:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Line data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.DataTable:
                return renderDataTable();
            default:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Bar data={data} options={options} height={300} />
                    </div>
                );
        }
    };

    const renderDataTable = () => {
        if (!chartData || !chartData.values) return null;

        return (
            <div className="chart-data-table">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Gösterge</th>
                            <th>Değer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.labels.map((label, index) => (
                            <tr key={index}>
                                <td>{chartData.indicatorNames?.[index] || label}</td>
                                <td>{chartData.values[index]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderHistoricalChart = () => {
        if (!historicalData || historicalData.length === 0) return null;

        // Güncel veri ile geçmiş verileri birleştir
        const allPeriodsData = [];
        
        // Önce güncel veriyi ekle
        if (chartData && chartData.currentData) {
            allPeriodsData.push({
                periodLabel: "Güncel Veri",
                data: chartData.currentData
            });
        }
        
        // Sonra geçmiş verileri ekle
        allPeriodsData.push(...historicalData);

        // Prepare data for historical chart
        const labels = allPeriodsData.map(period => period.periodLabel);
        const datasets = [];

        // Get all unique indicators
        const indicators = allPeriodsData[0]?.data || [];

        indicators.forEach((indicator, index) => {
            const data = allPeriodsData.map(period => 
                period.data?.find(item => item.label === indicator.label)?.value || 0
            );

            datasets.push({
                label: indicator.label,
                data: data,
                backgroundColor: indicator.color || CHART_COLORS[index % CHART_COLORS.length],
                borderColor: indicator.color || CHART_COLORS[index % CHART_COLORS.length],
                borderWidth: 2,
                tension: 0.1
            });
        });

        const historicalChartData = {
            labels,
            datasets
        };

        const historicalOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Geçmiş Dönem Trend Analizi'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        return (
            <div style={{ height: '300px', marginBottom: '1rem' }}>
                <Line data={historicalChartData} options={historicalOptions} />
            </div>
        );
    };

    const renderHistoricalData = () => {
        console.log('renderHistoricalData called:', {
            historicalData,
            hasData: historicalData && historicalData.length > 0,
            showHistoricalInChart: chartDetails.showHistoricalInChart,
            showHistoricalData: chartDetails.showHistoricalData
        });
        
        if (!historicalData || historicalData.length === 0) return null;

        // Show historical data table regardless of showHistoricalInChart setting
        // If showHistoricalInChart is true, data is also in chart, but table provides additional detail

        // Güncel veri ile geçmiş verileri birleştir
        const allPeriodsData = [];
        
        // Önce güncel veriyi ekle (backend'den zaten filtrelenmiş)
        if (chartData && chartData.currentData) {
            allPeriodsData.push({
                periodLabel: "Güncel Veri",
                data: chartData.currentData,
                isCurrent: true
            });
        }
        
        // Sonra geçmiş verileri ekle (backend'den filtrelenmiş)
        historicalData.forEach(period => {
            allPeriodsData.push({
                ...period,
                isCurrent: false
            });
        });

        const tableTitle = chartDetails.showHistoricalInChart 
            ? "📊 Dönem Verilerinin Detay Tablosu"
            : "📊 Dönem Verilerinin Karşılaştırması";

        return (
            <div className="historical-data-section">
                <h4>{tableTitle}</h4>
                
                {/* Chart 2 için özel: her zaman tablo görünümü kullan */}
                {(chartDetails.chartId === 2 || chartDetails.historicalDataDisplayType === 1 || !chartDetails.historicalDataDisplayType) ? ( // Table or default or Chart 2
                    <div className="historical-table">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Dönem</th>
                                    {allPeriodsData[0]?.data?.map((item, index) => (
                                        <th key={index}>{item.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allPeriodsData.map((period, index) => (
                                    <tr key={index} className={period.isCurrent ? 'current-data-row' : ''}>
                                        <td className={`period-label ${period.isCurrent ? 'current-period' : ''}`}>
                                            {period.periodLabel}
                                        </td>
                                        {period.data?.map((item, valueIndex) => (
                                            <td key={valueIndex} className="data-value">
                                                {item.value}
                                                {item.percentage && (
                                                    <span className="percentage">({item.percentage.toFixed(2)}%)</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="historical-chart">
                        {renderHistoricalChart()}
                    </div>
                )}
            </div>
        );
    };

    const renderFilters = () => {
        const hasFilters = chartDetails.filters && chartDetails.filters.length > 0;
        const hasGroups = chartDetails.groups && chartDetails.groups.length > 0;

        console.log('renderFilters - chartDetails:', {
            hasFilters,
            hasGroups,
            filters: chartDetails.filters,
            groups: chartDetails.groups,
            selectedFilter
        });

        if (!hasFilters && !hasGroups) return null;

        return (
            <div className="chart-filters">
                <div className="filter-controls">
                    {hasFilters && (
                        <>
                            <label>Filtre:</label>
                            <select
                                value={selectedFilter || ''}
                                onChange={(e) => setSelectedFilter(e.target.value || null)}
                                className="form-select"
                            >
                                <option value="">Tümü</option>
                                {chartDetails.filters.map(filter => (
                                    <option key={filter.filterId} value={filter.filterId}>
                                        {filter.filterName}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {hasGroups && (
                        <>
                            <label style={{ marginLeft: hasFilters ? '1rem' : '0' }}>Gruplandırma:</label>
                            <div className="group-info">
                                <span className="group-count">
                                    {chartDetails.groups.length} grup mevcut
                                </span>
                                <div className="group-details">
                                    {chartDetails.groups.map(group => (
                                        <div key={group.groupId} className="group-item">
                                            <span 
                                                className="group-indicator"
                                                style={{ backgroundColor: group.color }}
                                            ></span>
                                            <span className="group-name">{group.groupName}</span>
                                            <span className="group-description">({group.description})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="chart-loading">
                <div className="loading-spinner"></div>
                <p>Grafik yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chart-error">
                <p>{error}</p>
                <button 
                    className="btn btn-sm btn-primary"
                    onClick={loadChartData}
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="chart-display">
            {chartDetails.description && (
                <p className="chart-description">{chartDetails.description}</p>
            )}
            
            {renderFilters()}
            
            <div className="chart-content">
                {renderChart()}
            </div>

            {renderHistoricalData()}
        </div>
    );
};

export default ChartDisplay;
