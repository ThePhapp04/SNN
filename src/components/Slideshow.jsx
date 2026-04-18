import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Surprise from './Surprise';

/* ─────────── DATA ─────────── */

// ✏️ Chỉnh nội dung thư ở đây
const LETTER = {
  greeting: 'Gửi Em Yêu, Nửa Kia Của Anh...',
  paragraphs: [
    'Chúc mừng sinh nhật thiên thần của anh! 🎂',
    'Anh không phải là người quá giỏi diễn đạt, nhưng anh mong em biết rằng mỗi ngày có em bên cạnh đều là ngày hạnh phúc nhất đối với anh.',
    'Tuổi mới, chúc em luôn xinh đẹp, vui vẻ và thành công với những dự định của mình. Dù có khó khăn gì đi nữa, hãy luôn nhớ rằng phía sau em luôn có anh ủng hộ.',
    'Hãy cứ là chính em — một cô gái rạng rỡ và tuyệt vời nhất! ✨',
  ],
  sign: 'Yêu em mãi mãi, Anh ❤️',
};

// ✏️ Thay URL ảnh & caption ở đây
const PHOTOS = [
  {
    src: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 1',
    caption: 'Mỗi khoảnh khắc bên em đều là điều quý giá nhất với anh... 💕',
  },
  {
    src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 2',
    caption: 'Nụ cười của em là điều anh muốn nhìn mãi suốt đời... 😊',
  },
  {
    src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 3',
    caption: 'Cảm ơn em đã là một phần không thể thiếu trong cuộc đời anh 🌸',
  },
  {
    src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 4',
    caption: 'Bên em, anh tìm thấy bình yên và hạnh phúc thực sự... ✨',
  },
  {
    src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 5',
    caption: 'Mỗi ngày trôi qua, anh lại càng yêu em hơn ngày hôm qua 💖',
  },
  {
    src: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=1200',
    label: 'Kỷ Niệm 6',
    caption: 'Chúc em một tuổi mới thật nhiều niềm vui và tình yêu! 🎉',
  },
];

// Slide definitions: duration = ms, null = no auto-advance
const SLIDES = [
  { id: 'letter',   type: 'letter',  duration: 14000 },
  ...PHOTOS.map((p, i) => ({ id: `photo-${i}`, type: 'photo', duration: 6000, ...p })),
  { id: 'surprise', type: 'surprise', duration: null },
];

/* ─────────── LETTER SLIDE ─────────── */
const LetterSlide = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    setCount(1);
    const timers = LETTER.paragraphs.slice(1).map((_, i) =>
      setTimeout(() => setCount(i + 2), (i + 1) * 2600),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const showSign = count > LETTER.paragraphs.length;

  return (
    <motion.div
      className="ss-slide letter-slide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* top gradient so progress bar stays readable */}
      <div className="slide-top-shade" />

      <div className="letter-card glass letter-slide-inner">
        <div className="letter-top-bar" />
        <h2 className="letter-title">{LETTER.greeting}</h2>
        <div className="letter-body">
          {LETTER.paragraphs.slice(0, count).map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {para}
            </motion.p>
          ))}
          {showSign && (
            <motion.p
              className="letter-sign"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {LETTER.sign}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────── PHOTO SLIDE ─────────── */
const PhotoSlide = ({ src, label, caption }) => (
  <motion.div
    className="ss-slide photo-slide"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
  >
    {/* Ken-Burns background */}
    <motion.div
      className="photo-bg"
      style={{ backgroundImage: `url(${src})` }}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 7, ease: 'easeOut' }}
    />

    {/* Dark bottom gradient */}
    <div className="photo-overlay" />

    {/* Text */}
    <div className="photo-text">
      <motion.span
        className="photo-label"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.3 }}
      >
        {label}
      </motion.span>
      <motion.p
        className="photo-caption"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
      >
        {caption}
      </motion.p>
    </div>
  </motion.div>
);

/* ─────────── SLIDESHOW ─────────── */
const Slideshow = () => {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const elapsedRef = useRef(0);

  // Reset elapsed on slide change
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, [current]);

  // RAF-based timer with pause/resume support
  useEffect(() => {
    const slide = SLIDES[current];
    if (!slide.duration || paused) return;

    const offset = elapsedRef.current;
    const startedAt = performance.now() - offset;
    let raf;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const p = Math.min(elapsed / slide.duration, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCurrent(c => (c < SLIDES.length - 1 ? c + 1 : c));
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      // Save how far we got so resume continues from here
      elapsedRef.current = Math.min(performance.now() - startedAt, slide.duration);
    };
  }, [current, paused]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, SLIDES.length - 1)));
  }, []);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  const isFirst = current === 0;

  return (
    <div className="slideshow">

      {/* ── Instagram-style progress segments ── */}
      <div className="ss-progress-track">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            className="ss-segment"
            onClick={() => goTo(i)}
            aria-label={`Trang ${i + 1}`}
          >
            <span
              className="ss-seg-fill"
              style={{
                width:
                  i < current ? '100%'
                  : i === current ? `${progress * 100}%`
                  : '0%',
              }}
            />
          </button>
        ))}
      </div>

      {/* ── Slide area ── */}
      <AnimatePresence mode="wait">
        {slide.type === 'letter' && <LetterSlide key="letter" />}

        {slide.type === 'photo' && (
          <PhotoSlide
            key={slide.id}
            src={slide.src}
            label={slide.label}
            caption={slide.caption}
          />
        )}

        {slide.type === 'surprise' && (
          <motion.div
            key="surprise"
            className="ss-slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
          >
            <Surprise forceVisible />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls (prev / pause / next) ── */}
      <div className="ss-controls">
        <button
          className="ss-ctrl-btn"
          onClick={goPrev}
          disabled={isFirst}
          aria-label="Trước"
        >
          ‹
        </button>
        <button
          className="ss-ctrl-btn ss-ctrl-pause"
          onClick={() => setPaused(p => !p)}
          aria-label={paused ? 'Phát' : 'Tạm dừng'}
        >
          {paused ? '▶' : '⏸'}
        </button>
        <button
          className="ss-ctrl-btn"
          onClick={goNext}
          disabled={isLast}
          aria-label="Tiếp"
        >
          ›
        </button>
      </div>

      {/* ── Slide counter ── */}
      <div className="ss-counter">
        {current + 1} / {SLIDES.length}
      </div>
    </div>
  );
};

export default Slideshow;
