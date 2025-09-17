import React, { useState, useEffect } from 'react';
import chartService from '../../services/api/chartService';
import periodService from '../../services/periodService';
import { ChartType, CHART_COLORS } from '../../services/utils/chartConstants';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Chart3D from './Chart3D';
import ChartDifference3D from './ChartDifference3D';

// Custom plugin: Per-category dynamic bar compaction for NameGroup charts
// Amaç: Her kategori (X ekseni label) için NULL olan sütun slotlarını yok sayıp
// kalan barları kategori genişliği içinde yeniden dağıtarak Column3D benzeri
// boşluksuz görüntü sağlamak.
const DynamicCategoryCompactionPlugin = {
    id: 'dynamicCategoryCompaction',
    beforeDatasetsDraw(chart) {
        const pluginOpts = chart.options?.plugins?.dynamicCategoryCompaction;
        if (!pluginOpts || !pluginOpts.enabled) return;
        const xScale = chart.scales?.x;
        if (!xScale) return;
        const metas = chart.getSortedVisibleDatasetMetas();
        if (!metas.length) return;
        const tickCount = xScale.ticks.length;
        if (!tickCount) return;

        // Kategori genişliği hesaplama: ardışık iki tick farkı; son çare ortalama genişlik
        let fullCategoryWidth;
        if (tickCount > 1) {
            const first = xScale.getPixelForTick(0);
            const second = xScale.getPixelForTick(1);
            fullCategoryWidth = Math.abs(second - first);
        } else {
            fullCategoryWidth = xScale.width / tickCount;
        }

        const categoryPaddingRatio = pluginOpts.categoryPaddingRatio ?? 0.12;
        const innerGapRatio = pluginOpts.innerGapRatio ?? 0.1;
        const baseCategoryPct = pluginOpts.baseCategoryPercentage ?? 0.9;

        // Non-null counts (önceden sağlanmışsa kullan)
        let nonNullCounts = pluginOpts.nonNullDatasetCounts;
        if (!nonNullCounts) {
            nonNullCounts = new Array(tickCount).fill(0);
            for (let i = 0; i < tickCount; i++) {
                metas.forEach(meta => {
                    const ds = meta._dataset || meta.dataset || {};
                    const val = ds.data?.[i];
                    if (val !== null && val !== undefined && val !== 0) {
                        nonNullCounts[i]++;
                    }
                });
            }
        }

        for (let ti = 0; ti < tickCount; ti++) {
            const active = [];
            metas.forEach(meta => {
                const elem = meta.data[ti];
                if (!elem) return;
                const v = meta._dataset?.data?.[ti];
                if (v !== null && v !== undefined && v !== 0) {
                    active.push(elem);
                } else {
                    // Görünmez yap
                    elem.width = 0;
                }
            });
            const c = active.length;
            if (!c) continue;
            const centerX = xScale.getPixelForTick(ti);
            const outerWidth = fullCategoryWidth * baseCategoryPct;
            const effectiveWidth = outerWidth * (1 - categoryPaddingRatio);
            const totalGap = c > 1 ? effectiveWidth * innerGapRatio : 0;
            const gapEach = c > 1 ? totalGap / (c - 1) : 0;
            const barTotal = effectiveWidth - totalGap;
            let barWidth = barTotal / c;
            // Minimum / maksimum sınırlar + tek bar özel genişliği
            barWidth = Math.max(pluginOpts.minBarWidth ?? 6, barWidth);
            barWidth = Math.min(pluginOpts.maxBarWidth ?? 70, barWidth);
            if (c === 1 && pluginOpts.maxSingleBarWidth) {
                // Tek bar varsa biraz daha büyüt ama üst sınırı aşmadan
                const expanded = barWidth * (pluginOpts.singleBarScale ?? 1.4);
                barWidth = Math.min(expanded, pluginOpts.maxSingleBarWidth);
            }
            // Kümeyi (yalnızca aktif barları) gerçek toplam genişliği ile tam merkeze hizala
            const clusterWidth = (c * barWidth) + (c > 1 ? (c - 1) * gapEach : 0);
            const clusterStart = centerX - (clusterWidth / 2);
            active.forEach((barEl, idx) => {
                const barLeft = clusterStart + idx * (barWidth + gapEach);
                barEl.width = barWidth;
                barEl.x = barLeft + barWidth / 2;
            });
        }
    }
};

