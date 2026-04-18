import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const HeartSvg = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const COLORS = ['#ff8a80', '#ff4081', '#f48fb1', '#f8bbd0', '#ce93d8'];

const FloatingHearts = () => {
  const hearts = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,     // 2% – 98% width
      size: Math.random() * 18 + 10,    // 10 – 28px
      duration: Math.random() * 12 + 10, // 10 – 22s
      delay: Math.random() * 8,          // stagger starts
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: (Math.random() - 0.5) * 80, // horizontal wander px
    })), []);

  return (
    <div className="hearts-canvas">
      {hearts.map(h => (
        <motion.div
          key={h.id}
          style={{ position: 'absolute', left: `${h.left}%`, bottom: '-48px' }}
          animate={{
            y: [0, -(window.innerHeight + 80)],
            x: [0, h.drift],
            opacity: [0, 0.7, 0.7, 0],
            rotate: [0, 15, -10, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <HeartSvg size={h.size} color={h.color} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingHearts;
