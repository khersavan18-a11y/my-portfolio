// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo, Suspense, Component } from "react";

/* ============================================
   CUSTOM SVG ICONS (no lucide dependency)
   ============================================ */
const Icons = {
  zap: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  flask: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2v6L3 20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2L15 8V2"/><path d="M8 2h8"/><path d="M7 16h10"/></svg>),
  dumbbell: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>),
  code: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>),
  globe: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  plus: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>),
  trash: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>),
  x: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>),
  github: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>),
  linkedin: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>),
  mail: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>),
  phone: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  arrowUp: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>),
  external: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>),
  calendar: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>),
  briefcase: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>),
  graduation: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>),
  fire: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>),
  menu: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>),
  download: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>),
  edit: (p) => (<svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
};

/* ============================================
   ERROR BOUNDARY
   ============================================ */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (<div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>3D animation unavailable. Site still works perfectly!</div>);
    }
    return this.props.children;
  }
}



/* ============================================================
   ☀️ REALISTIC SUN with Atmospheric Scattering
   ============================================================ */
function RealisticSun({ theme }) {
  const coreRef = useRef();
  const haze1Ref = useRef();
  const haze2Ref = useRef();
  const haze3Ref = useRef();
  const flareRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      const breathe = 1 + Math.sin(t * 0.8) * 0.02;
      coreRef.current.scale.set(breathe, breathe, breathe);
    }
    if (haze1Ref.current) {
      const pulse1 = 1 + Math.sin(t * 0.6) * 0.05;
      haze1Ref.current.scale.set(pulse1, pulse1, pulse1);
    }
    if (haze2Ref.current) {
      const pulse2 = 1 + Math.sin(t * 0.4 + 1) * 0.07;
      haze2Ref.current.scale.set(pulse2, pulse2, pulse2);
    }
    if (haze3Ref.current) {
      const pulse3 = 1 + Math.sin(t * 0.3 + 2) * 0.1;
      haze3Ref.current.scale.set(pulse3, pulse3, pulse3);
    }
    if (flareRef.current) {
      flareRef.current.rotation.z = t * 0.05;
    }
  });

  // Position sun in upper-right area
  return (
    <group position={[3.8, 2.2, -2]}>
      {/* Outermost atmospheric haze */}
      <mesh ref={haze3Ref}>
        <sphereGeometry args={[theme.sunSize * 4.5, 32, 32]} />
        <meshBasicMaterial color={theme.sunHaze} transparent opacity={0.04} />
      </mesh>
      {/* Outer haze */}
      <mesh ref={haze2Ref}>
        <sphereGeometry args={[theme.sunSize * 3, 32, 32]} />
        <meshBasicMaterial color={theme.sunHaze} transparent opacity={0.08} />
      </mesh>
      {/* Inner glow */}
      <mesh ref={haze1Ref}>
        <sphereGeometry args={[theme.sunSize * 1.8, 32, 32]} />
        <meshBasicMaterial color={theme.sunGlow} transparent opacity={0.18} />
      </mesh>
      {/* Sun core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[theme.sunSize, 64, 64]} />
        <meshBasicMaterial color={theme.sunColor} />
      </mesh>
      {/* Bright center hotspot */}
      <mesh>
        <sphereGeometry args={[theme.sunSize * 0.55, 32, 32]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.55} />
      </mesh>
      {/* Lens flare cross (subtle) */}
      <mesh ref={flareRef}>
        <ringGeometry args={[theme.sunSize * 1.3, theme.sunSize * 1.4, 4]} />
        <meshBasicMaterial color={theme.sunGlow} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ============================================================
   🌫️ VOLUMETRIC GOD-RAYS (Light Beams from Sun)
   ============================================================ */
function GodRays({ theme }) {
  const groupRef = useRef();
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.02;
    }
  });

  // Generate 8 light rays from sun position
  const rays = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      arr.push({ angle, length: 8 + Math.random() * 4, width: 0.3 + Math.random() * 0.4 });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef} position={[3.8, 2.2, -3]}>
      {rays.map((ray, i) => (
        <mesh key={i} rotation={[0, 0, ray.angle]} position={[Math.cos(ray.angle) * 2, Math.sin(ray.angle) * 2, 0]}>
          <planeGeometry args={[ray.length, ray.width]} />
          <meshBasicMaterial color={theme.rayColor} transparent opacity={theme.raysOpacity * 0.15} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   ✨ CINEMATIC DUST PARTICLES (in sunbeam light)
   ============================================================ */
function DustParticles({ theme }) {
  const ref = useRef();
  const count = theme.isNight ? 350 : 150;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return arr;
  }, [count]);

  const velocities = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.001;
      arr[i * 3 + 1] = Math.random() * 0.0008 + 0.0002;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];
        // Reset particles that drift too far
        if (pos[i * 3 + 1] > 6) pos[i * 3 + 1] = -6;
        if (pos[i * 3] > 9) pos[i * 3] = -9;
        if (pos[i * 3] < -9) pos[i * 3] = 9;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={theme.isNight ? 0.05 : 0.04} color={theme.dustColor} transparent opacity={theme.isNight ? 0.85 : 0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ============================================================
   🔬 LAB EQUIPMENT SILHOUETTES (Wireframe outlines)
   ============================================================ */

// Erlenmeyer Flask outline
function ErlenmeyerFlask({ position, scale = 1, theme }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });
  // Build flask shape with 2 cylinders + cone-like body
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Neck */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 16, 1, true]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Body (cone shape) */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.7, 0.9, 16, 1, true]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Lip */}
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[0.15, 0.025, 8, 16]} />
        <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 5} />
      </mesh>
    </group>
  );
}

// Beaker outline
function Beaker({ position, scale = 1, theme }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.15 + 1) * 0.04;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Cylindrical body */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1.4, 20, 1, true]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Top rim with spout */}
      <mesh position={[0, 0.7, 0]}>
        <torusGeometry args={[0.5, 0.03, 8, 20]} />
        <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 5} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.5, 20]} />
        <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 3} side={THREE.DoubleSide} />
      </mesh>
      {/* Measurement marks */}
      {[0.3, 0, -0.3].map((y, i) => (
        <mesh key={i} position={[0.45, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.03, 0.15, 0.01]} />
          <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 6} />
        </mesh>
      ))}
    </group>
  );
}

// Test Tube outline
function TestTube({ position, scale = 1, rotation = [0, 0, 0], theme }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = rotation[2] + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 16, 1, true]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Rounded bottom */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Top rim */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 16]} />
        <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 5} />
      </mesh>
    </group>
  );
}

// Round-bottom Flask outline
function RoundFlask({ position, scale = 1, theme }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25 + 2) * 0.06;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Round bottom (sphere) */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} />
      </mesh>
      {/* Long neck */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.9, 16, 1, true]} />
        <meshBasicMaterial color={theme.moleculeColor} wireframe transparent opacity={theme.labOpacity * 4} side={THREE.DoubleSide} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 1.15, 0]}>
        <torusGeometry args={[0.1, 0.02, 8, 16]} />
        <meshBasicMaterial color={theme.moleculeColor} transparent opacity={theme.labOpacity * 5} />
      </mesh>
    </group>
  );
}

/* ============================================================
   🌊 MINIMALIST BEACH SCENE - Just 3 molecules + dust
   ============================================================ */
