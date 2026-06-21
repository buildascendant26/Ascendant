/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';


interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface BoldQuoteProps {
  isLoader?: boolean;
  onEnter?: () => void;
}

export const BoldQuote: React.FC<BoldQuoteProps> = ({ isLoader = false, onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom high-tech interactive decryption scramble state
  const [displayWord, setDisplayWord] = React.useState("world.");
  const scrambleInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Custom high-tech loader states
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [loadStatus, setLoadStatus] = React.useState("INITIALIZING QUANTUM FREQUENCIES");

  useEffect(() => {
    if (!isLoader) return;
    
    let timer: ReturnType<typeof setInterval>;
    let currentProgress = 0;
    
    const statuses = [
      "INITIALIZING SENSORY COUPLING ...",
      "CALIBRATING SOMATIC SPECTRUM [DPS_EAST] ...",
      "DECRYPTING ARCHIVAL CHRONOLOGY ...",
      "STABILIZING VECTOR FIELDS ...",
      "CONCLAVE CALIBRATION COMPLETE"
    ];
    
    timer = setInterval(() => {
      currentProgress += 1.5 + Math.random() * 3.5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        setLoadStatus(statuses[4]);
        setLoadProgress(100);
        clearInterval(timer);
      } else {
        setLoadProgress(currentProgress);
        if (currentProgress < 25) {
          setLoadStatus(statuses[0]);
        } else if (currentProgress < 55) {
          setLoadStatus(statuses[1]);
        } else if (currentProgress < 85) {
          setLoadStatus(statuses[2]);
        } else {
          setLoadStatus(statuses[3]);
        }
      }
    }, 40);
    
    return () => clearInterval(timer);
  }, [isLoader]);

  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    targetX: 0, 
    targetY: 0, 
    hoverActive: false,
    worldHovered: false,
    spinBurstX: 0,
    spinBurstY: 0,
    shockwaveRadius: 0,
    shockwaveActive: false,
    collapseScale: 1.0,
    collapseVelocity: 0,
    collapseTarget: 1.0
  });

  // Track explosion spark particles when world is clicked
  const particlesRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    color: string;
  }[]>([]);
  
  // Track scroll inside the component to create elegant, buttery smooth parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Smooth cinematic transforms for background and foreground layers
  const textY = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 0.98]);

  // High-performance 3D Wireframe Globe animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Support crisp Retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Track mouse and drag state over container for premium tactile control
    const container = containerRef.current;
    
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragX = 0;
    let dragY = 0;
    let targetDragX = 0;
    let targetDragY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Normalize to range [-1, 1] relative to center
      mouseRef.current.targetX = (x / width) * 2 - 1;
      mouseRef.current.targetY = (y / height) * 2 - 1;
      mouseRef.current.hoverActive = true;

      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        targetDragX += deltaX * 0.008;
        targetDragY += deltaY * 0.008;
        startX = e.clientX;
        startY = e.clientY;
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
      mouseRef.current.hoverActive = false;
      isDragging = false;
      if (container) {
        container.style.cursor = 'default';
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevents selection of text during dragging
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      if (container) {
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      if (container) {
        container.style.cursor = 'grab';
      }
    };

    // Responsive Touch Support for Fluid Mobile Dragging
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        mouseRef.current.hoverActive = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!container || e.touches.length !== 1) return;
      const rect = container.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      mouseRef.current.targetX = (x / width) * 2 - 1;
      mouseRef.current.targetY = (y / height) * 2 - 1;

      if (isDragging) {
        const deltaX = e.touches[0].clientX - startX;
        const deltaY = e.touches[0].clientY - startY;
        targetDragX += deltaX * 0.01;
        targetDragY += deltaY * 0.01;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        // Prevent default screen scrolling while dragging the globe
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      mouseRef.current.hoverActive = false;
    };

    if (container) {
      container.style.cursor = 'grab';
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      
      // Touch listeners
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('touchcancel', handleTouchEnd);
    }

    // Generate Globe Wireframe Rings (3D Points)
    const points: Point3D[] = [];
    const latitudeRings = 9;   // Horizontal slices
    const longitudeRings = 12; // Vertical slices
    const radius = Math.min(width, height) * 0.44; // Adaptive sphere size, made significantly larger to fit behind the quote

    // Standard spherical coordinates mapping to 3D space
    for (let i = 1; i < latitudeRings; i++) {
      const theta = (i * Math.PI) / latitudeRings;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j < longitudeRings; j++) {
        const phi = (j * 2 * Math.PI) / longitudeRings;
        points.push({
          x: radius * sinTheta * Math.cos(phi),
          y: radius * cosTheta,
          z: radius * sinTheta * Math.sin(phi),
        });
      }
    }

    // Globe Rotation variables
    let baseAngleX = 0.1;
    let baseAngleY = 0.2;
    const autoRotateX = 0.0008; // Elegantly slow and calm auto-orbit
    const autoRotateY = 0.0012;

    let hoverRadiusFactor = 1.0;
    let colorInterpolation = 0.0; // 0.0 is white, 1.0 is brilliant electric cyan

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Damp mouse & drag interactions for buttery smooth animation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 1;
      
      dragX += (targetDragX - dragX) * 1;
      dragY += (targetDragY - dragY) * 1;

      // Dissipate click-induced spin bursts gracefully over time
      mouseRef.current.spinBurstX += (0 - mouseRef.current.spinBurstX) * 1;
      mouseRef.current.spinBurstY += (0 - mouseRef.current.spinBurstY) * 1;

      // Click shockwave ripple progression
      if (mouseRef.current.shockwaveActive) {
        mouseRef.current.shockwaveRadius += 10;
        if (mouseRef.current.shockwaveRadius > radius * 2.5) {
          mouseRef.current.shockwaveActive = false;
        }
      }

      // Smoothly interpolate hover reactions
      const targetRadiusFactor = mouseRef.current.worldHovered ? 1.08 : 1.0;
      hoverRadiusFactor += (targetRadiusFactor - hoverRadiusFactor) * 1;

      // Apply tactile spring physics collapse-and-rebound equations
      const springK = 0.16;       // Spring tension stiffness
      const springDamp = 0.72;    // Damping resistance
      const springAcc = springK * (mouseRef.current.collapseTarget - mouseRef.current.collapseScale);
      mouseRef.current.collapseVelocity += springAcc;
      mouseRef.current.collapseVelocity *= springDamp;
      mouseRef.current.collapseScale += mouseRef.current.collapseVelocity;

      const finalRadiusFactor = hoverRadiusFactor * mouseRef.current.collapseScale;
      const currentRadius = radius * finalRadiusFactor;

      const targetColorInterp = mouseRef.current.worldHovered ? 1.0 : 0.0;
      colorInterpolation += (targetColorInterp - colorInterpolation) * 1;

      // Create a glowing dynamic interpolated color (interpolate from white to vivid teal-cyan)
      const r = Math.round(255 - colorInterpolation * (255 - 45));
      const g = Math.round(255 - colorInterpolation * (255 - 212));
      const b = Math.round(255 - colorInterpolation * (255 - 191));
      const globeColor = `${r}, ${g}, ${b}`;

      // Extract current scroll position to power dynamic rotation & physics parallax
      const scrollVal = scrollYProgress.get();

      // Increment base orbit orientation over time
      baseAngleX += autoRotateX;
      baseAngleY += autoRotateY;

      // Combined rotation: slow base orbit + touch drag + mouse proximity + scroll tilt + click spin burst
      const currentAngleX = baseAngleX + dragY + mouseRef.current.y * 0.12 + (scrollVal * 0.35) + mouseRef.current.spinBurstY;
      const currentAngleY = baseAngleY + dragX + mouseRef.current.x * 0.12 + (scrollVal * 0.7) + mouseRef.current.spinBurstX;

      // Matrix rotation math using the calculated absolute angle for the frame
      const cosX = Math.cos(currentAngleX);
      const sinX = Math.sin(currentAngleX);
      const cosY = Math.cos(currentAngleY);
      const sinY = Math.sin(currentAngleY);

      // Position the globe beautifully centered directly behind the centerpiece quote
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      
      const distance = currentRadius * 2.2;
      const scale = currentRadius * 1.5;

      // Project and render dots/connections
      const projected: { sx: number; sy: number; sz: number; alpha: number }[] = [];

      points.forEach(p => {
        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Apply interactive displacement warp towards cursor position to express "moving the world"
        if (mouseRef.current.hoverActive) {
          const mouseWorldX = mouseRef.current.x * currentRadius * 1.2;
          const mouseWorldY = mouseRef.current.y * currentRadius * 1.2;
          const dx = x1 - mouseWorldX;
          const dy = y2 - mouseWorldY;
          const distToMouse = Math.sqrt(dx * dx + dy * dy);
          const warpRadius = currentRadius * 1.4;

          if (distToMouse < warpRadius) {
            const pullStrength = (1 - distToMouse / warpRadius) * 0.22;
            x1 += dx * pullStrength;
            y2 += dy * pullStrength;
          }
        }

        // Apply click shockwave warp ripple running outward from center of sphere
        if (mouseRef.current.shockwaveActive) {
          const distFromCenter = Math.sqrt(x1*x1 + y2*y2 + z2*z2);
          const waveRadius = mouseRef.current.shockwaveRadius;
          const waveWidth = 80;
          const distToWave = Math.abs(distFromCenter - waveRadius);
          
          if (distToWave < waveWidth) {
            const progress = 1 - (distToWave / waveWidth);
            // Ripple pull: sine wave expansion
            const force = Math.sin(progress * Math.PI) * 28;
            x1 += (x1 / distFromCenter) * force;
            y2 += (y2 / distFromCenter) * force;
            z2 += (z2 / distFromCenter) * force;
          }
        }

        // 3D to 2D projection
        const depthCoord = z2 + distance;
        const sx = (x1 * scale) / depthCoord + centerX;
        const sy = (y2 * scale) / depthCoord + centerY;
        
        // Calculate depth opacity (holographic look)
        const alpha = Math.max(0.06, (z2 + currentRadius) / (2 * currentRadius));

        projected.push({ sx, sy, sz: z2, alpha });
      });

      // Draw grid lines connecting the projected points
      ctx.lineWidth = 0.8;
      
      projected.forEach((p1, idx) => {
        // Draw elegant connecting lines to adjacent longitude nodes
        const nextLatIdx = idx + 1;
        if (nextLatIdx < projected.length && (idx % longitudeRings !== longitudeRings - 1)) {
          const p2 = projected[nextLatIdx];
          const combinedAlpha = Math.min(p1.alpha, p2.alpha) * 0.22;
          ctx.strokeStyle = `rgba(${globeColor}, ${combinedAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }

        // Connect back-to-front longitude wrap-around loop
        if (idx % longitudeRings === longitudeRings - 1) {
          const p2 = projected[idx - (longitudeRings - 1)];
          const combinedAlpha = Math.min(p1.alpha, p2.alpha) * 0.22;
          ctx.strokeStyle = `rgba(${globeColor}, ${combinedAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }

        // Draw elegant lines connecting latitude slices
        const nextLonIdx = idx + longitudeRings;
        if (nextLonIdx < projected.length) {
          const p2 = projected[nextLonIdx];
          const combinedAlpha = Math.min(p1.alpha, p2.alpha) * 0.18;
          ctx.strokeStyle = `rgba(${globeColor}, ${combinedAlpha})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }

        // Draw pulsing, tiny glowing code vertices
        const pointSize = p1.sz > 0 ? 1.8 + (p1.sz / currentRadius) * 1.5 : 1.2;
        const vertexAlpha = p1.alpha * (p1.sz > 0 ? 0.85 : 0.4);
        ctx.fillStyle = `rgba(${globeColor}, ${vertexAlpha})`;
        ctx.beginPath();
        ctx.arc(p1.sx, p1.sy, pointSize, 0, Math.PI * 2);
        ctx.fill();

        // Extra subtle starburst core on front-facing nodes
        if (p1.sz > currentRadius * 0.5 && idx % 3 === 0) {
          const glowColor = mouseRef.current.worldHovered ? 'rgba(0, 245, 255, 0.45)' : 'rgba(255, 255, 255, 0.45)';
          const glowShadowColor = mouseRef.current.worldHovered ? '#00f5ff' : '#ffffff';
          ctx.fillStyle = glowColor;
          ctx.shadowBlur = 8;
          ctx.shadowColor = glowShadowColor;
          ctx.beginPath();
          ctx.arc(p1.sx, p1.sy, pointSize * 1.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // Restore default
        }
      });

      // Update & render explosion spark particles
      const sparks = particlesRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94; // Atmospheric resistance
        p.vy *= 0.94;
        p.alpha -= 0.018; // Fade out rate
        if (p.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        
        ctx.shadowBlur = 12 * p.alpha;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + p.alpha * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, []);

  const triggerScramble = () => {
    if (scrambleInterval.current) clearInterval(scrambleInterval.current);
    const target = "world.";
    const glyphs = "$%#@&01?!*xzΔΩΞ⊞⊠⏚";
    let iterations = 0;
    
    scrambleInterval.current = setInterval(() => {
      setDisplayWord(
        target
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return target[index];
            }
            if (index === iterations && Math.random() < 0.35) {
              return target[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("")
      );
      
      iterations += 0.25;
      if (iterations >= target.length) {
        setDisplayWord(target);
        if (scrambleInterval.current) clearInterval(scrambleInterval.current);
      }
    }, 40);
  };

  useEffect(() => {
    return () => {
      if (scrambleInterval.current) clearInterval(scrambleInterval.current);
    };
  }, []);

  const handleWorldClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Intense trigger scramble sequence
    triggerScramble();

    // Spin the globe fast!
    mouseRef.current.spinBurstX = 6.8; // Full horizontal rotation torque burst
    mouseRef.current.spinBurstY = 2.6; // Vertical rotation torque burst
    
    // Fire shockwave at center
    mouseRef.current.shockwaveRadius = 0;
    mouseRef.current.shockwaveActive = true;

    // Trigger instant gravity collapse and rebound spring singularity
    mouseRef.current.collapseScale = 0.05;
    mouseRef.current.collapseTarget = 1.0;

    // Push explosion sparks
    const canvas = canvasRef.current;
    if (canvas) {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      
      // Spawn 80 cybernetic sparks
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 14;
        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: 1 + Math.random() * 3,
          color: Math.random() > 0.5 ? '#00f5ff' : '#00ff88' // Solid neon cyan & solid neon green/emerald
        });
      }
    }
  };

  const handleWorldHoverStart = () => {
    mouseRef.current.worldHovered = true;
    triggerScramble();
  };

  const handleWorldHoverEnd = () => {
    mouseRef.current.worldHovered = false;
  };

  return (
    <section 
      id={isLoader ? "summit-loader" : "summit-quote"}
      ref={containerRef}
      className={isLoader 
        ? "fixed inset-0 w-screen h-screen z-[100] flex flex-col justify-center px-6 sm:px-12 md:px-24 lg:px-32 bg-black overflow-hidden select-none"
        : "min-h-screen py-24 md:py-36 px-6 sm:px-12 md:px-24 lg:px-32 w-full flex flex-col justify-center relative border-b border-neutral-900 bg-black overflow-hidden select-none"
      }
    >
      {/* Background Interactive 3D Wireframe World/Globe */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      />

      {/* Background Grid Accent with subtle scaling */}
      <motion.div 
        style={!isLoader ? { scale: bgScale } : undefined}
        className="absolute inset-0 bg-[linear-gradient(to_right,#090909_1px,transparent_1px),linear-gradient(to_bottom,#090909_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70 pointer-events-none z-0" 
      />

      {/* Subtle Glowing Aura */}
      <div className="absolute top-[40%] left-[10%] w-[35vw] h-[35vw] bg-white/[0.012] blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] bg-neutral-800/[0.02] blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col justify-between min-h-[50vh] md:min-h-[60vh]">
        
        {/* Beautiful, Solidly-Sized Giant Centerpiece Bold Statement with high-end staggered blur-glow animation */}
        <div className="my-auto py-6">
          {/* Section Index Marker - Placed directly above the quote */}
          <div className="space-y-3 mb-6 md:mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-neutral-400 font-bold uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              {isLoader ? "00 / SENSORY CALIBRATION" : "03 / CONCLAVE ESSENCE"}
            </motion.div>
            <div className="w-12 h-1 bg-white rounded-full" />
          </div>

          <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
            {[
              { id: 0, prefix: "We do not build" },
              { id: 1, prefix: "to fit the ", highlight: "world." },
              { id: 2, prefix: "We build to move it." }
            ].map((item, index) => (
              <div key={index} className="overflow-visible py-1">
                <motion.h2
                  initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.18,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter uppercase leading-[0.85] sm:leading-[0.82] select-none selection:bg-neutral-900 selection:text-white ${
                    index === 2 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]' 
                      : 'text-white'
                  }`}
                >
                  {item.prefix}
                  {item.highlight && (
                    <span
                      onClick={handleWorldClick}
                      onMouseEnter={handleWorldHoverStart}
                      onMouseLeave={handleWorldHoverEnd}
                      className="cursor-pointer font-black text-teal-600 hover:text-teal-400 transition-all duration-300 select-none hover:scale-105 inline-block origin-left hover:drop-shadow-[0_0_20px_rgba(13,148,136,0.55)] active:scale-95 duration-200 relative group"
                    >
                      {displayWord}
                      <span className="absolute bottom-1 sm:bottom-1.5 left-0 w-full h-[3.5px] sm:h-[4px] bg-teal-600 group-hover:bg-teal-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </span>
                  )}
                </motion.h2>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic section footer: Loading bar if loader, standard Conclave footer if static section */}
        {isLoader ? (
          <div className="mt-8 flex flex-col items-stretch sm:items-start gap-4">
            {loadProgress < 100 ? (
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between font-mono text-[10px] text-neutral-400">
                  <span className="uppercase tracking-wider">{loadStatus}</span>
                  <span>{Math.round(loadProgress)}%</span>
                </div>
                <div className="w-full h-[3px] bg-neutral-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 justify-between w-full"
              >
                <button
                  onClick={onEnter}
                  className="relative px-8 py-3.5 bg-neutral-950 border border-teal-500/30 hover:border-teal-400 rounded-lg font-mono text-[11px] tracking-[0.25em] text-teal-400 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(13,148,136,0.15)] hover:shadow-[0_0_35px_rgba(13,148,136,0.3)] active:scale-95 cursor-pointer uppercase flex items-center justify-center sm:justify-start gap-3"
                >
                  <span>ENTER CONCLAVE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                </button>
                <div className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SENSORY COUPLING STEADY • TAP "WORLD" TRIGGER FOR SHOCKWAVE</span>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 md:mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 font-mono text-[10px] md:text-xs text-neutral-500"
          >
            <p className="italic tracking-wide leading-relaxed">
              "Your mind is like this water… if you allow it to settle, the answer becomes clear."
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
};

