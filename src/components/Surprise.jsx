import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const COLORS = [
  '#f48fb1', '#ff80ab', '#ce93d8', '#ea80fc',
  '#ffeb3b', '#ffe57f', '#ff5722', '#ff6e40',
  '#fff9c4', '#fce4ec', '#f8bbd0', '#e1bee7',
  '#ffffff', '#ffe0b2', '#ffccbc', '#e91e8c',
];

const HEART_COLORS = ['#ff4d8d', '#ff80ab', '#f48fb1', '#ce93d8', '#ff1744'];
const GOLD_COLORS  = ['#ffd700', '#ffec8b', '#ffe57f', '#fff9c4', '#ffab40'];

/* Draw a heart shape at (cx, cy) with given size */
const drawHeart = (ctx, cx, cy, size, color, alpha) => {
  ctx.save();
  ctx.globalAlpha = Math.max(0, alpha);
  ctx.shadowColor = color;
  ctx.shadowBlur  = 12;
  ctx.fillStyle   = color;
  ctx.beginPath();
  const s = size;
  ctx.moveTo(cx, cy + s * 0.3);
  ctx.bezierCurveTo(cx, cy, cx - s, cy, cx - s, cy - s * 0.5);
  ctx.bezierCurveTo(cx - s, cy - s * 1.3, cx, cy - s * 1.3, cx, cy - s * 0.5);
  ctx.bezierCurveTo(cx, cy - s * 1.3, cx + s, cy - s * 1.3, cx + s, cy - s * 0.5);
  ctx.bezierCurveTo(cx + s, cy, cx, cy, cx, cy + s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

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

    /* ── Standard circle particle ── */
    class Particle {
      constructor(x, y, palette = COLORS) {
        this.x = x; this.y = y;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        this.vx       = Math.cos(angle) * speed;
        this.vy       = Math.sin(angle) * speed - 1.5;
        this.alpha    = 1;
        this.radius   = Math.random() * 3 + 1;
        this.gravity  = 0.11;
        this.friction = 0.965;
        this.type     = 'circle';
      }
      update() {
        this.vx *= this.friction;
        this.vy  = this.vy * this.friction + this.gravity;
        this.x  += this.vx;
        this.y  += this.vy;
        this.alpha -= 0.015;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowColor = this.color;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Heart particle ── */
    class HeartParticle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        this.vx    = Math.cos(angle) * speed;
        this.vy    = Math.sin(angle) * speed - 2;
        this.alpha = 1;
        this.size  = Math.random() * 6 + 3;
        this.gravity  = 0.09;
        this.friction = 0.97;
        this.type  = 'heart';
      }
      update() {
        this.vx *= this.friction;
        this.vy  = this.vy * this.friction + this.gravity;
        this.x  += this.vx;
        this.y  += this.vy;
        this.alpha -= 0.013;
      }
      draw() {
        drawHeart(ctx, this.x, this.y, this.size, this.color, this.alpha);
      }
    }

    /* ── Glitter (tiny, fast-fading) ── */
    class Glitter {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.color = GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 4;
        this.vx    = Math.cos(angle) * speed;
        this.vy    = Math.sin(angle) * speed - 3;
        this.alpha = 1;
        this.radius   = Math.random() * 2 + 0.8;
        this.gravity  = 0.14;
        this.friction = 0.94;
        this.type  = 'glitter';
      }
      update() {
        this.vx *= this.friction;
        this.vy  = this.vy * this.friction + this.gravity;
        this.x  += this.vx;
        this.y  += this.vy;
        this.alpha -= 0.022;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowColor = this.color;
        ctx.shadowBlur  = 8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── Rocket (flies up, then explodes) ── */
    class Rocket {
      constructor(x, targetY, explodeType = 'normal') {
        this.x    = x;
        this.y    = canvas.height + 10;
        this.targetY   = targetY;
        this.explodeType = explodeType;
        this.vy   = -Math.abs((canvas.height - targetY) / 28);
        this.vx   = (Math.random() - 0.5) * 1.5;
        this.done = false;
        this.trail = [];
        this.trailMax = 6;
      }
      update(particles) {
        this.trail.push({ x: this.x, y: this.y, alpha: 0.6 });
        if (this.trail.length > this.trailMax) this.trail.shift();
        this.trail.forEach(t => { t.alpha -= 0.06; });

        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.04; // slight deceleration

        if (this.y <= this.targetY) {
          this.done = true;
          const count = this.explodeType === 'heart' ? 30
                      : this.explodeType === 'gold'  ? 35
                      : 45;
          for (let i = 0; i < count; i++) {
            if (this.explodeType === 'heart') {
              particles.push(new HeartParticle(this.x, this.y));
            } else if (this.explodeType === 'gold') {
              particles.push(new Glitter(this.x, this.y));
              if (i < 12) particles.push(new Particle(this.x, this.y, GOLD_COLORS));
            } else {
              particles.push(new Particle(this.x, this.y));
              if (i < 8) particles.push(new Glitter(this.x, this.y));
            }
          }
        }
      }
      draw() {
        this.trail.forEach(t => {
          ctx.save();
          ctx.globalAlpha = Math.max(0, t.alpha);
          ctx.shadowColor = '#ffd700';
          ctx.shadowBlur  = 6;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffe57f';
          ctx.fill();
          ctx.restore();
        });
        if (!this.done) {
          ctx.save();
          ctx.globalAlpha = 0.95;
          ctx.shadowColor = '#ffab40';
          ctx.shadowBlur  = 12;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#fff9c4';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    /* ── Floating petal ── */
    class Petal {
      constructor() {
        this.x     = Math.random() * canvas.width;
        this.y     = canvas.height + 10;
        this.size  = Math.random() * 5 + 3;
        this.vx    = (Math.random() - 0.5) * 1.2;
        this.vy    = -(Math.random() * 1.8 + 0.6);
        this.alpha = Math.random() * 0.5 + 0.4;
        this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
        this.sway  = Math.random() * 0.04;
        this.swayT = Math.random() * Math.PI * 2;
        this.type  = 'petal';
      }
      update() {
        this.swayT += 0.03;
        this.x += this.vx + Math.sin(this.swayT) * this.sway * 20;
        this.y += this.vy;
        this.alpha -= 0.003;
      }
      draw() {
        drawHeart(ctx, this.x, this.y, this.size, this.color, this.alpha);
      }
    }

    let particles = [];
    let rockets    = [];
    let petals     = [];

    const w = () => canvas.width;
    const h = () => canvas.height;

    const launchRocket = (x, targetY, type = 'normal') => {
      rockets.push(new Rocket(x, targetY, type));
    };

    /* Initial salvo of rockets */
    setTimeout(() => launchRocket(w() * 0.18, h() * 0.25, 'normal'), 150);
    setTimeout(() => launchRocket(w() * 0.82, h() * 0.22, 'gold'),   600);
    setTimeout(() => launchRocket(w() * 0.50, h() * 0.18, 'heart'), 1100);
    setTimeout(() => launchRocket(w() * 0.30, h() * 0.30, 'normal'),1700);
    setTimeout(() => launchRocket(w() * 0.70, h() * 0.28, 'heart'), 2300);

    /* Ongoing rocket launches — liên tục, không dừng */
    const types = ['normal', 'heart', 'gold', 'normal', 'heart'];
    let typeIdx = 0;
    const interval = setInterval(() => {
      if (particles.length > 200) return; // throttle để tránh lag
      const type = types[typeIdx % types.length];
      typeIdx++;
      launchRocket(
        Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        Math.random() * canvas.height * 0.5,
        type,
      );
    }, 2200);

    /* Petal spawner */
    const petalInterval = setInterval(() => {
      if (petals.length < 15) petals.push(new Petal());
    }, 500);

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 1, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* rockets */
      rockets = rockets.filter(r => !r.done || r.trail.some(t => t.alpha > 0));
      rockets.forEach(r => { r.update(particles); r.draw(); });

      /* burst particles */
      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => { p.update(); p.draw(); });

      /* petals */
      petals = petals.filter(p => p.alpha > 0 && p.y > -20);
      petals.forEach(p => { p.update(); p.draw(); });

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      clearInterval(interval);
      clearInterval(petalInterval);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [inView]);

  const show = (delay) => ({
    initial: { opacity: 0 },
    animate: inView ? { opacity: 1 } : {},
    transition: { duration: 1.0, delay },
  });

  const popIn = (delay) => ({
    initial: { scale: 0.2, opacity: 0 },
    animate: inView ? { scale: 1, opacity: 1 } : {},
    transition: { type: 'spring', stiffness: 120, damping: 10, delay },
  });

  const slideUp = (delay) => ({
    initial: { y: 55, opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : {},
    transition: { duration: 0.9, ease: 'easeOut', delay },
  });

  return (
    <motion.section
      ref={sectionRef}
      className="surprise-section"
      {...show(0)}
    >
      {/* ── Fireworks canvas ── */}
      <canvas ref={canvasRef} className="fireworks-canvas" />

      {/* ── Starfield overlay ── */}
      <div className="surprise-stars" />

      {/* ── Content overlay ── */}
      <div className="surprise-content">

        {/* Top sparkles */}
        <motion.div className="surprise-top-sparkles" {...show(0.1)}>
          {['💫', '✨', '🌟', '✨', '💫'].map((s, i) => (
            <span key={i} className="top-sparkle-item" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
          ))}
        </motion.div>

        {/* Main title */}
        <motion.div className="surprise-title-wrap" {...popIn(0.2)}>
          <motion.div
            className="surprise-title-hearts"
            animate={inView ? { scale: [1, 1.18, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            💖
          </motion.div>
          <h2 className="surprise-title">Chúc Mừng Sinh Nhật</h2>
          <motion.div
            className="surprise-title-hearts"
            animate={inView ? { scale: [1, 1.18, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          >
            💖
          </motion.div>
        </motion.div>

        {/* Subtitle */}
        <motion.p className="surprise-subtitle" {...slideUp(0.55)}>
          ✦ Tuổi mới thật rực rỡ như chính em ✦
        </motion.p>

        {/* Romantic poem card */}
        <motion.div
          className="surprise-poem-card"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <p className="poem-line">
            Anh chúc em một tuổi mới đong đầy yêu thương,
          </p>
          <p className="poem-line">
            mỗi ngày đều rực rỡ như ánh ban mai 🌅
          </p>
          <p className="poem-line poem-line--accent">
            Em xứng đáng với tất cả những điều tuyệt vời nhất
          </p>
          <p className="poem-line">
            mà cuộc đời này có thể trao tặng 💝
          </p>
        </motion.div>

        {/* 🎂 Cake */}
        <motion.div
          className="cake-container"
          initial={{ y: 100, opacity: 0, scale: 0.4 }}
          animate={inView ? { y: 0, opacity: 1, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 1.4 }}
        >
          {/* Glow ring */}
          <div className="cake-glow-ring" />

          {/* Candles */}
          <div className="cake-candles-row">
            {[0, 0.18, 0.36, 0.12, 0.28].map((d, i) => (
              <motion.span
                key={i}
                className="candle"
                style={{ animationDelay: `${d}s` }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={inView ? { scaleY: 1, opacity: 1 } : {}}
                transition={{ delay: 1.7 + i * 0.12 }}
              >
                🕯️
              </motion.span>
            ))}
          </div>

          {/* Cake body */}
          <motion.div
            className="cake-body"
            animate={inView ? {
              y:      [0, -14, 0],
              rotate: [0, -2, 2, 0],
              filter: [
                'drop-shadow(0 0 28px rgba(244,143,177,0.65)) drop-shadow(0 0 10px rgba(206,147,216,0.5))',
                'drop-shadow(0 0 50px rgba(255,105,180,0.9))  drop-shadow(0 0 20px rgba(206,147,216,0.8))',
                'drop-shadow(0 0 28px rgba(244,143,177,0.65)) drop-shadow(0 0 10px rgba(206,147,216,0.5))',
              ],
            } : {}}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            🎂
          </motion.div>
        </motion.div>

        {/* Love message */}
        <motion.div className="surprise-love-msg" {...slideUp(2.2)}>
          <span className="love-heart">❤️</span>
          <p>Mãi yêu em — hôm nay, ngày mai và mãi mãi</p>
          <span className="love-heart">❤️</span>
        </motion.div>

        {/* Bottom sparkle row */}
        <motion.div className="surprise-sparkles" {...show(2.7)}>
          {['🌹', '💫', '✨', '💖', '🌸', '💫', '✨', '💝', '🌹'].map((s, i) => (
            <span key={i} className="sparkle-item" style={{ animationDelay: `${i * 0.2}s` }}>
              {s}
            </span>
          ))}
        </motion.div>

        {/* Final closing */}
        <motion.p className="surprise-closing" {...show(3.0)}>
          ~ Happy Birthday, em yêu ~
        </motion.p>

      </div>
    </motion.section>
  );
};

export default Surprise;
