import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const COLORS = [
  '#f48fb1', '#ce93d8', '#ffeb3b', '#ff5722',
  '#4caf50', '#2196f3', '#e91e8c', '#ff9800',
  '#ffffff', '#ffe0b2', '#e1bee7',
];

const Surprise = ({ forceVisible = false }) => {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const inView     = useInView(sectionRef, { once: true, margin: '-80px' }) || forceVisible;

  /* ── Fireworks engine ── */
  useEffect(() => {
    if (!inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        this.vx       = Math.cos(angle) * speed;
        this.vy       = Math.sin(angle) * speed - 1;
        this.alpha    = 1;
        this.radius   = Math.random() * 4 + 1.5;
        this.gravity  = 0.1;
        this.friction = 0.96;
      }
      update() {
        this.vx  *= this.friction;
        this.vy   = this.vy * this.friction + this.gravity;
        this.x   += this.vx;
        this.y   += this.vy;
        this.alpha -= 0.012;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha  = Math.max(0, this.alpha);
        ctx.shadowColor  = this.color;
        ctx.shadowBlur   = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    let particles = [];

    const burst = (x, y, count = 90) => {
      for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
    };

    /* initial salvo */
    const w = () => canvas.width;
    const h = () => canvas.height;
    setTimeout(() => burst(w() * 0.18, h() * 0.28), 80);
    setTimeout(() => burst(w() * 0.82, h() * 0.22), 320);
    setTimeout(() => burst(w() * 0.50, h() * 0.18), 580);
    setTimeout(() => burst(w() * 0.30, h() * 0.40), 880);
    setTimeout(() => burst(w() * 0.70, h() * 0.35), 1100);

    /* ongoing bursts */
    const interval = setInterval(() => {
      burst(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.65,
      );
    }, 650);

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 2, 22, 0.17)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(); });
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    /* stop spawning after 10 s; keep rendering until last particle fades */
    const stopSpawn = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopSpawn);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [inView]);

  const show = (delay) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : {},
    transition: { duration: 0.9, delay },
  });

  const popIn = (delay) => ({
    initial: { scale: 0.3, opacity: 0 },
    animate: inView ? { scale: 1, opacity: 1 } : {},
    transition: { type: 'spring', stiffness: 140, damping: 13, delay },
  });

  const slideUp = (delay) => ({
    initial: { y: 60, opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : {},
    transition: { duration: 0.85, delay },
  });

  return (
    <motion.section
      ref={sectionRef}
      className="surprise-section"
      {...show(0)}
    >
      {/* ── Fireworks canvas ── */}
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {/* ── Content overlay ── */}
      <div className="surprise-content">

        {/* 🎆 Big wish */}
        <motion.h2 className="surprise-title" {...popIn(0.25)}>
          🎆 Chúc Mừng Sinh Nhật! 🎆
        </motion.h2>

        <motion.p className="surprise-wish" {...slideUp(0.75)}>
          Chúc em một tuổi mới tràn đầy hạnh phúc,<br />
          luôn xinh đẹp, rạng rỡ và được yêu thương! 💖
        </motion.p>

        {/* 🎂 Cake */}
        <motion.div
          className="cake-container"
          initial={{ y: 120, opacity: 0, scale: 0.5 }}
          animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 110, damping: 14, delay: 1.2 }}
        >
          {/* Candles */}
          <div className="cake-candles-row">
            {[0, 0.18, 0.36, 0.12, 0.28].map((d, i) => (
              <motion.span
                key={i}
                className="candle"
                style={{ animationDelay: `${d}s` }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                🕯️
              </motion.span>
            ))}
          </div>

          {/* Cake body */}
          <motion.div
            className="cake-body"
            animate={inView ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            🎂
          </motion.div>
        </motion.div>

        {/* Bottom message */}
        <motion.p className="surprise-bottom-text" {...show(2.2)}>
          Em xứng đáng với tất cả những điều tốt đẹp nhất! ✨
        </motion.p>

        {/* Sparkle row */}
        <motion.div className="surprise-sparkles" {...show(2.6)}>
          {['🌟', '💫', '✨', '💖', '✨', '💫', '🌟'].map((s, i) => (
            <span key={i} className="sparkle-item" style={{ animationDelay: `${i * 0.25}s` }}>
              {s}
            </span>
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
};

export default Surprise;
