"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
export const WovenLightHero = () => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    // Add font dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 1.5,
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
        opacity: 1,
        transition: { delay: 2.5, duration: 1 }
    });

    return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
    };
  }, [textControls, buttonControls]);

  const headline = "Woven by Light";
  
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-black dark:bg-white">
      <WovenCanvas />
      <HeroNav />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-8xl text-white dark:text-slate-900" style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 50px rgba(255, 255, 255, 0.3)' }}>
            {headline.split(" ").map((word, i) => (
                <span key={i} className="inline-block">
                    {word.split("").map((char, j) => (
                        <motion.span key={j} custom={i * 5 + j} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
                            {char}
                        </motion.span>
                    ))}
                    {i < headline.split(" ").length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </h1>
        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-xl text-lg text-slate-300 dark:text-slate-600"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          An interactive tapestry of light and motion, crafted with code and creativity.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={buttonControls} className="mt-10">
          <button className="rounded-full border-2 border-white/20 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 dark:border-slate-800/20 dark:bg-slate-800/5 dark:text-slate-800 dark:hover:bg-slate-800/10" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore the Weave
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// --- Navigation Component ---
const HeroNav = () => {
    return (
        <motion.nav 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
            className="absolute top-0 left-0 right-0 z-20 p-6"
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white dark:text-slate-800">⎎</span>
                    <span className="text-xl font-bold text-white dark:text-slate-800" style={{ fontFamily: "'Inter', sans-serif" }}>Woven</span>
                </div>
            </div>
        </motion.nav>
    );
};

// --- Full Screen Interactive Vibrant Three.js Canvas Component ---
export const WovenCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // --- Dynamic High-Density Particle Torus Geometry ---
    const particleCount = 55000;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const torusKnot = new THREE.TorusKnotGeometry(1.7, 0.6, 240, 40);

    for (let i = 0; i < particleCount; i++) {
        const vertexIndex = i % torusKnot.attributes.position.count;
        const x = torusKnot.attributes.position.getX(vertexIndex);
        const y = torusKnot.attributes.position.getY(vertexIndex);
        const z = torusKnot.attributes.position.getZ(vertexIndex);
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        originalPositions[i * 3] = x;
        originalPositions[i * 3 + 1] = y;
        originalPositions[i * 3 + 2] = z;

        const color = new THREE.Color();
        // Vibrant Orange Palette: Ember Orange (#C03F13), Terracotta, Burnt Amber & Gold-Orange
        const r = Math.random();
        if (r > 0.55) {
          // Bright Ember Orange
          color.setHSL(0.04 + Math.random() * 0.03, 0.96, 0.46 + Math.random() * 0.16);
        } else if (r > 0.2) {
          // Rich Terracotta Orange
          color.setHSL(0.03 + Math.random() * 0.03, 0.92, 0.40 + Math.random() * 0.14);
        } else {
          // Glowing Golden Amber Orange
          color.setHSL(0.07 + Math.random() * 0.04, 0.96, 0.50 + Math.random() * 0.16);
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        velocities[i * 3] = 0;
        velocities[i * 3 + 1] = 0;
        velocities[i * 3 + 2] = 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.036,
        vertexColors: true,
        blending: THREE.NormalBlending,
        transparent: true,
        opacity: 0.92,
    });

    const points = new THREE.Points(geometry, material);
    // Shift 3D particle spiral to the far right half of the screen
    points.position.x = 2.2;
    scene.add(points);

    // Track mouse dynamically across whole window
    const handleMouseMove = (event) => {
        targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Track scroll offset dynamically for 3D knot rotation & morphing
    let currentScrollY = 0;
    const handleScroll = () => {
        currentScrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let animationFrameId;
    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse interpolation
        mouse.x += (targetMouse.x - mouse.x) * 0.06;
        mouse.y += (targetMouse.y - mouse.y) * 0.06;

        // Dynamic 3D mouse vector
        const mouseWorld = new THREE.Vector3(mouse.x * 4.5, mouse.y * 4.5, 0);

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            const currentPos = new THREE.Vector3(positions[ix], positions[iy], positions[iz]);
            const originalPos = new THREE.Vector3(originalPositions[ix], originalPositions[iy], originalPositions[iz]);
            const velocity = new THREE.Vector3(velocities[ix], velocities[iy], velocities[iz]);

            // Organic continuous wave motion
            const waveX = Math.sin(elapsedTime * 1.5 + originalPos.y * 2.5) * 0.004;
            const waveY = Math.cos(elapsedTime * 1.8 + originalPos.x * 2.5) * 0.004;
            const waveZ = Math.sin(elapsedTime * 1.2 + originalPos.z * 2.0) * 0.0045;
            velocity.x += waveX;
            velocity.y += waveY;
            velocity.z += waveZ;

            // Interactive mouse repulsion force field
            const dist = currentPos.distanceTo(mouseWorld);
            if (dist < 2.6) {
                const force = (2.6 - dist) * 0.032;
                const direction = new THREE.Vector3().subVectors(currentPos, mouseWorld).normalize();
                velocity.add(direction.multiplyScalar(force));
            }

            // Return force back to original knot shape
            const returnForce = new THREE.Vector3().subVectors(originalPos, currentPos).multiplyScalar(0.0025);
            velocity.add(returnForce);
            
            // Damping for fluid movement
            velocity.multiplyScalar(0.93);

            positions[ix] += velocity.x;
            positions[iy] += velocity.y;
            positions[iz] += velocity.z;
            
            velocities[ix] = velocity.x;
            velocities[iy] = velocity.y;
            velocities[iz] = velocity.z;
        }
        geometry.attributes.position.needsUpdate = true;

        // Dynamic 3D rotation & floating tilt driven by time and scroll depth
        const scrollRotation = currentScrollY * 0.0018;
        points.rotation.y = elapsedTime * 0.09 + scrollRotation;
        points.rotation.x = Math.sin(elapsedTime * 0.05) * 0.2 + (currentScrollY * 0.0005);
        points.rotation.z = Math.cos(elapsedTime * 0.04) * 0.15;

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        const width = mountRef.current.clientWidth || window.innerWidth;
        const height = mountRef.current.clientHeight || window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('scroll', handleScroll);
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="woven-canvas-hero-scoped" 
      style={{ 
        position: 'absolute', 
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0, 
        pointerEvents: 'none', 
        opacity: 0.8,
        overflow: 'hidden'
      }} 
    />
  );
};
