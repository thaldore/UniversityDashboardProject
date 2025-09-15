import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

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
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={onHover}
        onPointerOut={onLeave}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={isHovered ? new THREE.Color(color).multiplyScalar(1.2) : color} />
      </mesh>
      {/* top edge */}
      <mesh scale={[scale[0] * 1.02, 0.05, scale[2] * 1.02]} position={[0, scale[1] / 2 + 0.025, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={new THREE.Color(color).multiplyScalar(1.4)} />
      </mesh>
      {/* value label */}
      <Text
        position={[0, scale[1] / 2 + 0.28, 0]}
        fontSize={0.24}
        color="#000"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#ffffff"
        billboard
      >
        {value}
      </Text>
    </group>
  );
}

function Grid({ metrics }) {
  const { chartWidth, chartHeight, chartDepth, gridXCount, gridZCount } = metrics;
  return (
    <group>
      {/* bottom */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[chartWidth, chartDepth]} />
        <meshLambertMaterial color="#f8f9fa" transparent opacity={0.85} />
      </mesh>
      {/* back */}
      <mesh position={[0, chartHeight / 2, -chartDepth / 2]} receiveShadow>
        <planeGeometry args={[chartWidth, chartHeight]} />
        <meshLambertMaterial color="#f0f0f0" transparent opacity={0.6} />
      </mesh>
      {/* left */}
      <mesh position={[-chartWidth / 2, chartHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[chartDepth, chartHeight]} />
        <meshLambertMaterial color="#f0f0f0" transparent opacity={0.6} />
      </mesh>
      {/* grid on bottom X (periods) */}
      {Array.from({ length: gridXCount + 1 }, (_, i) => (
        <line key={`gx-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2 + (i * (chartWidth / gridXCount)), 0.01, -chartDepth / 2,
                -chartWidth / 2 + (i * (chartWidth / gridXCount)), 0.01, chartDepth / 2,
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
      {/* grid on bottom Z (indicators) */}
      {Array.from({ length: gridZCount + 1 }, (_, i) => (
        <line key={`gz-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2, 0.01, -chartDepth / 2 + (i * (chartDepth / gridZCount)),
                chartWidth / 2, 0.01, -chartDepth / 2 + (i * (chartDepth / gridZCount)),
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
      {/* back wall verticals */}
      {Array.from({ length: gridXCount + 1 }, (_, i) => (
        <line key={`gbv-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2 + (i * (chartWidth / gridXCount)), 0, -chartDepth / 2,
                -chartWidth / 2 + (i * (chartWidth / gridXCount)), chartHeight, -chartDepth / 2,
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
      {/* back wall horizontals */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`gbh-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2, (i * chartHeight) / 5, -chartDepth / 2,
                chartWidth / 2, (i * chartHeight) / 5, -chartDepth / 2,
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
      {/* left wall verticals (along Z) */}
      {Array.from({ length: gridZCount + 1 }, (_, i) => (
        <line key={`glv-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2, 0, -chartDepth / 2 + (i * (chartDepth / gridZCount)),
                -chartWidth / 2, chartHeight, -chartDepth / 2 + (i * (chartDepth / gridZCount)),
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
      {/* left wall horizontals */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`glh-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -chartWidth / 2, (i * chartHeight) / 5, -chartDepth / 2,
                -chartWidth / 2, (i * chartHeight) / 5, chartDepth / 2,
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ddd" />
        </line>
      ))}
    </group>
  );
}

function XAxisLabels({ labels, metrics }) {
  const { chartWidth, chartDepth } = metrics;
  const spacing = chartWidth / (labels.length + 1);
  return (
    <group>
      {labels.map((label, i) => (
        <Text
          key={i}
          position={[-chartWidth / 2 + spacing * (i + 1), 0.02, chartDepth / 2 + 0.7]}
          fontSize={Math.max(0.18, Math.min(0.26, 2.2 / Math.max(4, labels.length)))}
          color="#000"
          anchorX="center"
          anchorY="middle"
          rotation={[-Math.PI / 22, 0, 0]}
          maxWidth={1.6}
          lineHeight={1.05}
          billboard
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function ZAxisLabels({ labels, metrics }) {
  const { chartWidth, chartDepth } = metrics;
  const spacing = chartDepth / (labels.length + 1);
  return (
    <group>
      {labels.map((label, i) => (
        <Text
          key={i}
          position={[-chartWidth / 2 - 0.6, 0.1, -chartDepth / 2 + spacing * (i + 1)]}
          fontSize={Math.max(0.18, Math.min(0.26, 2.2 / Math.max(4, labels.length)))}
          color="#000"
          anchorX="right"
          anchorY="middle"
          rotation={[0, 0, 0]}
          maxWidth={2.0}
          lineHeight={1.05}
          billboard
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function YAxisScale({ maxValue, steps = 6, metrics }) {
  const { chartHeight, chartWidth, chartDepth } = metrics;
  const labels = [];
  for (let i = 0; i <= steps; i++) {
    const value = Math.round((maxValue / steps) * i);
    labels.push(
      <Text
        key={i}
        position={[-chartWidth / 2 - 0.5, (i / steps) * chartHeight, chartDepth / 2 + 0.5]}
        fontSize={0.26}
        color="#000"
        anchorX="center"
        anchorY="middle"
        billboard
      >
        {value}
      </Text>
    );
  }
  return <group>{labels}</group>;
}

function Tooltip({ visible, position, content }) {
  if (!visible || !content) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x + 15,
        top: position.y - 15,
        background: 'rgba(255,255,255,0.95)',
        color: '#333',
        padding: '10px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        pointerEvents: 'none',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{content.indicator}</div>
      <div style={{ color: '#555' }}>{content.period}: <strong>{content.value}</strong></div>
    </div>
  );
}

export default function ChartDifference3D({ formattedData }) {
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, position: { x: 0, y: 0 }, content: null });
  const canvasRef = useRef();

  const prepared = useMemo(() => {
    if (!formattedData || !formattedData.labels || !formattedData.datasets) {
      return { bars: [], colors: [], maxValue: 0, metrics: { chartWidth: 10, chartHeight: 4, chartDepth: 6, gridXCount: 6, gridZCount: 6 } };
    }
    const periods = formattedData.labels; // X-axis
    const indicators = formattedData.datasets.map(d => d.label); // Z-axis

    // Build color map per indicator
    const colors = formattedData.datasets.map((d, i) => {
      const c = Array.isArray(d.backgroundColor) ? d.backgroundColor[0] : d.backgroundColor;
      return c || ['#5470C6', '#FF6B6B', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'][i % 6];
    });

    // Compute max value over all (for scale)
    const maxValue = Math.max(
      1,
      ...formattedData.datasets.flatMap(d => d.data).map(v => (typeof v === 'number' ? v : 0))
    );

    // Dynamic sizing
    const xCount = Math.max(1, periods.length);
    const zCount = Math.max(1, indicators.length);
    const chartWidth = Math.min(30, Math.max(8, xCount * 1.1 + 1));
    const chartDepth = Math.min(16, Math.max(4, zCount * 1.1 + 1));
    const chartHeight = 4;
    const gridXCount = Math.min(10, Math.max(6, xCount));
    const gridZCount = Math.min(10, Math.max(6, zCount));

    const bars = [];
    const xSpacing = chartWidth / (xCount + 1);
    const zSpacing = chartDepth / (zCount + 1);
    const xzScale = Math.max(0.4, Math.min(0.9, 10 / Math.max(chartWidth, chartDepth)));

    indicators.forEach((ind, zi) => {
      const dataset = formattedData.datasets[zi];
      periods.forEach((period, xi) => {
        const value = dataset.data[xi] ?? 0;
        const h = (value / maxValue) * chartHeight;
        bars.push({
          id: `${zi}-${xi}`,
          position: [
            -chartWidth / 2 + xSpacing * (xi + 1),
            h / 2,
            -chartDepth / 2 + zSpacing * (zi + 1)
          ],
          scale: [xzScale, h, xzScale],
          color: colors[zi],
          value,
          indicator: ind,
          period
        });
      });
    });

    return {
      bars,
      colors,
      maxValue,
      metrics: { chartWidth, chartHeight, chartDepth, gridXCount, gridZCount },
      xLabels: periods,
      zLabels: indicators
    };
  }, [formattedData]);

  const onHover = (bar, event) => {
    setHovered(bar.id);
    const rect = canvasRef.current.getBoundingClientRect();
    setTooltip({
      visible: true,
      position: { x: event.clientX - rect.left, y: event.clientY - rect.top },
      content: { indicator: bar.indicator, period: bar.period, value: bar.value }
    });
  };
  const onLeave = () => {
    setHovered(null);
    setTooltip({ visible: false, position: { x: 0, y: 0 }, content: null });
  };

  return (
    <div style={{ display: 'flex', gap: 24, width: '100%', minHeight: 500 }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          ref={canvasRef}
          style={{ width: '100%', height: 450, position: 'relative', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          <Canvas
            camera={{ position: [0, 3.2, Math.max(12, (prepared.metrics?.chartWidth || 8) * 1.6)], fov: 30, near: 0.1, far: 1000 }}
            shadows
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
            <directionalLight position={[-5, 8, -5]} intensity={0.3} color="#ffffff" />
            <Grid metrics={prepared.metrics} />
            <XAxisLabels labels={prepared.xLabels || []} metrics={prepared.metrics} />
            <ZAxisLabels labels={prepared.zLabels || []} metrics={prepared.metrics} />
            <YAxisScale maxValue={prepared.maxValue} metrics={prepared.metrics} />
            {prepared.bars.map((b) => (
              <Bar3D
                key={b.id}
                position={b.position}
                scale={b.scale}
                color={b.color}
                value={b.value}
                label={b.indicator}
                period={b.period}
                onHover={(e) => onHover(b, e)}
                onLeave={onLeave}
                isHovered={hovered === b.id}
              />
            ))}
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={false}
              minDistance={Math.max(8, (prepared.metrics?.chartWidth || 8) * 1.0)}
              maxDistance={Math.min(60, (prepared.metrics?.chartWidth || 8) * 2.4)}
              autoRotate={false}
              target={[0, 1.6, 0]}
            />
          </Canvas>
          <Tooltip visible={tooltip.visible} position={tooltip.position} content={tooltip.content} />
        </div>
      </div>
      <div style={{ width: 250, flexShrink: 0 }}>
        {(prepared.zLabels || []).map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 16, height: 16, backgroundColor: prepared.colors[i], borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
            <span style={{ fontSize: 11, color: '#495057', fontWeight: 500, lineHeight: 1.2, wordBreak: 'break-word' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
