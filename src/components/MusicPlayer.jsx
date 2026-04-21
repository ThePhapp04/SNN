import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { motion } from 'framer-motion';

// ✏️ THAY ĐƯỜNG DẪN NHẠC Ở ĐÂY
// Bỏ file .mp3 vào thư mục /public rồi đổi thành "/ten-bai-hat.mp3"
const MUSIC_URL = '/nhac.mp3';

const MusicPlayer = ({ autoPlay = true }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <motion.div
      className="music-player"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.7, type: 'spring' }}
    >
      <Music
        className={`music-icon${isPlaying ? ' spinning' : ''}`}
        size={18}
      />
      <button
        className="music-toggle-btn"
        onClick={() => setIsPlaying(p => !p)}
        aria-label={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
      >
        {isPlaying
          ? <Pause size={18} />
          : <Play size={18} style={{ paddingLeft: '2px' }} />
        }
      </button>

      <audio ref={audioRef} src={MUSIC_URL} loop />
    </motion.div>
  );
};

export default MusicPlayer;
