import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// 3D Bar component with enhanced styling
function Bar3D({ position, scale, color, value, onHover, onLeave, isHovered }) {
    const meshRef = useRef();
    
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.scale.y = THREE.MathUtils.lerp(
                meshRef.current.scale.y,
                isHovered ? scale[1] * 1.05 : scale[1],
                0.1
            );
        }
    });

    return (
        <group position={position}>
            {/* Main Bar with bright colors */}
            <mesh
                ref={meshRef}
                scale={scale}
                onPointerOver={onHover}
                onPointerOut={onLeave}
                castShadow
                receiveShadow
                position={[0, 0, 0]}
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial 
                    color={isHovered ? new THREE.Color(color).multiplyScalar(1.2) : color}
                    transparent={false}
                />
            </mesh>
            
            {/* Top edge highlight */}
            <mesh
                scale={[scale[0] * 1.02, 0.05, scale[2] * 1.02]}
                position={[0, scale[1] / 2 + 0.025, 0]}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[1, 1, 1]} />
                <meshLambertMaterial 
                    color={new THREE.Color(color).multiplyScalar(1.4)}
                />
            </mesh>
            
            {/* Value label on top */}
            <Text
                position={[0, scale[1] / 2 + 0.3, 0]}
                fontSize={0.25}
                color="#333"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {value}
            </Text>
        </group>
    );
}

