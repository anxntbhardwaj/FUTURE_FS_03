import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  color: string;
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 30 : 70; // Optimized

    // Initialize particles matching our gold/burgundy accent sparks
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    function createParticle(): Particle {
      const isGold = Math.random() > 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (isGold ? 2.5 : 1.5) + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.2) * 0.3 - 0.05, // Drifts slightly upwards
        alpha: Math.random() * 0.4 + 0.1,
        color: isGold ? 'rgba(197, 160, 89, ' : 'rgba(124, 28, 28, ', // Gold or deep burgundy sparkles
      };
    }

    // Handle mouse movement for subtle interaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Precalculate mountain ridges for high-fidelity classic expedition map look
    interface RidgePoint {
      x: number;
      y: number;
    }
    const generateRidge = (peakCount: number, baseHeight: number, variance: number): RidgePoint[] => {
      const points: RidgePoint[] = [];
      const step = width / (peakCount - 1);
      for (let i = 0; i < peakCount; i++) {
        points.push({
          x: i * step,
          y: baseHeight + (Math.sin(i * 1.5) + Math.cos(i * 0.8) * 0.5) * variance + (Math.random() - 0.5) * 10
        });
      }
      return points;
    };

    // We make 3 layered ridges
    let ridges = [
      generateRidge(12, height * 0.82, 35),
      generateRidge(10, height * 0.87, 25),
      generateRidge(8, height * 0.92, 15)
    ];

    function drawRidge(points: RidgePoint[], strokeStyle: string, fillStyle: string) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      // Draw premium warm off-white linear gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#fdfbf7'); // Off-white cream
      grad.addColorStop(0.5, '#FAF6EE'); // Standard brand cream
      grad.addColorStop(1, '#f5eedf'); // Warm rich sand-paper background
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Refresh ridges on dimension changes
      if (ridges[0].length > 0 && ridges[0][ridges[0].length - 1].x !== width) {
        ridges = [
          generateRidge(12, height * 0.72, 40),
          generateRidge(10, height * 0.80, 30),
          generateRidge(8, height * 0.88, 20)
        ];
      }

      // Draw light Himalayan silhouettes at the bottom in raw, beautiful transparent copper/burgundy lines
      // Layer 1 (Distant peaks)
      drawRidge(ridges[0], 'rgba(124, 28, 28, 0.04)', 'rgba(250, 246, 238, 0.15)');
      // Layer 2 (Middle peaks)
      drawRidge(ridges[1], 'rgba(124, 28, 28, 0.03)', 'rgba(250, 246, 238, 0.25)');
      // Layer 3 (Closest range)
      drawRidge(ridges[2], 'rgba(197, 160, 89, 0.05)', 'rgba(245, 238, 223, 0.35)');

      // Gilded Compass Rose or Mountain Badge glowing in the bottom-right corner center
      const badgeX = width * 0.85;
      const badgeY = height * 0.85;
      if (width > 640) {
        ctx.strokeStyle = 'rgba(124, 28, 28, 0.035)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 60, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(197, 160, 89, 0.03)';
        ctx.beginPath();
        ctx.arc(badgeX, badgeY, 50, 0, Math.PI * 2);
        ctx.stroke();

        // Plus markings for geographic grid lines
        ctx.strokeStyle = 'rgba(124, 28, 28, 0.015)';
        ctx.beginPath();
        ctx.moveTo(badgeX - 80, badgeY);
        ctx.lineTo(badgeX + 80, badgeY);
        ctx.moveTo(badgeX, badgeY - 80);
        ctx.lineTo(badgeX, badgeY + 80);
        ctx.stroke();
      }

      // Render & Update cozy amber or deep rose particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Interaction with mouse pointer
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Boundary wrap
        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-50 w-full h-full pointer-events-none"
    />
  );
}
