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
            console.log('Selected filter for request:', selectedFilter, 'Type:', typeof selectedFilter);

            const response = await chartService.getChartData(
                chartId,
                selectedFilter,
                currentPeriod.year,
                currentPeriod.period,
                true  // Her zaman tarihsel veri dahil et
            );

            console.log('Chart data response:', response.data);
            console.log('Selected filter for request:', selectedFilter);
            console.log('Chart indicators:', chartDetails.indicators?.map(i => ({ id: i.indicatorId, name: i.indicatorName })));
            console.log('Response current data count:', response.data.currentData?.length);
            
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
                },
                title: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.y || context.parsed;
                            const indicatorName = chartData?.indicatorNames?.[context.dataIndex] || context.label;
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

        switch (chart.chartType) {
            case ChartType.PieChart:
                return (
                    <div className="chart-container">
                        <Pie data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.ColumnChart:
                return (
                    <div className="chart-container">
                        <Bar data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.ComboChart:
                return (
                    <div className="chart-container">
                        <Line data={data} options={options} height={300} />
                    </div>
                );
            case ChartType.DataTable:
                return renderDataTable();
            default:
                return (
                    <div className="chart-container">
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
            hasData: historicalData && historicalData.length > 0
        });
        
        if (!historicalData || historicalData.length === 0) return null;

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

        return (
            <div className="historical-data-section">
                <h4>📊 Dönem Verilerinin Karşılaştırması</h4>
                
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
