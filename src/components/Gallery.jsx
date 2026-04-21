import React from 'react';
import { motion } from 'framer-motion';

// ✏️ THAY ĐƯỜNG DẪN ẢNH CỦA BẠN VÀO ĐÂY
// Bỏ ảnh vào thư mục /public rồi đặt đường dẫn là "/ten-anh.jpg"
// Hoặc dán thẳng URL ảnh online
const images = [
  'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800',
];

const Gallery = () => {
  return (
    <motion.div
      className="gallery-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
    >
      <h3 className="gallery-title">Những Phút Giây Kỷ Niệm 📸</h3>

      <div className="gallery-grid">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="gallery-item"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <img src={src}  loading="lazy" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Gallery;