// Register Chart.js components & custom plugin
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
    DynamicCategoryCompactionPlugin
);

const ChartDisplay = ({ chart }) => {
    const [chartData, setChartData] = useState(null);
    const [historicalData, setHistoricalData] = useState(null);
    const [chartDetails, setChartDetails] = useState(chart); // Detaylı chart bilgileri
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [hiddenGroups, setHiddenGroups] = useState([]); // gizlenen gruplar (groupId listesi)
    
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
            // Sort by period in ascending order (oldest first: Geçmiş Dönem 2, Geçmiş Dönem 1)
            const sortedHistorical = [...data.historicalData].sort((a, b) => (a.period || 0) - (b.period || 0));
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
                // Clean the label - remove period suffix for legend
                const cleanLabel = item.label.replace(/\s*-\s*Güncel Dönem\s*$/, '').trim();
                const indicatorId = item.additionalData?.IndicatorId;
                indicators.push({
                    label: cleanLabel, // Use clean label for legend
                    originalLabel: item.label, // Keep original for data matching
                    color: CHART_COLORS[indicators.length % CHART_COLORS.length],
                    indicatorId
                });
            });
        }

        console.log('Indicators found:', indicators);

        // Create datasets for each indicator (not periods)
        const datasets = indicators.map((indicator) => {
            const indicatorData = [];
            
            // Collect data for this indicator across all periods
            if (data.historicalData && data.historicalData.length > 0) {
                const sortedHistorical = [...data.historicalData].sort((a, b) => (a.period || 0) - (b.period || 0));
                sortedHistorical.forEach(period => {
                    console.log(`Searching in ${period.periodLabel} for indicator:`, indicator.originalLabel);
                    console.log(`Available data in this period:`, period.data);
                    let item = period.data.find(d => d.label === indicator.originalLabel);
                    if (!item) {
                        // Try to find by partial match (remove period suffix)
                        const baseLabel = indicator.originalLabel.replace(/\s*-\s*Güncel Dönem\s*$/, '').trim();
                        item = period.data.find(d => 
                            d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim() === baseLabel
                        );
                        console.log(`Base label search: "${baseLabel}" -> found:`, item);
                    }
                    const value = item ? item.value : 0;
                    indicatorData.push(value);
                    console.log(`Historical period ${period.periodLabel}: ${indicator.originalLabel} = ${value}`);
                });
            }
            
            // Add current period data
            const currentItem = data.currentData.find(d => d.label === indicator.originalLabel);
            indicatorData.push(currentItem ? currentItem.value : 0);
            console.log(`Current period: ${indicator.originalLabel} = ${currentItem ? currentItem.value : 0}`);

            console.log(`Dataset for ${indicator.label}:`, indicatorData);

            return {
                label: indicator.label, // Use clean label for legend
                data: indicatorData,
                backgroundColor: indicator.color,
                borderColor: indicator.color,
                borderWidth: 1,
                tension: 0.1,
                indicatorId: indicator.indicatorId
            };
        });

        const result = {
            labels: periodLabels,
            datasets: datasets
        };

        console.log('Historical chart data formatted FINAL:', result);

        return result;
    };

    // Difference3D için: yalnızca güncel dönemli format
    const formatDifference3DCurrentOnly = (data) => {
        if (!data || !data.currentData || data.currentData.length === 0) return null;
        // Periyotlar: sadece Güncel Dönem
        const periodLabels = ['Güncel Dönem'];
        // Göstergeleri chartDetails.indicators sırası ile al
        const order = (chartDetails.indicators || []).map(ind => ({ id: ind.indicatorId, name: ind.label || ind.indicatorName || ind.indicatorCode }));
        // Dataset: her gösterge = 1 değerlik liste
        const datasets = order.map((o, idx) => {
            const item = data.currentData.find(d => d.additionalData?.IndicatorId === o.id);
            const value = item?.value ?? 0;
            const baseColor = item?.color || CHART_COLORS[idx % CHART_COLORS.length];
            return {
                label: o.name,
                data: [value],
                backgroundColor: baseColor,
                borderColor: baseColor,
                borderWidth: 1,
                indicatorId: o.id
            };
        });
        return { labels: periodLabels, datasets };
    };

    const formatGroupedChartData = (data) => {
        console.log('formatGroupedChartData - received data:', data.currentData);
        
        // Veriyi hem isim hem renk gruplarına göre analiz et
        const nameGroups = new Map(); // isim grubu -> göstergeler
        const colorGroups = new Map(); // renk grubu -> göstergeler  
        const ungroupedIndicators = [];
        
        // Tüm göstergeleri gruplarına ayır
        data.currentData.forEach(item => {
            const hasNameGroup = item.additionalData?.HasNameGroup;
            const nameGroupName = item.additionalData?.NameGroupName;
            const hasColorGroup = item.additionalData?.HasColorGroup;
            const colorGroupName = item.additionalData?.ColorGroupName;
            
            // İsim grup kontrol
            if (hasNameGroup && nameGroupName) {
                if (!nameGroups.has(nameGroupName)) {
                    nameGroups.set(nameGroupName, []);
                }
                nameGroups.get(nameGroupName).push(item);
            } else {
                // İsim grubunda olmayan göstergeler
                ungroupedIndicators.push(item);
            }
            
            // Renk grup kontrol (isim grubundan bağımsız)
            if (hasColorGroup && colorGroupName) {
                if (!colorGroups.has(colorGroupName)) {
                    colorGroups.set(colorGroupName, []);
                }
                colorGroups.get(colorGroupName).push(item);
            }
        });
        
        console.log('Name groups:', nameGroups);
        console.log('Color groups:', colorGroups);
        console.log('Ungrouped indicators:', ungroupedIndicators);
        
        // X ekseni label'larını oluştur (proportional kategoriler için)
        const categories = [];
        
        // Eğer isim grupları varsa, isim gruplarını kullan
        if (nameGroups.size > 0) {
            // İsim grup isimlerini ekle - sadece valid data olan grupları
            nameGroups.forEach((indicators, groupName) => {
                // Bu grupta en az bir valid değer var mı kontrol et
                const hasValidData = indicators.some(indicator => 
                    indicator.value !== null && indicator.value !== undefined && indicator.value !== 0
                );
                
                if (hasValidData) {
                    categories.push({
                        type: 'nameGroup',
                        label: groupName,
                        indicators: indicators,
                        indicatorCount: indicators.length
                    });
                } else {
                    console.log(`Skipping empty name group: ${groupName}`);
                }
            });
            
            // Gruplanmamış gösterge isimlerini ekle - sadece valid data olanları
            ungroupedIndicators.forEach(item => {
                if (item.value !== null && item.value !== undefined && item.value !== 0) {
                    categories.push({
                        type: 'individual',
                        label: item.label,
                        indicators: [item],
                        indicatorCount: 1
                    });
                } else {
                    console.log(`Skipping empty ungrouped indicator: ${item.label}`);
                }
            });
        } else {
            // İsim grubu yoksa, tüm göstergeleri tek tek ekle (sadece renk grupları durumu) - sadece valid olanları
            data.currentData.forEach(item => {
                if (item.value !== null && item.value !== undefined && item.value !== 0) {
                    categories.push({
                        type: 'individual',
                        label: item.label,
                        indicators: [item],
                        indicatorCount: 1
                    });
                } else {
                    console.log(`Skipping empty indicator: ${item.label}`);
                }
            });
        }
        
        console.log('Categories for proportional sizing:', categories);
        
        // Toplam gösterge sayısını hesapla (proportional sizing için)
        const totalIndicatorCount = categories.reduce((sum, cat) => sum + cat.indicatorCount, 0);
        
        // X ekseni labels (chart.js için sadece string array)
        const labels = categories.map(cat => cat.label);
        
        // Dataset'leri oluştur - her gösterge ayrı dataset olacak
        const datasets = [];
        const processedIndicators = new Set();
        
        // Tüm göstergeleri işle
        data.currentData.forEach(item => {
            if (!processedIndicators.has(item.additionalData?.IndicatorId)) {
                processedIndicators.add(item.additionalData?.IndicatorId);
                
                // Bu gösterge için tüm kategorideki değerleri oluştur
                const dataValues = categories.map(category => {
                    // Ana grup gizli mi kontrol et  
                    const colorGroupId = item.additionalData?.ColorGroupId;
                    if (colorGroupId && hiddenGroups.includes(colorGroupId)) {
                        return null; // Renk grubu gizli ise null döndür
                    }
                    
                    // Bu kategoride bu gösterge var mı kontrol et
                    const isInThisCategory = category.indicators.some(catItem => 
                        catItem.additionalData?.IndicatorId === item.additionalData?.IndicatorId
                    );
                    
                    if (isInThisCategory) {
                        const matchingItem = category.indicators.find(catItem => 
                            catItem.additionalData?.IndicatorId === item.additionalData?.IndicatorId
                        );
                        return matchingItem ? matchingItem.value : null;
                    }
                    
                    return null; // Bu kategoride bu gösterge yok
                });
                
                // Tamamen null olan dataset'leri filtrele
                const hasAnyData = dataValues.some(value => value !== null && value !== undefined && value !== 0);
                if (!hasAnyData) {
                    console.log(`Skipping indicator ${item.label} - no valid data`);
                    return; // Bu göstergeyi atla
                }
                
                // Renk grubuna göre renk belirle
                const colorGroupId = item.additionalData?.ColorGroupId;
                let itemColor = item.color; // Varsayılan renk
                
                console.log(`Indicator: ${item.label}, ColorGroupId: ${colorGroupId}, HasColorGroup: ${item.additionalData?.HasColorGroup}, ColorGroupColor: ${item.additionalData?.ColorGroupColor}, HasData: ${hasAnyData}`);
                
                // Eğer color group varsa, color group'un rengini kullan  
                if (colorGroupId && colorGroupId > 0) {
                    itemColor = item.additionalData?.ColorGroupColor || item.color;
                    console.log(`Using color group color: ${itemColor} for indicator: ${item.label}`);
                } else {
                    console.log(`Using default color: ${itemColor} for indicator: ${item.label}`);
                }
                
                datasets.push({
                    label: item.additionalData?.IndicatorName || item.label,
                    data: dataValues,
                    backgroundColor: itemColor,
                    borderColor: itemColor,
                    borderWidth: 1,
                    // Gösterge metadata'sı
                    _indicatorId: item.additionalData?.IndicatorId,
                    _colorGroupId: colorGroupId
                });
            }
        });
        
        // Null olmayan dataset sayılarını hesapla (proportional sizing için)
        const nonNullDatasetCounts = labels.map((_, labelIndex) => {
            return datasets.filter(dataset => {
                const value = dataset.data[labelIndex];
                return value !== null && value !== undefined && value !== 0;
            }).length;
        });
        const maxNonNullDatasets = Math.max(...nonNullDatasetCounts);
        const avgNonNullDatasets = nonNullDatasetCounts.reduce((a, b) => a + b, 0) / nonNullDatasetCounts.length;
        
        console.log('formatGroupedChartData - result:', { labels, datasets, categories });
        console.log('Non-null dataset counts per label:', nonNullDatasetCounts);
        console.log('Max non-null datasets:', maxNonNullDatasets, 'Average:', avgNonNullDatasets);

        return {
            labels,
            datasets,
            _chartMetadata: {
                categories,
                totalIndicatorCount,
                proportionalSizing: true,
                nonNullDatasetCounts,
                maxNonNullDatasets,
                avgNonNullDatasets
            }
        };
    };

    const getChartOptions = (chartData) => {
        // Grup analizi
        const hasColorGroups = chartDetails.groups && chartDetails.groups.some(g => g.groupType === 1); // ColorGroup
        const hasNameGroups = chartDetails.groups && chartDetails.groups.some(g => g.groupType === 2); // NameGroup  
        const isGroupedChart = chartDetails.groups && chartDetails.groups.length > 0;
        
        // Default değerler (gruplandırılmamış grafikler için)
        let categoryPercentage = 0.8;
        let barPercentage = 0.9;
        let barThickness = null; // Auto sizing
        
        console.log('Group analysis:', { hasColorGroups, hasNameGroups, isGroupedChart });
        
        // Proportional sizing şartları:
        // 1. Sadece NameGroup varsa -> agresif proportional sizing
        // 2. Sadece ColorGroup varsa -> normal spacing (her gösterge ayrı sütun)  
        // 3. Both varsa -> agresif proportional sizing (NameGroup mantığı)
        // 1. Sadece NameGroup varsa -> agresif proportional sizing
        // 2. Sadece ColorGroup varsa -> normal spacing (her gösterge ayrı sütun)  
        // 3. Both varsa -> agresif proportional sizing (NameGroup mantığı)
        if (hasNameGroups) {
            // NameGroup var (tek başına veya ColorGroup ile birlikte) - agresif proportional sizing
            const chartMetadata = chartData?._chartMetadata;
            
            if (chartMetadata && chartMetadata.proportionalSizing) {
                const maxDatasets = chartMetadata.maxNonNullDatasets || 1;
                const avgDatasets = chartMetadata.avgNonNullDatasets || 1;
                
                // Agresif proportional sizing - Column3D benzeri
                categoryPercentage = Math.min(0.98, Math.max(0.3, 0.2 + (maxDatasets * 0.15)));
                barPercentage = Math.min(0.95, Math.max(0.4, 0.3 + (avgDatasets * 0.2)));
                
                if (avgDatasets < 2) {
                    categoryPercentage = Math.min(0.95, categoryPercentage + 0.2);
                    barPercentage = Math.min(0.9, barPercentage + 0.15);
                }
                
                barThickness = Math.max(15, Math.min(50, 80 / maxDatasets));
                
                console.log('NameGroup chart - Aggressive sizing:', { maxDatasets, avgDatasets, categoryPercentage, barPercentage, barThickness });
            }
        } else if (hasColorGroups) {
            // Sadece ColorGroup var - normal spacing (her gösterge ayrı sütun)
            categoryPercentage = 0.8;
            barPercentage = 0.9; 
            barThickness = null; // Auto sizing
            
            console.log('ColorGroup only - Normal spacing');
        } else {
            console.log('No groups - Default spacing');
        }
        
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            // Dataset-specific sizing
            datasets: {
                bar: {
                    // Manuel bar thickness sadece gruplandırılmış grafiklerde
                    ...(barThickness ? { barThickness: barThickness } : {}),
                    categoryPercentage: categoryPercentage,
                    barPercentage: barPercentage
                }
            },
            // Proportional column sizing için ayarlar
            scales: {
                x: {
                    type: 'category',
                    // Dinamik proportional sizing
                    categoryPercentage: categoryPercentage,
                    barPercentage: barPercentage,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 0
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    display: true,
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
                            const categoryLabel = context.label || '';
                            
                            // Gruplandırılmış grafiklerde tooltip formatı
                            if (isGroupedChart) {
                                // Gösterge adı (dataset label) ve değer
                                return `${datasetLabel}: ${value}`;
                            }
                            
                            // Normal grafik durumu
                            const indicatorName = chartData?.indicatorNames?.[context.dataIndex] || categoryLabel;
                            
                            // If historical data is shown in chart, include period info
                            if (chartDetails.showHistoricalInChart && datasetLabel) {
                                return `${datasetLabel} - ${indicatorName}: ${value}`;
                            }
                            
                            return `${indicatorName}: ${value}`;
                        },
                        title: (context) => {
                            // Gruplandırılmış grafiklerde kategori adını title olarak göster
                            if (isGroupedChart) {
                                return context[0]?.label || '';
                            }
                            
                            // Normal grafik durumu - varsayılan title
                            return context[0]?.label || '';
                        }
                    }
                }
            }
        };

        // ColorGroup legend sistemi - sadece renk grupları varsa göster
        if (hasColorGroups) {
            baseOptions.plugins.legend = {
                display: true,
                onClick: (e, legendItem) => {
                    const groupId = legendItem?.__groupId;
                    if (!groupId) return;
                    setHiddenGroups(prev => 
                        prev.includes(groupId) 
                            ? prev.filter(id => id !== groupId) 
                            : [...prev, groupId]
                    );
                },
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle', 
                    color: '#555',
                    generateLabels: () => {
                        const legendItems = [];
                        
                        // Renk gruplarını legend'da göster
                        const colorGroups = (chartDetails.groups || []).filter(group => group.groupType === 1); // ColorGroup
                        
                        colorGroups.forEach(group => {
                            const hidden = hiddenGroups.includes(group.groupId);
                            legendItems.push({
                                text: group.groupName,
                                fillStyle: group.color,
                                strokeStyle: group.color,
                                hidden,
                                lineWidth: 1,
                                pointStyle: 'circle',
                                __groupId: group.groupId
                            });
                        });
                        
                        return legendItems;
                    }
                }
            };
        }

        // Dinamik kompaksiyon plugin konfigürasyonu (yalnızca NameGroup içeren durumlar için)
        if (!baseOptions.plugins) baseOptions.plugins = {};
        baseOptions.plugins.dynamicCategoryCompaction = hasNameGroups ? {
            enabled: true,
            nonNullDatasetCounts: chartData?._chartMetadata?.nonNullDatasetCounts,
            baseCategoryPercentage: categoryPercentage,
            categoryPaddingRatio: 0.12,
            innerGapRatio: 0.10,
            minBarWidth: 8,
            maxBarWidth: 110,          // önceki 80 yerine artırıldı
            maxSingleBarWidth: 160,     // tek bar durumunda izin verilen üst genişlik
            singleBarScale: 1.5         // tek barı ekstra büyütme çarpanı
        } : { enabled: false };

        return baseOptions;
    };

    const renderChart = () => {
        if (!chartData) return null;

        // For Difference3D, prefer historical formatted data if available
        const isDifference3D = chart.chartType === ChartType.Difference3D;
        let data;
        if (isDifference3D) {
            if (chartDetails.showHistoricalInChart && historicalData && historicalData.length > 0) {
                data = formatHistoricalChartData({ currentData: chartData.currentData, historicalData });
            } else {
                data = formatDifference3DCurrentOnly({ currentData: chartData.currentData });
            }
        } else {
            data = formatChartData(chartData);
        }
        if (!data) {
            return (
                <div className="chart-empty">
                    <p>Seçilen filtre için veri bulunamadı.</p>
                </div>
            );
        }

        const options = getChartOptions(data);

        // Add note if historical data is shown in chart - REMOVED
        const historicalNote = null;

        switch (chart.chartType) {
            case ChartType.PieChart: {
                // Pie chart için özel grup handling
                let pieData = data;
                if (chartDetails.groups && chartDetails.groups.length > 0) {
                    // Gruplandırılmış pie chart - tek pie, renkleri grup renklerine göre
                    pieData = {
                        labels: data.labels,
                        datasets: [{
                            label: chartDetails.title,
                            data: data.datasets.map(dataset => 
                                dataset.data.find(value => value !== null && value !== undefined) || 0
                            ),
                            backgroundColor: data.datasets.map(dataset => dataset.backgroundColor),
                            borderColor: data.datasets.map(dataset => dataset.borderColor),
                            borderWidth: 1
                        }]
                    };
                }
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Pie data={pieData} options={options} height={300} />
                    </div>
                );
            }
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
            case ChartType.Column3D: {
                // Legend items'ı dataset'lerden oluştur
                const legendItems = data.datasets?.map(dataset => ({
                    label: dataset.label,
                    color: dataset.backgroundColor
                })) || [];
                
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Chart3D 
                            data={data} 
                            options={options} 
                            legendItems={legendItems}
                        />
                    </div>
                );
            }
            case ChartType.Difference3D:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <ChartDifference3D chart={chartDetails} chartData={chartData} formattedData={data} />
                    </div>
                );
            // case ChartType.DataTable: // Deprecated
            //     return renderDataTable();
            default:
                return (
                    <div className="chart-container">
                        {historicalNote}
                        <Bar data={data} options={options} height={300} />
                    </div>
                );
        }
    };

    // Data table renderer removed (DataTable chart type deprecated)

    const renderHistoricalChart = () => {
        if (!historicalData || historicalData.length === 0) return null;

    // Eğer HistoricalDataDisplayType.StackedColumn seçiliyse yüzde bazlı yığılmış sütunlar çiz
    const useStacked100 = chartDetails.historicalDataDisplayType === 3; // StackedColumn

        // Güncel + geçmiş dönemleri sırala (en eski -> güncel)
        const periodsSorted = [...historicalData]
            .sort((a, b) => (a.period || 0) - (b.period || 0));

        // En sona güncel dönemi ekle
        if (chartData && chartData.currentData) {
            periodsSorted.push({ periodLabel: 'Güncel Dönem', data: chartData.currentData });
        }

        const labels = periodsSorted.map(p => p.periodLabel);

        // Eğer HistoricalDataDisplayType.Column3D ise: her dönem için TÜM göstergeleri ardışık olarak 3D sütunda göster
        if (chartDetails.historicalDataDisplayType === 4) {
            // Baz alınacak gösterge listesi ve renkleri (güncel veriden)
            const baseIndicators = (chartData?.currentData || []).map((i, idx) => ({
                key: i.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim(),
                label: i.label,
                color: i.color || CHART_COLORS[idx % CHART_COLORS.length]
            }));

            // Etiketler: her dönem + her gösterge (örn: "2023 - Gösterge 1")
            const flatLabels = [];
            const flatValues = [];
            const flatColors = [];

            periodsSorted.forEach((period) => {
                baseIndicators.forEach((ind) => {
                    const item = (period.data || []).find(d => {
                        const key = d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim();
                        return key === ind.key;
                    });
                    flatLabels.push(`${period.periodLabel} - ${ind.key}`);
                    flatValues.push(item?.value || 0);
                    flatColors.push(ind.color);
                });
            });

            const data3D = {
                labels: flatLabels,
                datasets: [{
                    label: 'Dönem × Gösterge',
                    data: flatValues,
                    backgroundColor: flatColors
                }]
            };
            const options3D = { plugins: { title: { display: true, text: 'Geçmiş Dönem - Gösterge Dağılımı (3D)' } } };

            // Grup bilgisi: her dönem için kaç gösterge (groupSize)
            const groupSize = baseIndicators.length;
            const periodOnlyLabels = labels; // Grup başlıkları olarak sadece dönem adları
            const legendItems = baseIndicators.map(b => ({ label: b.key, color: b.color }));
            return (
                <div style={{ height: '360px', marginBottom: '1rem' }}>
                    <Chart3D 
                        data={data3D} 
                        options={options3D}
                        groupLabels={periodOnlyLabels}
                        groupSize={groupSize}
                        legendItems={legendItems}
                    />
                </div>
            );
        }

        // Baz alınacak gösterge listesi (renk ve sıralama için)
        const baseIndicators = (chartData?.currentData || []).map((i, idx) => ({
            key: i.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim(),
            label: i.label,
            color: i.color || CHART_COLORS[idx % CHART_COLORS.length]
        }));

        if (!useStacked100) {
            // Eski line grafik (trend) davranışı
            const datasets = baseIndicators.map((ind) => {
                const data = periodsSorted.map(period => {
                    const item = (period.data || []).find(d => {
                        const key = d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim();
                        return key === ind.key;
                    });
                    return item?.value || 0;
                });
                return {
                    label: ind.key,
                    data,
                    backgroundColor: ind.color,
                    borderColor: ind.color,
                    borderWidth: 2,
                    tension: 0.1
                };
            });
            const historicalChartData = { labels, datasets };
            const historicalOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: 'Geçmiş Dönem Trend Analizi' } },
                scales: { y: { beginAtZero: true } }
            };
            return (
                <div style={{ height: '300px', marginBottom: '1rem' }}>
                    <Line data={historicalChartData} options={historicalOptions} />
                </div>
            );
        }

        // 100% stacked bar hesaplama
    const datasets = baseIndicators.map((ind) => {
            const data = periodsSorted.map(period => {
                const items = period.data || [];
                const total = items.reduce((sum, it) => sum + (it.value || 0), 0) || 1;
                const item = items.find(d => {
                    const key = d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim();
                    return key === ind.key;
                });
                const value = item?.value || 0;
                const percent = (value / total) * 100;
                return Number(percent.toFixed(2));
            });
            return {
                label: ind.key,
                data,
                backgroundColor: ind.color,
                borderColor: ind.color,
                borderWidth: 1,
                stack: 'percentage'
            };
        });

        const stackedData = { labels, datasets };
        const stackedOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' },
                title: { display: true, text: 'Geçmiş Dönem Yüzdelik Dağılımı' },
                tooltip: {
                    callbacks: {
                        label: (ctx) => {
                            const periodIndex = ctx.dataIndex;
                            const period = periodsSorted[periodIndex];
                            const items = period?.data || [];
                            const match = items.find(d => d.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim() === ctx.dataset.label);
                            const raw = match?.value ?? 0;
                            const pct = typeof ctx.raw === 'number' ? ctx.raw.toFixed(2) : ctx.raw;
                            return `${ctx.dataset.label}: ${pct}% (${raw})`;
                        }
                    }
                }
            },
            scales: {
                x: { stacked: true },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: (val) => `${val}%`
                    }
                }
            }
        };
        return (
            <div style={{ height: '300px', marginBottom: '1rem' }}>
                <Bar data={stackedData} options={stackedOptions} />
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
                                    {allPeriodsData[0]?.data?.map((item, index) => {
                                        // Clean the label - remove period suffix for table header
                                        const cleanLabel = item.label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim();
                                        return <th key={index}>{cleanLabel}</th>;
                                    })}
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
