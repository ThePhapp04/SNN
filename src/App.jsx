import React, { useState } from 'react';
import Intro from './components/Intro';
import Slideshow from './components/Slideshow';
import FloatingHearts from './components/FloatingHearts';
import MusicPlayer from './components/MusicPlayer';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="intro"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          >
            <Intro onStart={() => setStarted(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0 }}
          >
            {/* Floating hearts (behind slideshow) */}
            <FloatingHearts />

            {/* Music player (above slideshow) */}
            <MusicPlayer autoPlay={true} />

            {/* Full-screen slideshow */}
            <Slideshow />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
