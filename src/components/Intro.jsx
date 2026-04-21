import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

const FLOATS = [
  { char: '✨', style: { top: '12%',  left: '8%',  fontSize: '1.4rem', animationDelay: '0s',    animationDuration: '6s'  } },
  { char: '🌸', style: { top: '18%',  right: '9%',  fontSize: '1.6rem', animationDelay: '1.2s',  animationDuration: '7s'  } },
  { char: '💕', style: { top: '38%',  left: '5%',  fontSize: '1.2rem', animationDelay: '2.4s',  animationDuration: '5.5s'} },
  { char: '⭐', style: { top: '55%',  right: '6%',  fontSize: '1rem',   animationDelay: '0.8s',  animationDuration: '6.5s'} },
  { char: '🎀', style: { bottom: '26%',left: '10%', fontSize: '1.4rem', animationDelay: '1.8s',  animationDuration: '7.5s'} },
  { char: '✨', style: { bottom: '22%',right: '11%',fontSize: '1.1rem', animationDelay: '3.1s',  animationDuration: '6.2s'} },
  { char: '💗', style: { top: '28%',  left: '18%', fontSize: '0.9rem', animationDelay: '2.0s',  animationDuration: '5.8s'} },
  { char: '🌟', style: { top: '70%',  right: '18%',fontSize: '1.1rem', animationDelay: '1.5s',  animationDuration: '6.8s'} },
];

const Intro = ({ onStart }) => {
  const handleStart = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff8a80', '#ff5252', '#ff4081'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff8a80', '#ff5252', '#ff4081'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    onStart();
  };

  return (
    <div className="intro-page">
      {/* Background layers */}
      <div className="intro-bg-orb intro-bg-orb-1" />
      <div className="intro-bg-orb intro-bg-orb-2" />
      <div className="intro-bg-orb intro-bg-orb-3" />
      <div className="intro-shimmer-line" />

      {/* Floating decorative chars */}
      {FLOATS.map(({ char, style }, i) => (
        <span key={i} className="intro-float" style={style} aria-hidden="true">
          {char}
        </span>
      ))}

      {/* Main content */}
      <motion.div
        className="intro-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Date badge */}
        <motion.div
          className="intro-badge"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          🎂 22 · 04 · 2005
        </motion.div>

        {/* Title */}
        <motion.h1
          className="intro-title"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Happy Birthday
          <span className="intro-title-name">Vân Anh</span>
        </motion.h1>

        {/* Heart divider */}
        <motion.div
          className="intro-divider"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className="intro-divider-line" />
          <Heart size={14} style={{ fill: '#f48fb1', color: '#f48fb1', flexShrink: 0 }} />
          <Heart size={18} style={{ fill: '#e91e8c', color: '#e91e8c', flexShrink: 0 }} />
          <Heart size={14} style={{ fill: '#f48fb1', color: '#f48fb1', flexShrink: 0 }} />
          <span className="intro-divider-line" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="intro-subtitle"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.9 }}
        >
          Anh có một món quà nhỏ dành riêng cho em...
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="intro-btn-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.9 }}
        >
          <div className="intro-btn-ring" />
          <motion.button
            className="intro-btn"
            onClick={handleStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Heart size={18} style={{ fill: 'currentColor', flexShrink: 0 }} />
            Bấm vào đây để mở
            <Heart size={18} style={{ fill: 'currentColor', flexShrink: 0 }} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Intro;
