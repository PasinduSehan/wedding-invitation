import React, { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  z: number;
  r: number; // radius or scale
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  opacity: number;
}

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];
    const maxPetals = 45;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Mouse Tracking for wind effect
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, radius: 150 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize Petals
    const createPetal = (isInitial = false): Petal => {
      return {
        x: Math.random() * canvas.width,
        y: isInitial ? Math.random() * canvas.height : -20,
        z: Math.random() * 200 + 50, // Depth
        r: Math.random() * 8 + 6,     // Size
        rotationX: Math.random() * Math.PI,
        rotationY: Math.random() * Math.PI,
        rotationZ: Math.random() * Math.PI,
        speedX: Math.random() * 1.5 - 0.5 + 0.5, // Drift right
        speedY: Math.random() * 0.8 + 0.6,      // Drift down
        speedZ: Math.random() * 0.4 - 0.2,
        rotSpeedX: Math.random() * 0.02 + 0.01,
        rotSpeedY: Math.random() * 0.02 + 0.01,
        rotSpeedZ: Math.random() * 0.01 + 0.005,
        opacity: Math.random() * 0.4 + 0.4,
      };
    };

    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(true));
    }

    // Drawing a luxury golden organic petal
    const drawPetal = (ctx: CanvasRenderingContext2D, petal: Petal, scale: number, px: number, py: number) => {
      ctx.save();
      ctx.translate(px, py);
      
      // Apply 3D rotation approximation
      ctx.rotate(petal.rotationZ);
      ctx.scale(Math.sin(petal.rotationY) * scale, Math.cos(petal.rotationX) * scale);

      // Create Luxury Golden Gradient
      const gradient = ctx.createLinearGradient(-petal.r, -petal.r, petal.r, petal.r);
      // Gold tones: Brass, Champagne gold, Warm amber gold
      gradient.addColorStop(0, "rgba(212, 175, 55, " + petal.opacity + ")");
      gradient.addColorStop(0.3, "rgba(243, 229, 171, " + (petal.opacity * 1.1) + ")");
      gradient.addColorStop(0.7, "rgba(197, 160, 89, " + petal.opacity + ")");
      gradient.addColorStop(1, "rgba(166, 124, 54, " + (petal.opacity * 0.8) + ")");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      // Draw a highly elegant rose/sakura curved petal shape
      ctx.moveTo(0, -petal.r);
      ctx.bezierCurveTo(petal.r * 1.2, -petal.r * 1.2, petal.r * 1.5, petal.r * 0.2, 0, petal.r * 1.2);
      ctx.bezierCurveTo(-petal.r * 1.5, petal.r * 0.2, -petal.r * 1.2, -petal.r * 1.2, 0, -petal.r);
      
      ctx.closePath();
      ctx.fill();

      // Add elegant highlight on petal edge
      ctx.strokeStyle = "rgba(255, 255, 255, " + (petal.opacity * 0.3) + ")";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    };

    // Main loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      petals.forEach((p, index) => {
        // Drifting motion
        p.x += p.speedX;
        p.y += p.speedY;
        p.z += p.speedZ;

        // Apply mouse force (wind swirl)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 4;
          p.y += (dy / dist) * force * 2;
        }

        // Apply rotation
        p.rotationX += p.rotSpeedX;
        p.rotationY += p.rotSpeedY;
        p.rotationZ += p.rotSpeedZ;

        // 3D Projection math
        // Focal length
        const fl = 200;
        const scale = fl / (fl + p.z);
        const px = p.x;
        const py = p.y;

        // Draw if within viewport
        if (px >= -50 && px <= canvas.width + 50 && py >= -50 && py <= canvas.height + 50) {
          // Adjust blur depth effect
          const blur = Math.max(0, (p.z - 100) / 15);
          if (blur > 1) {
            ctx.filter = `blur(${blur.toFixed(1)}px)`;
          } else {
            ctx.filter = "none";
          }
          drawPetal(ctx, p, scale, px, py);
        } else if (p.y > canvas.height + 30 || p.x > canvas.width + 30 || p.x < -30) {
          // Recycle petal to the top
          petals[index] = createPetal(false);
        }
      });

      // Clear filter
      ctx.filter = "none";

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      id="floating-petals-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