function Scene({ theme }) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 0.2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 4, 2]} intensity={1.2} color={theme.sunRayColor} />

        <ParallaxGroup mouseRef={mouseRef}>
          {/* Just 3 SMALL molecules at corners */}
          <FloatingMolecule position={[-4.5, 1.8, -2]} scale={0.45} rotationSpeed={0.7} floatSpeed={0.8}>
            <WaterMolecule theme={theme} />
          </FloatingMolecule>

          <FloatingMolecule position={[4.5, 1.5, -2]} scale={0.4} rotationSpeed={1.0} floatSpeed={0.9}>
            <BenzeneMolecule theme={theme} />
          </FloatingMolecule>

          <FloatingMolecule position={[0, -2.5, -2]} scale={0.4} rotationSpeed={0.8} floatSpeed={1.0}>
            <MethaneMolecule theme={theme} />
          </FloatingMolecule>

          {/* Soft dust particles */}
          <DustParticles theme={theme} />
        </ParallaxGroup>
      </Suspense>
    </Canvas>
  );
}

// Parallax wrapper - subtle mouse-based depth
function ParallaxGroup({ children, mouseRef }) {
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) {
      // Smooth lerp toward mouse position
      groupRef.current.rotation.y += (mouseRef.current.x - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (mouseRef.current.y - groupRef.current.rotation.x) * 0.05;
    }
  });
  return <group ref={groupRef}>{children}</group>;
}
/* ============================================
   PROFILE / PERSONAL DATA
   ============================================ */
const PROFILE = {
  name: "Savan Kher",
  title: "QC Chemist",
  tagline: "Quality Control • Lab Operations • Process Innovation",
  bio: "QC Chemist with 3+ years of hands-on experience across edible oil, biodiesel, UCO, alumina, and specialty chemical industries. Skilled in ASTM & ISO methods and advanced instrumentation including ICP-OES, GC, XRF, UV-Vis, Karl Fischer, and potentiometric titration. Currently driving QC operations for UCO-to-SAF feedstock at Bluestone Energy and exploring Python & AI automation to revolutionize lab workflows.",
  location: "Talala, Gir Somnath, Gujarat, India,pin code: 362150",
  email: "khersavan18@gmail.com",
  phone: "+91 96634 93327",
  linkedin: "https://www.linkedin.com/in/savan-kher-4a0a9b293",
  github: "https://github.com/khersavan18-a11y",
  dob: "12 June 2001",
  languages: ["Gujarati (Fluent)", "Hindi (Fluent)", "English (Professional)"],
};

const EDUCATION = [
  { degree: "B.Sc. Chemistry", institution: "Matruvandana College, Veraval", board: "B.K.N.M. University", year: "Apr 2022", percentage: "72.43%" },
  { degree: "H.S.C (12th)", institution: "Popular Science School", board: "G.H.S.E.B", year: "Mar 2018", percentage: "55.02%" },
  { degree: "S.S.C (10th)", institution: "Popular Science School", board: "G.S.E.B", year: "Mar 2016", percentage: "64.66%" },
];

const EXPERIENCE = [
  {
    company: "Bluestone Energy Pvt. Ltd.",
    role: "QC Chemist – UCO & Biodiesel Feedstock Analysis",
    period: "May 2025 – Present",
    current: true,
    points: [
      "Comprehensive UCO quality analysis (FFA, PV, IV, Unsap Matter, Moisture, Sediment) for feedstock qualification",
      "Heavy metal & elemental analysis using ICP-OES for procurement approval and process control",
      "ASTM & ISO testing — D664, D6304, D1983, ISO 8534, 662, 663",
      "Lab setup, method implementation, documentation control & QC system development",
      "ISCC CORSIA audit prep, compliance documentation & sustainability verification",
    ],
  },
  {
    company: "Gujarat Credo Alumina Chemical Pvt. Ltd.",
    role: "QC Chemist",
    period: "Feb 2025 – May 2025",
    points: [
      "Physical & chemical testing of refractory materials (Al₂O₃, SiO₂, Fe₂O₃) via wet digestion",
      "Water, steam coal & zeolite analysis — pH, TDS, LOI, PSD",
      "Production quality improvement through process monitoring",
    ],
  },
  {
    company: "Cargill India Pvt. Ltd.",
    role: "Apprentice QC Analyst",
    period: "Jan 2024 – Jan 2025",
    points: [
      "Finished goods analysis — RSBO, RSFO, RPO, margarine, bakery fats",
      "Edible oil testing — FFA, IV, PV, Anisidine Value, SMP, RI, TFM, SFC, Wax, Vitamin",
      "Water quality testing — COD, Chloride, Silica, TSS, Oil & Grease, pH",
    ],
  },
  {
    company: "Kandla Agro and Chemicals Pvt. Ltd.",
    role: "QC Chemist",
    period: "Feb 2023 – Jan 2024",
    points: [
      "Quality analysis of HCO, 12-HSA, Ricinoleic Acid, and Glycerine",
      "Process monitoring for solvent extraction & refining (AV, IV, SMP, Flash Point)",
      "Raw material testing — castor seed, hexane, coal, acids, water",
    ],
  },
];

/* ============================================
   DEFAULT SECTION DATA (real CV-based)
   ============================================ */
