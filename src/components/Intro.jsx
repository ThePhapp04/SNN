import React from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

const Intro = ({ onStart }) => {
  const handleStart = () => {
    // Pháo hoa gam màu hồng từ hai bên
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
      {/* Decorative blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <motion.h1
          className="intro-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          Happy Birthday,<br />My Love ❤️
        </motion.h1>

        <motion.p
          className="intro-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          Anh có một món quà nhỏ dành cho em...
        </motion.p>

        <motion.button
          className="intro-btn"
          onClick={handleStart}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <Heart size={20} style={{ fill: 'currentColor', flexShrink: 0 }} />
          Bấm vào đây để mở
          <Heart size={20} style={{ fill: 'currentColor', flexShrink: 0 }} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Intro;