// Enhanced Grid component with coordinate system box matching the reference image
function Grid() {
    const chartWidth = 8;
    const chartHeight = 4;
    const chartDepth = 6;
    
    return (
        <group>
            {/* Bottom face with grid lines */}
            <mesh 
                position={[0, 0, 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[chartWidth, chartDepth]} />
                <meshLambertMaterial color="#f8f9fa" transparent opacity={0.8} />
            </mesh>
            
            {/* Back wall */}
            <mesh
                position={[0, chartHeight/2, -chartDepth/2]}
                rotation={[0, 0, 0]}
                receiveShadow
            >
                <planeGeometry args={[chartWidth, chartHeight]} />
                <meshLambertMaterial color="#f0f0f0" transparent opacity={0.6} />
            </mesh>
            
            {/* Left wall */}
            <mesh
                position={[-chartWidth/2, chartHeight/2, 0]}
                rotation={[0, Math.PI / 2, 0]}
                receiveShadow
            >
                <planeGeometry args={[chartDepth, chartHeight]} />
                <meshLambertMaterial color="#f0f0f0" transparent opacity={0.6} />
            </mesh>
            
            {/* Internal grid lines on bottom */}
            {Array.from({ length: 9 }, (_, i) => (
                <line key={`grid-x-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2 + (i * chartWidth/8), 0.01, -chartDepth/2,
                                -chartWidth/2 + (i * chartWidth/8), 0.01, chartDepth/2
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {Array.from({ length: 7 }, (_, i) => (
                <line key={`grid-z-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2, 0.01, -chartDepth/2 + (i * chartDepth/6),
                                chartWidth/2, 0.01, -chartDepth/2 + (i * chartDepth/6)
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {/* Vertical grid lines on back wall */}
            {Array.from({ length: 9 }, (_, i) => (
                <line key={`grid-back-v-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2 + (i * chartWidth/8), 0, -chartDepth/2,
                                -chartWidth/2 + (i * chartWidth/8), chartHeight, -chartDepth/2
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {/* Horizontal grid lines on back wall */}
            {Array.from({ length: 6 }, (_, i) => (
                <line key={`grid-back-h-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2, i * chartHeight/5, -chartDepth/2,
                                chartWidth/2, i * chartHeight/5, -chartDepth/2
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {/* Vertical grid lines on left wall */}
            {Array.from({ length: 7 }, (_, i) => (
                <line key={`grid-left-v-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2, 0, -chartDepth/2 + (i * chartDepth/6),
                                -chartWidth/2, chartHeight, -chartDepth/2 + (i * chartDepth/6)
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {/* Horizontal grid lines on left wall */}
            {Array.from({ length: 6 }, (_, i) => (
                <line key={`grid-left-h-${i}`}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            array={new Float32Array([
                                -chartWidth/2, i * chartHeight/5, -chartDepth/2,
                                -chartWidth/2, i * chartHeight/5, chartDepth/2
                            ])}
                            count={2}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ddd" />
                </line>
            ))}
            
            {/* Chart area outline edges */}
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(chartWidth, chartHeight, chartDepth)]} />
                <lineBasicMaterial color="#999" />
            </lineSegments>
        </group>
    );
}

// X-axis labels component
function XAxisLabels({ labels }) {
    const chartWidth = 8;
    const barSpacing = chartWidth / (labels.length + 1);
    
    return (
        <group>
            {labels.map((label, index) => (
                <Text
                    key={index}
                    position={[-chartWidth/2 + barSpacing * (index + 1), -0.8, 3.5]}
                    fontSize={0.3}
                    color="#333"
                    anchorX="center"
                    anchorY="middle"
                    rotation={[0, 0, 0]}
                >
                    {label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim()}
                </Text>
            ))}
        </group>
    );
}

// Y-axis scale
function YAxisScale({ maxValue, steps = 6 }) {
    const chartHeight = 4;
    const chartWidth = 8;
    const chartDepth = 6;
    
    const scaleLabels = [];
    for (let i = 0; i <= steps; i++) {
        const value = Math.round((maxValue / steps) * i);
        scaleLabels.push(
            <Text
                key={i}
                position={[-chartWidth/2 - 0.8, (i / steps) * chartHeight, chartDepth/2 + 0.5]}
                fontSize={0.3}
                color="#666"
                anchorX="center"
                anchorY="middle"
                rotation={[0, Math.PI / 4, 0]}
            >
                {value}
            </Text>
        );
    }
    return <group>{scaleLabels}</group>;
}

// Enhanced Tooltip component
function Tooltip({ visible, position, content }) {
    if (!visible || !content) return null;
    
    return (
        <div 
            className="chart-3d-tooltip"
            style={{
                position: 'absolute',
                left: position.x + 15,
                top: position.y - 15,
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#333',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                pointerEvents: 'none',
                zIndex: 1000,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.1)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
        >
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {content.label}
            </div>
            <div style={{ color: '#666' }}>
                Değer: <span style={{ fontWeight: '600', color: '#333' }}>{content.value}</span>
            </div>
        </div>
    );
}

// Enhanced Legend component
function Legend({ datasets, colors }) {
    return (
        <div className="chart-3d-legend" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '12px', 
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
        }}>
            <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: '#495057',
                marginBottom: '8px'
            }}>
                Göstergeler
            </div>
            {datasets.map((dataset, index) => (
                <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px'
                }}>
                    <div 
                        style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: colors[index],
                            borderRadius: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    />
                    <span style={{ 
                        fontSize: '13px', 
                        color: '#495057',
                        fontWeight: '500'
                    }}>
                        {dataset.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

// Main Chart3D component with image-matching design
export default function Chart3D({ data, options = {} }) {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [tooltip, setTooltip] = useState({ visible: false, position: { x: 0, y: 0 }, content: null });
    const canvasRef = useRef();
    
    // Prepare data for 3D visualization
    const preparedData = React.useMemo(() => {
        console.log('Chart3D received data:', data);
        
        if (!data || !data.labels || !data.datasets) {
            console.log('Chart3D: Invalid data structure');
            return { bars: [], colors: [], maxValue: 0 };
        }
        
        // Color palette matching the reference image
        const defaultColors = [
            '#5470C6',  // Blue (Profesör Sayısı)
            '#FF6B6B',  // Red/Pink (Doçent Sayısı) 
            '#91CC75',  // Green (Dr. Öğretim Üyesi Sayısı)
            '#FAC858',  // Yellow/Orange (Öğretim Görevlisi Sayısı)
            '#EE6666',  // Light Red (Araştırma Görevlisi Sayısı)
            '#73C0DE',  // Light Blue
            '#3BA272',  // Dark Green
            '#FC8452'   // Orange
        ];
        
        const bars = [];
        const colors = [];
        const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
        
        console.log('Chart3D maxValue:', maxValue);
        console.log('Chart3D datasets:', data.datasets);
        console.log('Chart3D labels:', data.labels);
        
        data.datasets.forEach((dataset, datasetIndex) => {
            dataset.data.forEach((value, labelIndex) => {
                // Her indicator için farklı renk
                const color = defaultColors[labelIndex % defaultColors.length];
                colors.push(color);
                
                const normalizedHeight = (value / maxValue) * 4; // Scale to max height of 4 units
                const chartWidth = 8;
                const barSpacing = chartWidth / (data.labels.length + 1);
                
                bars.push({
                    position: [
                        -chartWidth/2 + barSpacing * (labelIndex + 1), 
                        normalizedHeight / 2, 
                        0
                    ],
                    scale: [0.6, normalizedHeight, 0.6],
                    color: color,
                    value: value,
                    label: data.labels[labelIndex],
                    datasetLabel: dataset.label,
                    id: `${datasetIndex}-${labelIndex}`
                });
            });
        });
        
        console.log('Chart3D prepared bars:', bars);
        
        return { bars, colors, maxValue };
    }, [data]);
    
    const handleBarHover = (bar, event) => {
        setHoveredBar(bar.id);
        
        const rect = canvasRef.current.getBoundingClientRect();
        setTooltip({
            visible: true,
            position: {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            },
            content: {
                label: bar.label,
                value: bar.value
            }
        });
    };
    
    const handleBarLeave = () => {
        setHoveredBar(null);
        setTooltip({ visible: false, position: { x: 0, y: 0 }, content: null });
    };
    
    return (
        <div className="chart-3d-container" style={{ 
            display: 'flex',
            gap: '24px',
            width: '100%', 
            minHeight: '500px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Debug Info */}
            {import.meta.env.DEV && (
                <div style={{ 
                    position: 'absolute', 
                    top: '10px', 
                    left: '10px', 
                    background: 'rgba(0,0,0,0.7)', 
                    color: 'white', 
                    padding: '8px', 
                    fontSize: '12px',
                    zIndex: 1000
                }}>
                    Bars: {preparedData.bars.length} | Max: {preparedData.maxValue}
                </div>
            )}
            
            {/* Chart Area */}
            <div style={{ flex: '1', position: 'relative' }}>
                {/* Chart Title */}
                {options.plugins?.title?.display && (
                    <div style={{ 
                        textAlign: 'center', 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        marginBottom: '20px',
                        color: '#2d3748',
                        padding: '12px',
                        backgroundColor: '#f7fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {options.plugins.title.text}
                    </div>
                )}
                
                {/* 3D Canvas */}
                <div 
                    ref={canvasRef} 
                    style={{ 
                        width: '100%', 
                        height: '450px', 
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Canvas
                        camera={{ 
                            position: [8, 4, 8], 
                            fov: 50,
                            near: 0.1,
                            far: 1000
                        }}
                        shadows
                        style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                    >
                        {/* Enhanced Lighting */}
                        <ambientLight intensity={0.4} />
                        <directionalLight 
                            position={[10, 10, 5]} 
                            intensity={0.8} 
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                            shadow-camera-far={50}
                            shadow-camera-left={-10}
                            shadow-camera-right={10}
                            shadow-camera-top={10}
                            shadow-camera-bottom={-10}
                        />
                        <directionalLight 
                            position={[-5, 8, -5]} 
                            intensity={0.3} 
                            color="#ffffff"
                        />
                        
                        {/* Grid and Base */}
                        <Grid />
                        
                        {/* Remove test cube */}
                        
                        {/* Axis Labels */}
                        <XAxisLabels labels={data?.labels || []} />
                        <YAxisScale maxValue={preparedData.maxValue} />
                        
                        {/* 3D Bars */}
                        {preparedData.bars.map((bar) => (
                            <Bar3D
                                key={bar.id}
                                position={bar.position}
                                scale={bar.scale}
                                color={bar.color}
                                value={bar.value}
                                onHover={(e) => handleBarHover(bar, e)}
                                onLeave={handleBarLeave}
                                isHovered={hoveredBar === bar.id}
                            />
                        ))}
                        
                        {/* Camera Controls - Front view */}
                        <OrbitControls 
                            enablePan={false}
                            enableZoom={true}
                            enableRotate={true}
                            maxPolarAngle={Math.PI / 2.5}
                            minPolarAngle={Math.PI / 4}
                            minDistance={5}
                            maxDistance={15}
                            autoRotate={false}
                            target={[0, 0, 0]}
                        />
                    </Canvas>
                    
                    {/* Tooltip */}
                    <Tooltip 
                        visible={tooltip.visible}
                        position={tooltip.position}
                        content={tooltip.content}
                    />
                </div>
            </div>
            
            {/* Legend Panel */}
            <div style={{ width: '250px', flexShrink: 0 }}>
                {data?.labels && (
                    <div className="chart-3d-legend" style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '12px', 
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{ 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#495057',
                            marginBottom: '8px'
                        }}>
                            Göstergeler
                        </div>
                        {data.labels.map((label, index) => (
                            <div key={index} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px'
                            }}>
                                <div 
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: preparedData.colors[index],
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <span style={{ 
                                    fontSize: '13px', 
                                    color: '#495057',
                                    fontWeight: '500'
                                }}>
                                    {label.replace(/\s*-\s*(Güncel|Geçmiş)\s*Dönem.*$/, '').trim()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