const DEFAULT_DATA = {
  chemSop: [
    { id: 1, title: "UCO Feedstock Qualification SOP", desc: "Complete protocol for FFA, PV, IV, Unsaponifiable Matter, Moisture & Sediment testing of Used Cooking Oil for biodiesel feedstock approval.", tags: ["UCO", "Biodiesel", "ASTM"] },
    { id: 2, title: "ICP-OES Heavy Metal Analysis SOP", desc: "Standard procedure for elemental analysis of UCO samples using Agilent 5800 / Thermo Fisher iCAP PRO for procurement approval.", tags: ["ICP-OES", "Heavy Metals"] },
    { id: 3, title: "Edible Oil Quality Testing SOP", desc: "Comprehensive testing protocol for RSBO, RSFO, RPO including FFA, IV, PV, Anisidine Value, SFC, and Wax content.", tags: ["Edible Oil", "Cargill"] },
    { id: 4, title: "ISCC CORSIA Audit Documentation SOP", desc: "Compliance documentation, sustainability verification & audit preparation procedures for SAF feedstock.", tags: ["Audit", "Compliance", "SAF"] },
  ],
  chemMethods: [
    { id: 1, title: "ASTM D664", desc: "Acid Number determination by potentiometric titration — critical for UCO & biodiesel quality.", tags: ["Titration", "UCO"] },
    { id: 2, title: "ASTM D6304", desc: "Water content determination via Karl Fischer coulometric titration.", tags: ["Karl Fischer", "Moisture"] },
    { id: 3, title: "ASTM D1983", desc: "Fatty acid composition analysis of natural fats & oils via GC.", tags: ["GC", "Fatty Acids"] },
    { id: 4, title: "ISO 8534", desc: "Animal & vegetable fats — moisture content using Karl Fischer reagent.", tags: ["ISO", "Moisture"] },
    { id: 5, title: "ISO 662", desc: "Determination of moisture and volatile matter content in oils.", tags: ["ISO", "Volatiles"] },
    { id: 6, title: "ISO 663", desc: "Determination of insoluble impurities content in animal and vegetable oils.", tags: ["ISO", "Purity"] },
  ],
  chemInstruments: [
    { id: 1, title: "ICP-OES", desc: "Agilent 5800 & Thermo Fisher iCAP PRO — heavy metals & multi-element analysis", tags: ["Spectroscopy", "Trace Metals"] },
    { id: 2, title: "Gas Chromatograph", desc: "Agilent 7890 & 8890B — fatty acid methyl esters, volatiles & purity testing", tags: ["GC", "Separation"] },
    { id: 3, title: "ED-XRF", desc: "Shimadzu EDX-7000 — non-destructive elemental analysis of oils & solids", tags: ["XRF", "Elemental"] },
    { id: 4, title: "UV-Vis Spectrophotometer", desc: "Shimadzu UV-1900i & UV-1800 — colorimetric & quantitative analysis", tags: ["UV-Vis", "Quantitative"] },
    { id: 5, title: "TGA — LECO 801", desc: "Thermogravimetric analysis for moisture, volatiles & ash content", tags: ["TGA", "Thermal"] },
    { id: 6, title: "Karl Fischer Titrator", desc: "Metrohm — precise water content determination for oils & solvents", tags: ["KF", "Moisture"] },
    { id: 7, title: "Potentiometric Titrator", desc: "Metrohm — automated acid number, base number & ionic determinations", tags: ["Titration", "Automated"] },
    { id: 8, title: "Rancimat", desc: "Oxidation stability index (OSI) of fats, oils & biodiesel", tags: ["Stability", "Oxidation"] },
    { id: 9, title: "Particle Size Analyzer", desc: "Microtrac S3500 — laser diffraction particle size distribution analysis", tags: ["PSD", "Refractory"] },
    { id: 10, title: "NMR SFC Analyzer", desc: "Solid Fat Content determination for margarine & bakery fats", tags: ["NMR", "SFC"] },
  ],
  chemKnowledge: [
    { id: 1, title: "Wet Chemistry Analysis", desc: "Fundamentals of titration, gravimetric analysis & classical chemistry methods.", tags: ["Fundamentals"] },
    { id: 2, title: "UCO-to-SAF Process", desc: "Sustainable Aviation Fuel feedstock chemistry — converting waste oil to clean fuel.", tags: ["SAF", "Sustainability"] },
    { id: 3, title: "Edible Oil Chemistry", desc: "RSBO, RSFO, RPO, margarine & bakery fat processing fundamentals.", tags: ["Edible Oil"] },
    { id: 4, title: "Refractory Materials Testing", desc: "Al₂O₃, SiO₂, Fe₂O₃ wet digestion & physical property characterization.", tags: ["Refractory"] },
    { id: 5, title: "Water Quality Analysis", desc: "COD, TDS, Chloride, Silica, TSS analysis for industrial process water.", tags: ["Water", "Industrial"] },
    { id: 6, title: "Castor Oil Derivatives", desc: "HCO, 12-HSA, Ricinoleic Acid chemistry & quality parameters.", tags: ["Castor", "Derivatives"] },
  ],
  calisthenicsData: [
    { id: 1, title: "Handstand Hold", desc: "Working on freestanding handstand. Building wall-supported endurance & balance.", tags: ["Balance", "Beginner"], progress: 30 },
    { id: 2, title: "Human Flag", desc: "Strength building for vertical body lever. Working on tuck flag progression.", tags: ["Strength", "Beginner"], progress: 25 },
    { id: 3, title: "Muscle Up", desc: "Bar muscle up training — explosive pull-up + transition + dip combination.", tags: ["Power", "Beginner"], progress: 35 },
  ],
  pythonData: [
    { id: 1, title: "Python Basics Journey", desc: "Learning fundamentals — variables, loops, functions, OOP, file handling.", tags: ["Learning", "Basics"], progress: 40 },
    { id: 2, title: "AI Workflow Automation", desc: "Exploring AI tools & Python scripts to automate QC lab data entry & report generation.", tags: ["AI", "Automation"], progress: 20 },
  ],
  websitesData: [
    { id: 1, title: "Personal Portfolio", desc: "This very website! Built with React, TypeScript, Vite & Three.js. Features 3D atom, daily journal & dynamic content management.", tags: ["React", "Three.js", "TypeScript"], url: "https://my-portfolio-beta-silk-51.vercel.app/", github: "https://github.com/khersavan18-a11y/my-portfolio" },
  ],
};
/* ============================================
   DAILY JOURNAL CALENDAR COMPONENT
   ============================================ */
