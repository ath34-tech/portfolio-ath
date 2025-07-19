import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const symbols = [
  "</>", "Σ", "★", "{}", "λ", "π", "⊕", "D", "≡"
];

function BubbleSign({ symbol, orbitRadius, center, speed, size, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = speed * t + phase;
    const x = center[0] + Math.cos(angle) * orbitRadius;
    const y = center[1] + Math.sin(angle) * orbitRadius * 0.7;
    if (ref.current) {
      ref.current.position.x = x;
      ref.current.position.y = y;
    }
  });
  return (
    <group ref={ref} position={center}>
      <Html center style={{
        color: "#2ecc40",
        opacity: 0.30,
        fontSize: `${size}rem`,
        fontWeight: 800,
        fontFamily: "'Fredoka','Bangers','monospace',cursive",
        textShadow: "0 0 35px #2ecc4070",
        pointerEvents: "none",
        userSelect: "none"
      }}>
        {symbol}
      </Html>
    </group>
  );
}

export default function FloatingSignsBackground() {
  const bubbles = [];
const numBubbles = 300; // or higher for huge screens
for (let i = 0; i < numBubbles; i++) {
  const symbol = symbols[i % symbols.length];
  const orbitRadius = 14.5 + Math.random() * 13;
  const size = 0.9 + Math.random() * 1.4;
  const speed = 0.10 + Math.random() * 0.3;
  const center = [
    -20 + Math.random() * 40, // Horizontal spread
    -20 + Math.random() * 60, // Vertical spread
    -5
  ];
  const phase = Math.random() * Math.PI * 2;
  bubbles.push(
    <BubbleSign
      key={i}
      symbol={symbol}
      orbitRadius={orbitRadius}
      center={center}
      speed={speed}
      size={size}
      phase={phase}
    />
  );
}
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -100,
        pointerEvents: "none",
        overflow: "hidden"
      }}
    >
      <Canvas
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vw", height: "100vh",
          pointerEvents: "none",
          background: "transparent"
        }}
        camera={{ position: [0, 0, 20], fov: 60 }}
      >
        {bubbles}
      </Canvas>
    </div>
  );
}