function JournalCalendar({ entries, setEntries, isOwner }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [entryText, setEntryText] = useState("");
  const [mood, setMood] = useState("😊");

  const moods = ["😄", "😊", "😐", "😔", "😤", "💪", "🔥", "🎯"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const getDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const calculateStreak = () => {
    let streak = 0;
    let d = new Date();
    while (entries[getDateKey(d)]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };
  const handleDateClick = (day) => {
  const date = new Date(year, month, day);
  const key = getDateKey(date);
  // 🔒 Visitors can ONLY click dates with existing entries
  if (!isOwner && !entries[key]) return;
  setSelectedDate(key);
  if (entries[key]) {
    setEntryText(entries[key].text);
    setMood(entries[key].mood);
  } else {
    setEntryText("");
    setMood("😊");
  }
};

  const saveEntry = () => {
    if (!entryText.trim()) return;
    const newEntries = { ...entries, [selectedDate]: { text: entryText, mood, savedAt: new Date().toISOString() } };
    setEntries(newEntries);
    setSelectedDate(null);
    setEntryText("");
  };

  const deleteEntry = () => {
    const newEntries = { ...entries };
    delete newEntries[selectedDate];
    setEntries(newEntries);
    setSelectedDate(null);
    setEntryText("");
  };

  const today = new Date();
  const todayKey = getDateKey(today);
  const totalEntries = Object.keys(entries).length;
  const streak = calculateStreak();

  return (
    <div>
      {/* Stats Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <Icons.fire size={28} color="#f97316" />
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: "#f97316" }}>{streak}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Day Streak</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))", border: "1px solid rgba(6,182,212,0.3)", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <Icons.edit size={28} color="#06b6d4" />
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: "#06b6d4" }}>{totalEntries}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>Total Entries</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 16, padding: 20, textAlign: "center" }}>
          <Icons.calendar size={28} color="#8b5cf6" />
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8, color: "#8b5cf6" }}>{Object.keys(entries).filter(k => k.startsWith(`${year}-${String(month+1).padStart(2,"0")}`)).length}</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>This Month</div>
        </div>
      </div>

      {/* Calendar Header */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24, backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>← Prev</button>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{monthNames[month]} {year}</h3>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", color: "white", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14 }}>Next →</button>
        </div>

        {/* Day labels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#64748b", padding: 8 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {Array.from({ length: firstDay }).map((_, i) => (<div key={`empty-${i}`}></div>))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(year, month, day);
            const key = getDateKey(date);
            const hasEntry = !!entries[key];
            const isToday = key === todayKey;
            return (
              <button key={day} onClick={() => handleDateClick(day)} style={{
                aspectRatio: "1", border: isToday ? "2px solid #06b6d4" : hasEntry ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.08)",
                background: hasEntry ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(6,182,212,0.3))" : "rgba(255,255,255,0.02)",
                color: "white", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: isToday ? 700 : 500, position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                {day}
                {hasEntry && <span style={{ fontSize: 14, marginTop: 2 }}>{entries[key].mood}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entry Modal */}
      {selectedDate && (
        <div onClick={() => setSelectedDate(null)} style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 500 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "white", fontSize: 20 }}>📝 {selectedDate}</h3>
              <button onClick={() => setSelectedDate(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><Icons.x size={22} /></button>
            </div>

            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>
  {isOwner ? "How was your day?" : "Mood logged for this day"}
</label>
<div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
  {isOwner ? (
    moods.map((m) => (
      <button 
        key={m} 
        onClick={() => setMood(m)} 
        style={{ 
          fontSize: 24, 
          padding: 8, 
          borderRadius: 10, 
          cursor: "pointer", 
          background: mood === m ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)", 
          border: mood === m ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.1)" 
        }}
      >
        {m}
      </button>
    ))
  ) : (
    <div style={{
      padding: "12px 20px",
      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.15))",
      border: "1px solid rgba(99,102,241,0.3)",
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      gap: 12
    }}>
      <span style={{ fontSize: 32 }}>{mood}</span>
      <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
        Savan's mood for this day
      </span>
    </div>
  )}
</div>

            <label style={{ color: "#94a3b8", fontSize: 13, display: "block", marginBottom: 8 }}>Your journal entry</label>
            {isOwner ? (
  <textarea 
    value={entryText} 
    onChange={(e) => setEntryText(e.target.value)} 
    placeholder="What did you accomplish today? What did you learn? How do you feel?" 
    rows={6} 
    style={{ 
      width: "100%", 
      padding: 12, 
      background: "rgba(255,255,255,0.05)", 
      border: "1px solid rgba(255,255,255,0.1)", 
      borderRadius: 10, 
      color: "white", 
      fontSize: 14, 
      fontFamily: "inherit", 
      resize: "vertical", 
      boxSizing: "border-box" 
    }} 
  />
) : (
  <div style={{ 
    width: "100%", 
    padding: 24, 
    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))", 
    border: "1px solid rgba(99,102,241,0.2)", 
    borderRadius: 10, 
    textAlign: "center",
    minHeight: 140,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    boxSizing: "border-box"
  }}>
    <div style={{ fontSize: 48 }}>🔒</div>
    <div style={{ fontSize: 16, color: "white", fontWeight: 700 }}>Private Journal Entry</div>
    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, maxWidth: 320 }}>
      Savan logged this day with mood {entries[selectedDate]?.mood || "😊"} but the personal reflection is private.
    </div>
    <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
      💭 Some thoughts are just for the soul
    </div>
  </div>
)}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
             {isOwner && (
              <>
             <button onClick={saveEntry} style={{ flex: 1, padding: "12px 20px", background: "linear-gradient(135deg, #6366f1, #06b6d4)", border: "none", borderRadius: 10, color: "white", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>💾 Save Entry</button>
              {entries[selectedDate] && (
             <button onClick={deleteEntry} style={{ padding: "12px 20px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, color: "#ef4444", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Delete</button>
             )}
             </>
             )}
             {!isOwner && (
             <button onClick={() => setSelectedDate(null)} style={{ flex: 1, padding: "12px 20px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Close</button>
          )}
           </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* ============================================================
   ⏰ TIME & THEME SYSTEM
   ============================================================ */
function getISTHour() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (5.5 * 3600000));
  return ist.getHours() + ist.getMinutes() / 60;
}

function getSkyTheme(hour) {
  // 🌙 Night Mode (7 PM - 5 AM)
  if (hour >= 19 || hour < 5) {
    return {
      name: "night",
      emoji: "🌙",
      label: "Night",
      isNight: true,
      bgGradient: "linear-gradient(135deg, #0a0e27 0%, #1a1a3e 50%, #0f172a 100%)",
      cursorGlow: "rgba(99, 102, 241, 0.15)",
      cursorCore: "rgba(139, 92, 246, 0.25)",
      ambientGlow: "rgba(99, 102, 241, 0.08)",
      textColor: "white",
      mutedColor: "#94a3b8",
      cardBg: "rgba(15,23,42,0.5)",
      cardBorder: "rgba(255,255,255,0.12)",
    };
  }
  // ☀️ Day Mode (5 AM - 7 PM)
  return {
    name: "day",
    emoji: "☀️",
    label: "Day",
    isNight: false,
    bgGradient: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 40%, #E0F6FF 100%)",
    cursorGlow: "rgba(255, 255, 255, 0.45)",
    cursorCore: "rgba(255, 255, 255, 0.7)",
    ambientGlow: "rgba(255, 255, 255, 0.3)",
    textColor: "#0f172a",
    mutedColor: "#475569",
    cardBg: "rgba(255,255,255,0.3)",
    cardBorder: "rgba(255,255,255,0.5)",
  };
}

/* ============================================================
   ✨ CURSOR GLOW - Fixed to viewport, follows mouse smoothly
   ============================================================ */
function CursorGlow({ theme }) {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Big soft outer glow */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.cursorGlow} 0%, transparent 60%)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 1,
          mixBlendMode: theme.isNight ? "screen" : "soft-light",
          transition: "background 3s ease",
        }}
      />
      {/* Smaller intense glow */}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.cursorCore} 0%, transparent 65%)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 2,
          mixBlendMode: theme.isNight ? "screen" : "overlay",
          transition: "background 3s ease",
        }}
      />
    </>
  );
}

/* ============================================
   MAIN APP
   ============================================ */
export default function App() {
  const [section, setSection] = useState("home");
  const [chemTab, setChemTab] = useState("sop");
    const [skyTheme, setSkyTheme] = useState(() => getSkyTheme(22));
  useEffect(() => {
    const updateSky = () => setSkyTheme(getSkyTheme(getISTHour()));
    const interval = setInterval(updateSky, 60000);
    return () => clearInterval(interval);
  }, []);
  // 🔒 OWNER MODE - Only you can edit/delete
const [isOwner, setIsOwner] = useState(() => localStorage.getItem("isOwner") === "true");
const SECRET_KEY = "savan2025"; // 🔑 Change this to your own secret!

// Listen for secret keyboard shortcut: press "O" key 3 times
useEffect(() => {
  let oCount = 0;
  let timer = null;
  const handleKey = (e) => {
    if (e.key === "o" || e.key === "O") {
      oCount++;
      clearTimeout(timer);
      timer = setTimeout(() => { oCount = 0; }, 1000);
      if (oCount === 3) {
        const key = prompt("🔒 Enter owner key:");
        if (key === SECRET_KEY) {
          setIsOwner(true);
          localStorage.setItem("isOwner", "true");
          alert("✅ Owner mode activated! You can now edit content.");
        } else if (key !== null) {
          alert("❌ Wrong key");
        }
        oCount = 0;
      }
    }
  };
  window.addEventListener("keydown", handleKey);
  return () => window.removeEventListener("keydown", handleKey);
}, []);

const logoutOwner = () => {
  if (confirm("Logout from owner mode?")) {
    setIsOwner(false);
    localStorage.removeItem("isOwner");
  }
};
  const [modal, setModal] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const [chemSop, setChemSop] = useState(() => JSON.parse(localStorage.getItem("chemSop")) || DEFAULT_DATA.chemSop);
  const [chemMethods, setChemMethods] = useState(() => JSON.parse(localStorage.getItem("chemMethods")) || DEFAULT_DATA.chemMethods);
  const [chemInstruments, setChemInstruments] = useState(() => JSON.parse(localStorage.getItem("chemInstruments")) || DEFAULT_DATA.chemInstruments);
  const [chemKnowledge, setChemKnowledge] = useState(() => JSON.parse(localStorage.getItem("chemKnowledge")) || DEFAULT_DATA.chemKnowledge);
  const [calisthenicsData, setCalisthenicsData] = useState(() => JSON.parse(localStorage.getItem("calisthenicsData")) || DEFAULT_DATA.calisthenicsData);
  const [pythonData, setPythonData] = useState(() => JSON.parse(localStorage.getItem("pythonData")) || DEFAULT_DATA.pythonData);
  const [websitesData, setWebsitesData] = useState(() => JSON.parse(localStorage.getItem("websitesData")) || DEFAULT_DATA.websitesData);
  const [journalEntries, setJournalEntries] = useState(() => JSON.parse(localStorage.getItem("journalEntries")) || {});

  const [form, setForm] = useState({ title: "", desc: "", tags: "", url: "", github: "", progress: 0 });

  useEffect(() => { localStorage.setItem("chemSop", JSON.stringify(chemSop)); }, [chemSop]);
  useEffect(() => { localStorage.setItem("chemMethods", JSON.stringify(chemMethods)); }, [chemMethods]);
  useEffect(() => { localStorage.setItem("chemInstruments", JSON.stringify(chemInstruments)); }, [chemInstruments]);
  useEffect(() => { localStorage.setItem("chemKnowledge", JSON.stringify(chemKnowledge)); }, [chemKnowledge]);
  useEffect(() => { localStorage.setItem("calisthenicsData", JSON.stringify(calisthenicsData)); }, [calisthenicsData]);
  useEffect(() => { localStorage.setItem("pythonData", JSON.stringify(pythonData)); }, [pythonData]);
  useEffect(() => { localStorage.setItem("websitesData", JSON.stringify(websitesData)); }, [websitesData]);
  useEffect(() => { localStorage.setItem("journalEntries", JSON.stringify(journalEntries)); }, [journalEntries]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const resetForm = () => setForm({ title: "", desc: "", tags: "", url: "", github: "", progress: 0 });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    const newItem = { id: Date.now(), title: form.title, desc: form.desc, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean), url: form.url, github: form.github, progress: parseInt(form.progress) || 0 };
    const setters = { chemSop: setChemSop, chemMethods: setChemMethods, chemInstruments: setChemInstruments, chemKnowledge: setChemKnowledge, calisthenicsData: setCalisthenicsData, pythonData: setPythonData, websitesData: setWebsitesData };
    const getters = { chemSop, chemMethods, chemInstruments, chemKnowledge, calisthenicsData, pythonData, websitesData };
    setters[modal]([...getters[modal], newItem]);
    resetForm();
    setModal(null);
  };

  const handleDelete = (key, id) => {
    const setters = { chemSop: setChemSop, chemMethods: setChemMethods, chemInstruments: setChemInstruments, chemKnowledge: setChemKnowledge, calisthenicsData: setCalisthenicsData, pythonData: setPythonData, websitesData: setWebsitesData };
    const getters = { chemSop, chemMethods, chemInstruments, chemKnowledge, calisthenicsData, pythonData, websitesData };
    setters[key](getters[key].filter(i => i.id !== id));
  };

  const scrollTo = (id) => {
    setSection(id);
    setMobileMenu(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const tagColor = (tag) => {
    const colors = ["#6366f1","#06b6d4","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444"];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // Reusable Card Component
  const Card = ({ item, dataKey, isWebsite }) => (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, position: "relative", backdropFilter: "blur(10px)", transition: "all 0.3s", cursor: isWebsite && item.url ? "pointer" : "default" }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
    {isOwner && (
  <button onClick={(e) => { e.stopPropagation(); handleDelete(dataKey, item.id); }} style={{ position: "absolute", top: 12, right: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: 6, cursor: "pointer", color: "#ef4444" }}><Icons.trash size={14} /></button>
)}
      <h3 style={{ color: "white", fontSize: 17, fontWeight: 700, marginTop: 0, marginBottom: 8, paddingRight: 36 }}>{item.title}</h3>
      <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: "0 0 12px 0" }}>{item.desc}</p>
      {item.progress > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 4 }}><span>Progress</span><span>{item.progress}%</span></div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${item.progress}%`, background: "linear-gradient(90deg, #6366f1, #06b6d4)", borderRadius: 3 }}></div>
          </div>
        </div>
      )}
      {item.tags && item.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: isWebsite ? 12 : 0 }}>
          {item.tags.map((t, i) => (
            <span key={i} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: `${tagColor(t)}22`, color: tagColor(t), border: `1px solid ${tagColor(t)}44`, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      )}
      {isWebsite && (item.url || item.github) && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "8px 12px", background: "linear-gradient(135deg, #6366f1, #06b6d4)", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Icons.external size={14} /> Visit</a>}
          {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", padding: "8px 12px", background: "rgba(255,255,255,0.05)", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Icons.github size={14} /> Code</a>}
        </div>
      )}
    </div>
  );

  const sectionTitle = (icon, title, subtitle) => (
    <div style={{ textAlign: "center", marginBottom: 40 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 999, marginBottom: 16 }}>
        {icon}
        <span style={{ fontSize: 13, color: "#a5b4fc", fontWeight: 600, letterSpacing: 1 }}>{subtitle}</span>
      </div>
      <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h2>
    </div>
  );

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "chemistry", label: "Chemistry" },
    { id: "calisthenics", label: "Calisthenics" },
    { id: "python", label: "Python" },
    { id: "websites", label: "Websites" },
    { id: "journal", label: "Journal" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "white", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* NAVBAR */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div onClick={() => scrollTo("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.zap size={18} color="white" /></div>
            <span style={{ fontWeight: 800, fontSize: 18 }}>Savan<span style={{ color: "#06b6d4" }}>.</span></span>
          </div>
          <div className="desktop-nav" style={{ display: "flex", gap: 4 }}>
            {navItems.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} style={{ padding: "8px 14px", background: section === n.id ? "rgba(99,102,241,0.2)" : "transparent", border: "none", color: section === n.id ? "#a5b4fc" : "#94a3b8", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s" }}>{n.label}</button>
            ))}
          </div>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="mobile-toggle" style={{ display: "none", background: "transparent", border: "none", color: "white", cursor: "pointer" }}><Icons.menu size={24} /></button>
        </div>
        {mobileMenu && (
          <div style={{ background: "rgba(15,23,42,0.95)", padding: 16, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            {navItems.map((n) => (<button key={n.id} onClick={() => scrollTo(n.id)} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "transparent", border: "none", color: "#94a3b8", fontSize: 14, cursor: "pointer", borderRadius: 8 }}>{n.label}</button>))}
          </div>
        )}
      </nav>
      {/* ═══════════════════════════════════════════════
          ✨ MINIMALIST HERO with Fixed Cursor Glow
          ═══════════════════════════════════════════════ */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          paddingTop: 80,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: skyTheme.bgGradient,
          transition: "background 3s ease",
          overflow: "hidden",
        }}
      >
        {/* Cursor-following glow (FIXED to viewport — works while scrolling) */}
        {skyTheme.isNight && <CursorGlow theme={skyTheme} />}

        {/* Ambient corner glows (subtle depth) */}
        <div style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: skyTheme.ambientGlow,
          filter: "blur(80px)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 3s ease",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: skyTheme.ambientGlow,
          filter: "blur(80px)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 3s ease",
        }} />

        {/* Time badge */}
        <div style={{
          position: "absolute",
          top: 100,
          right: 24,
          zIndex: 10,
          padding: "10px 18px",
          background: skyTheme.cardBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${skyTheme.cardBorder}`,
          borderRadius: 999,
          color: skyTheme.textColor,
          fontSize: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          transition: "all 3s ease",
        }}>
          <span style={{ fontSize: 16 }}>{skyTheme.emoji}</span>
          <span>{skyTheme.label} • IST</span>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#10b981",
            boxShadow: "0 0 8px #10b981"
          }}></span>
        </div>

        {/* MAIN CONTENT */}
        <div style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 880,
          width: "100%",
          padding: "40px 24px",
          margin: "0 auto",
        }}>
          {/* Premium Glass Card */}
          <div style={{
            position: "relative",
            padding: "52px 44px",
            background: skyTheme.cardBg,
            backdropFilter: "blur(30px) saturate(180%)",
            WebkitBackdropFilter: "blur(30px) saturate(180%)",
            border: `1px solid ${skyTheme.cardBorder}`,
            borderRadius: 28,
            boxShadow: skyTheme.isNight
              ? "0 25px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 25px 80px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
            textAlign: "center",
            overflow: "hidden",
            transition: "all 3s ease",
          }}>
            {/* Corner accents */}
            {[
              { top: 12, left: 12, borderTop: `2px solid ${skyTheme.isNight ? "#06b6d4" : "#0288d1"}`, borderLeft: `2px solid ${skyTheme.isNight ? "#06b6d4" : "#0288d1"}` },
              { top: 12, right: 12, borderTop: `2px solid ${skyTheme.isNight ? "#6366f1" : "#1976d2"}`, borderRight: `2px solid ${skyTheme.isNight ? "#6366f1" : "#1976d2"}` },
              { bottom: 12, left: 12, borderBottom: `2px solid ${skyTheme.isNight ? "#6366f1" : "#1976d2"}`, borderLeft: `2px solid ${skyTheme.isNight ? "#6366f1" : "#1976d2"}` },
              { bottom: 12, right: 12, borderBottom: `2px solid ${skyTheme.isNight ? "#06b6d4" : "#0288d1"}`, borderRight: `2px solid ${skyTheme.isNight ? "#06b6d4" : "#0288d1"}` },
            ].map((corner, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 22, height: 22,
                ...corner,
                borderRadius: i === 0 ? "10px 0 0 0" : i === 1 ? "0 10px 0 0" : i === 2 ? "0 0 0 10px" : "0 0 10px 0",
                pointerEvents: "none"
              }} />
            ))}

            {/* Status badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.4)",
              borderRadius: 999,
              marginBottom: 28
            }}>
              <span style={{
                width: 8, height: 8,
                borderRadius: "50%",
                background: "#10b981",
                animation: "pulse 2s infinite",
                boxShadow: "0 0 12px #10b981"
              }}></span>
              <span style={{ fontSize: 12, color: "#059669", fontWeight: 700, letterSpacing: 0.5 }}>
                Available for opportunities
              </span>
            </div>

            {/* Heading - FIXED with darker gradient for day */}
            <h1 style={{
              fontSize: "clamp(36px, 7vw, 64px)",
              fontWeight: 900,
              margin: 0,
              lineHeight: 1.1,
              marginBottom: 16,
              color: skyTheme.textColor,
              textShadow: skyTheme.isNight ? "0 4px 24px rgba(0,0,0,0.5)" : "0 2px 12px rgba(255,255,255,0.5)",
              letterSpacing: "-0.02em",
              transition: "color 3s ease",
            }}>
             Hi, I'm <span style={{
             color: skyTheme.isNight ? "#06b6d4" : "#1e40af",
             fontWeight: 900,
             textShadow: skyTheme.isNight 
              ? "0 0 30px rgba(6,182,212,0.4)" 
              : "0 2px 8px rgba(255,255,255,0.6)",
             transition: "color 3s ease",
             position: "relative",
             zIndex: 10,
             }}>{PROFILE.name}</span>
            </h1>

            {/* Title */}
            <p style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              color: skyTheme.textColor,
              margin: "0 0 8px 0",
              fontWeight: 700,
              transition: "color 3s ease",
            }}>
              {PROFILE.title}
            </p>

            {/* Tagline with dots */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              margin: "0 0 28px 0",
              flexWrap: "wrap"
            }}>
              {PROFILE.tagline.split("•").map((part, i, arr) => (
                <React.Fragment key={i}>
                  <span style={{
                    fontSize: 13,
                    color: skyTheme.mutedColor,
                    fontWeight: 600,
                    letterSpacing: 1,
                    transition: "color 3s ease",
                  }}>
                    {part.trim()}
                  </span>
                  {i < arr.length - 1 && (
                    <span style={{
                      width: 4, height: 4, borderRadius: "50%",
                      background: skyTheme.isNight ? "#06b6d4" : "#0288d1"
                    }}></span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bio */}
            <p style={{
              fontSize: 15,
              color: skyTheme.mutedColor,
              lineHeight: 1.75,
              margin: "0 auto 36px auto",
              maxWidth: 680,
              transition: "color 3s ease",
            }}>
              {PROFILE.bio}
            </p>

            {/* CTA Buttons */}
            <div style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 32
            }}>
              <button
                onClick={() => scrollTo("contact")}
                style={{
                  padding: "13px 30px",
                  background: skyTheme.isNight
                    ? "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)"
                    : "linear-gradient(135deg, #1976d2 0%, #06b6d4 100%)",
                  border: "none",
                  borderRadius: 12,
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: skyTheme.isNight
                    ? "0 12px 32px rgba(99,102,241,0.4)"
                    : "0 12px 32px rgba(25,118,210,0.4)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(-1px) scale(0.98)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
              >
                <Icons.mail size={16} /> Hire Me
              </button>
              <button
                onClick={() => scrollTo("experience")}
                style={{
                  padding: "13px 30px",
                  background: skyTheme.isNight ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)",
                  border: skyTheme.isNight ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.8)",
                  borderRadius: 12,
                  color: skyTheme.textColor,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  backdropFilter: "blur(10px)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(-1px) scale(0.98)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; }}
              >
                <Icons.briefcase size={16} /> View Experience
              </button>
            </div>

            {/* Social Icons */}
            <div style={{
              display: "flex",
              gap: 14,
              justifyContent: "center"
            }}>
              {[
                { href: PROFILE.linkedin, icon: <Icons.linkedin size={20} />, color: "#0A66C2", glow: "rgba(10,102,194,0.5)" },
                { href: PROFILE.github, icon: <Icons.github size={20} />, color: skyTheme.isNight ? "#fff" : "#24292e", glow: skyTheme.isNight ? "rgba(255,255,255,0.4)" : "rgba(36,41,46,0.4)" },
                { href: `mailto:${PROFILE.email}`, icon: <Icons.mail size={20} />, color: "#06b6d4", glow: "rgba(6,182,212,0.5)" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: skyTheme.textColor,
                    padding: 12,
                    background: skyTheme.isNight ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)",
                    borderRadius: 12,
                    border: skyTheme.isNight ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "inline-flex",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px) scale(1.1)";
                    e.currentTarget.style.color = s.color;
                    e.currentTarget.style.boxShadow = `0 12px 28px ${s.glow}, 0 0 0 2px ${s.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.color = skyTheme.textColor;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-4px) scale(1.1)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute",
            bottom: -55,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: skyTheme.isNight ? "rgba(255,255,255,0.5)" : "rgba(15,23,42,0.5)",
            fontSize: 10,
            letterSpacing: 3,
            fontWeight: 600,
            transition: "color 3s ease",
          }}>
            <span>SCROLL</span>
            <div style={{
              width: 1,
              height: 28,
              background: skyTheme.isNight
                ? "linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)"
                : "linear-gradient(to bottom, rgba(15,23,42,0.6), transparent)",
              animation: "scrollDown 2s infinite"
            }} />
          </div>
        </div>
      </section>
      {/* STATS STRIP */}
      <section style={{ 
  padding: "60px 24px",
  background: skyTheme.isNight ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)",
  transition: "background 3s ease",
}}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { count: chemSop.length + chemMethods.length + chemInstruments.length + chemKnowledge.length, label: "Chemistry Items", icon: <Icons.flask size={24} color="#06b6d4" /> },
            { count: "3+", label: "Years Experience", icon: <Icons.briefcase size={24} color="#6366f1" /> },
            { count: 4, label: "Companies", icon: <Icons.zap size={24} color="#8b5cf6" /> },
            { count: 10, label: "Lab Instruments", icon: <Icons.flask size={24} color="#ec4899" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, textAlign: "center", backdropFilter: "blur(10px)" }}>
              <div style={{ marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, background: "linear-gradient(135deg, #6366f1, #06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.count}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ 
           padding: "80px 24px",
           background: skyTheme.isNight ? "transparent" : "linear-gradient(180deg, #E0F6FF 0%, #B0E0E6 100%)",
            transition: "background 3s ease",
           color: skyTheme.textColor,
          }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.zap size={14} color="#a5b4fc" />, "About Me", "WHO I AM")}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { icon: <Icons.graduation size={28} color="#6366f1" />, title: "B.Sc. Chemistry", desc: "Matruvandana College, Veraval — 72.43% (2022)" },
              { icon: <Icons.briefcase size={28} color="#06b6d4" />, title: "3+ Years QC Experience", desc: "Edible oil, biodiesel, alumina & chemical industries" },
              { icon: <Icons.flask size={28} color="#8b5cf6" />, title: "Advanced Instrumentation", desc: "ICP-OES, GC, XRF, UV-Vis, Karl Fischer & more" },
              { icon: <Icons.code size={28} color="#ec4899" />, title: "Tech & Automation", desc: "Python, Power BI & AI tools for smarter QC workflows" },
            ].map((c, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, backdropFilter: "blur(10px)" }}>
                <div style={{ marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ color: "white", fontSize: 17, fontWeight: 700, margin: "0 0 8px 0" }}>{c.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Education Timeline */}
          <h3 style={{ fontSize: 22, marginTop: 60, marginBottom: 24, color: "white", display: "flex", alignItems: "center", gap: 10 }}><Icons.graduation size={22} color="#06b6d4" /> Education</h3>
          <div style={{ display: "grid", gap: 16 }}>
            {EDUCATION.map((e, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
                <div>
                  <h4 style={{ color: "white", margin: "0 0 6px 0", fontSize: 16 }}>{e.degree}</h4>
                  <p style={{ color: "#94a3b8", margin: "0 0 4px 0", fontSize: 14 }}>{e.institution} — {e.board}</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: 13 }}>{e.year}</p>
                </div>
                <div style={{ padding: "6px 14px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 999, color: "#06b6d4", fontWeight: 700, fontSize: 14 }}>{e.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ 
        padding: "80px 24px",
        background: skyTheme.isNight ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, #B0E0E6 0%, #87CEEB 100%)",
        transition: "background 3s ease",
        color: skyTheme.textColor,
         }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.briefcase size={14} color="#a5b4fc" />, "Work Experience", "MY JOURNEY")}
          <div style={{ display: "grid", gap: 20 }}>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: exp.current ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, backdropFilter: "blur(10px)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ color: "white", margin: "0 0 4px 0", fontSize: 18 }}>{exp.role}</h3>
                    <p style={{ color: "#06b6d4", margin: 0, fontSize: 15, fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {exp.current && <span style={{ padding: "4px 10px", background: "rgba(16,185,129,0.15)", color: "#10b981", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>● CURRENT</span>}
                    <span style={{ padding: "4px 10px", background: "rgba(99,102,241,0.1)", color: "#a5b4fc", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{exp.period}</span>
                  </div>
                </div>
                <ul style={{ margin: 0, paddingLeft: 20, color: "#94a3b8", fontSize: 14, lineHeight: 1.8 }}>
                  {exp.points.map((p, j) => (<li key={j}>{p}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHEMISTRY */}
      <section id="chemistry" style={{ 
         padding: "80px 24px",
         background: skyTheme.isNight ? "transparent" : "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)",
         transition: "background 3s ease",
         color: skyTheme.textColor,
          }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.flask size={14} color="#a5b4fc" />, "Chemistry", "MY EXPERTISE")}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
            {[{ id: "sop", label: "SOPs" },{ id: "methods", label: "Methods" },{ id: "instruments", label: "Instruments" },{ id: "knowledge", label: "Knowledge" }].map((t) => (
              <button key={t.id} onClick={() => setChemTab(t.id)} style={{ padding: "10px 20px", background: chemTab === t.id ? "linear-gradient(135deg, #6366f1, #06b6d4)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          {isOwner && (
  <button onClick={() => setModal(`chem${chemTab.charAt(0).toUpperCase() + chemTab.slice(1)}`)} style={{ padding: "10px 18px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
    <Icons.plus size={16} /> Add New
  </button>
)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {(chemTab === "sop" ? chemSop : chemTab === "methods" ? chemMethods : chemTab === "instruments" ? chemInstruments : chemKnowledge).map((item) => (
              <Card key={item.id} item={item} dataKey={chemTab === "sop" ? "chemSop" : chemTab === "methods" ? "chemMethods" : chemTab === "instruments" ? "chemInstruments" : "chemKnowledge"} />
            ))}
          </div>
        </div>
      </section>

      {/* CALISTHENICS */}
      <section id="calisthenics" style={{ 
  padding: "80px 24px",
  background: skyTheme.isNight ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, #B0E0E6 0%, #E0F6FF 100%)",
  transition: "background 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.dumbbell size={14} color="#a5b4fc" />, "Calisthenics", "FITNESS JOURNEY")}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            {isOwner && (
              <button onClick={() => setModal("calisthenicsData")} style={{ padding: "10px 18px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.plus size={16} /> Add Skill
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {calisthenicsData.map((item) => (<Card key={item.id} item={item} dataKey="calisthenicsData" />))}
          </div>
        </div>
      </section>

      {/* PYTHON */}
      <section id="python" style={{ 
  padding: "80px 24px",
  background: skyTheme.isNight ? "transparent" : "linear-gradient(180deg, #E0F6FF 0%, #B0E0E6 100%)",
  transition: "background 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.code size={14} color="#a5b4fc" />, "Python", "LEARNING PATH")}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            {isOwner && (
              <button onClick={() => setModal("pythonData")} style={{ padding: "10px 18px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.plus size={16} /> Add Project
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {pythonData.map((item) => (<Card key={item.id} item={item} dataKey="pythonData" isWebsite={true} />))}
          </div>
        </div>
      </section>

      {/* WEBSITES */}
      <section id="websites" style={{ 
  padding: "80px 24px",
  background: skyTheme.isNight ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, #B0E0E6 0%, #87CEEB 100%)",
  transition: "background 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {sectionTitle(<Icons.globe size={14} color="#a5b4fc" />, "Websites", "MY BUILDS")}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            {isOwner && (
              <button onClick={() => setModal("websitesData")} style={{ padding: "10px 18px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <Icons.plus size={16} /> Add Website
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {websitesData.map((item) => (<Card key={item.id} item={item} dataKey="websitesData" isWebsite={true} />))}
          </div>
        </div>
      </section>

      {/* JOURNAL CALENDAR */}
      <section id="journal" style={{ 
  padding: "80px 24px",
  background: skyTheme.isNight ? "transparent" : "linear-gradient(180deg, #87CEEB 0%, #B0E0E6 100%)",
  transition: "background 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {sectionTitle(<Icons.calendar size={14} color="#a5b4fc" />, "Daily Journal", "TRACK MY PROGRESS")}
          <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 15, marginBottom: 32, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>Click any date to log what I did, learned, or felt that day. Build a streak, track moods & reflect on growth! 🚀</p>
          <JournalCalendar entries={journalEntries} setEntries={setJournalEntries} isOwner={isOwner} />
        </div>
      </section>
      {!isOwner && Object.keys(journalEntries).length > 0 && (
  <div style={{
    marginTop: 24,
    marginBottom: 24,
    padding: 20,
    background: skyTheme.isNight ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.4)",
    border: `1px solid ${skyTheme.isNight ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)"}`,
    borderRadius: 16,
    textAlign: "center",
  }}>
    <div style={{ fontSize: 13, color: skyTheme.mutedColor, marginBottom: 12 }}>
      🌟 Mood snapshot from Savan's journey
    </div>
    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
      {(() => {
        const moodCounts = {};
        Object.values(journalEntries).forEach(e => {
          if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
        });
        return Object.entries(moodCounts).sort((a,b) => b[1]-a[1]).slice(0, 5).map(([mood, count]) => (
          <div key={mood} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28 }}>{mood}</div>
            <div style={{ fontSize: 12, color: skyTheme.mutedColor, fontWeight: 600 }}>{count}x</div>
          </div>
        ));
      })()}
    </div>
  </div>
)}

      {/* CONTACT */}
      <section id="contact" style={{ 
  padding: "80px 24px",
  background: skyTheme.isNight ? "rgba(255,255,255,0.02)" : "linear-gradient(180deg, #B0E0E6 0%, #E0F6FF 100%)",
  transition: "background 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {sectionTitle(<Icons.mail size={14} color="#a5b4fc" />, "Get In Touch", "LET'S CONNECT")}
                   <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 15, marginBottom: 40, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>I'm always open to discussing QC opportunities, lab management roles, or interesting projects. Feel free to reach out!</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <a href={`mailto:${PROFILE.email}`} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16, transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icons.mail size={22} color="white" /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>Email</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{PROFILE.email}</div>
              </div>
            </a>
            <a href={`tel:${PROFILE.phone.replace(/\s/g, "")}`} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16, transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #06b6d4, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icons.phone size={22} color="white" /></div>
              <div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>Phone</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{PROFILE.phone}</div>
              </div>
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, display: "flex", alignItems: "center", gap: 16, transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #8b5cf6, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icons.linkedin size={22} color="white" /></div>
              <div>
                <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 2 }}>LinkedIn</div>
                <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Connect with me</div>
              </div>
            </a>
          </div>

          <div style={{ marginTop: 32, padding: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, textAlign: "center" }}>
            <p style={{ color: "#94a3b8", margin: "0 0 8px 0", fontSize: 14 }}>📍 Location</p>
            <p style={{ color: "white", margin: 0, fontSize: 16, fontWeight: 600 }}>{PROFILE.location}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
     <footer style={{ 
  padding: "48px 24px",
  borderTop: skyTheme.isNight ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.08)",
  textAlign: "center",
  background: skyTheme.isNight ? "transparent" : "linear-gradient(180deg, #E0F6FF 0%, #FFFFFF 100%)",
  transition: "all 3s ease",
  color: skyTheme.textColor,
}}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Icons.zap size={18} color="white" />
        </div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{PROFILE.name}<span style={{ color: "#818cf8" }}>.</span></div>
        <p style={{ color: "#475569", fontSize: 13, marginTop: 6 }}>Built with React, Three.js & Love</p>
        <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
      </footer>

      {/* MODAL */}
      {modal && (
        <div onClick={() => { setModal(null); resetForm(); }} style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", padding: 16 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "100%", maxWidth: 500, background: "#0f172a", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: "white", fontSize: 20 }}>Add New Item</h3>
              <button onClick={() => { setModal(null); resetForm(); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8" }}><Icons.x size={22} /></button>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Enter title" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Description</label>
                <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Enter description" rows={3} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Tags (comma-separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. React, TypeScript" style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              {(modal === "calisthenicsData" || modal === "pythonData") && (
                <div>
                  <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Progress % (0-100)</label>
                  <input type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, boxSizing: "border-box" }} />
                </div>
              )}
              {(modal === "websitesData" || modal === "pythonData") && (
                <>
                  <div>
                    <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>Live URL (optional)</label>
                    <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>GitHub URL (optional)</label>
                    <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." style={{ width: "100%", padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                </>
              )}
              <button onClick={handleAdd} style={{ marginTop: 8, padding: "12px 20px", background: "linear-gradient(135deg, #6366f1, #06b6d4)", border: "none", borderRadius: 10, color: "white", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>Add Item</button>
            </div>
          </div>
        </div>
      )}
{/* Owner mode indicator */}
{isOwner && (
  <div onClick={logoutOwner} style={{
    position: "fixed",
    bottom: 24,
    left: 24,
    zIndex: 40,
    padding: "8px 14px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    border: "1px solid rgba(16,185,129,0.4)",
    borderRadius: 999,
    color: "white",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    boxShadow: "0 8px 20px rgba(16,185,129,0.3)",
  }}>
    🔒 Owner Mode (click to logout)
  </div>
)}
      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 24, right: 24, zIndex: 40, width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #06b6d4)", border: "none", cursor: "pointer", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(99,102,241,0.4)" }}>
          <Icons.arrowUp size={20} />
        </button>
      )}

      {/* GLOBAL ANIMATIONS */}
      <style>{`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes scrollDown {
    0% { transform: translateY(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .mobile-toggle { display: block !important; }
  }
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: #0f172a; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #6366f1, #06b6d4); border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #818cf8, #38bdf8); }
  * { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
`}</style>
    </div>
  );
}