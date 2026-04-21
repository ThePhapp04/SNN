import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Surprise from './Surprise';

/* ─────────── DATA ─────────── */

// ✏️ Chỉnh nội dung thư ở đây
const LETTER = {
  greeting: 'Chúc Mừng Sinh Nhật Vanhhhh! 🎂',
  paragraphs: [
    'Hôm nay là ngày đặc biệt nhất của năm — ngày em chào đời, ngày mà anh biết ơn vì em đã xuất hiện trong cuộc đời này và đi vào cuộc đời anh.',
    'Một tuổi mới, một trang mới. Anh chúc em năm nay sẽ chạm được những điều em hằng mơ ước — công việc thuận lợi, sức khỏe dồi dào, và trái tim luôn nhẹ nhàng, bình yên. Em xứng đáng được nhận tất cả những điều tốt đẹp nhất mà cuộc đời có thể trao.',
    'Và dù năm mới có mang đến bao nhiêu thử thách, em đừng bao giờ quên rằng phía sau em luôn có anh — không phải để gánh thay, mà để cùng em bước qua từng bước một.',
    'Sinh nhật vui, em yêu. Cảm ơn em vì đã sinh ra, vì đã là em — và vì đã để anh được iu em. ✨',
  ],
  sign: 'Mãi yêu em, hôm nay và tất cả những ngày sinh nhật còn lại. Anh ❤️',
};

// ✏️ Thay URL ảnh & caption ở đây
// Cách dùng ảnh local: bỏ file vào /public/photos/ rồi đặt src: '/photos/anh1.jpg'sa
// Cách dùng link online: dán thẳng URL ảnh vào src
const PHOTOS = [
  {
    src: '/photos/anh1.jpg',
    caption: 'Chúc mừng sinh nhật Vân Anh — hôm nay là ngày của riêng em, hãy để anh dành trọn ngày này cho em! 🎂',
  },
  {
    src: '/photos/anh2.jpg',
    caption: 'Nụ cười rạng rỡ đó — sinh nhật nào anh cũng mong được nhìn thấy, mãi mãi về sau 😊',
  },
  {
    src: '/photos/anh3.jpg',
    caption: 'Chúc em tuổi mới bình an, khỏe mạnh, và luôn được yêu thương xứng đáng như em mong muốn 🌸',
  },
  {
    src: '/photos/anh4.jpg',
    caption: 'Một tuổi mới bắt đầu — chúc em đạt được tất cả những gì em đang hướng đến, anh tin em làm được! ✨',
  },
  {
    src: '/photos/anh5.jpg',
    caption: 'Sinh nhật vui em ơi! Chúc em năm nay nhiều niềm vui, ít muộn phiền, và thật nhiều kỷ niệm đẹp 💖',
  },
  {
    src: '/photos/anh6.jpg',
    caption: 'Cảm ơn em vì đã sinh ra — và cảm ơn vì đã để anh được là người ở bên em ngày hôm nay',
  },
  {
    src: '/photos/anh7.jpg',
    caption: 'Bó hoa này, trái tim này — tất cả đều là của em, sinh nhật vui nhé con nợnn 💕',
  },
];

// All text blocks for the typewriter, in order
const LETTER_BLOCKS = [
  { text: LETTER.greeting, role: 'title' },
  ...LETTER.paragraphs.map(t => ({ text: t, role: 'para' })),
  { text: LETTER.sign, role: 'sign' },
];

// Total chars × ~45 ms + inter-block pauses → ~24 s
const LETTER_DURATION = 26000;

// Slide definitions: duration = ms, null = no auto-advance
const SLIDES = [
  { id: 'letter',   type: 'letter',  duration: LETTER_DURATION },
  ...PHOTOS.map((p, i) => ({ id: `photo-${i}`, type: 'photo', duration: 6000, ...p })),
  { id: 'surprise', type: 'surprise', duration: null },
];

/* ─────────── TYPEWRITER HOOK ─────────── */
const useTypewriter = (blocks, charDelay = 44, blockPause = 420) => {
  // blockIdx: which block is currently typing; charIdx: how many chars shown
  const [blockIdx, setBlockIdx] = useState(0);
  const [charIdx,  setCharIdx]  = useState(0);
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    setBlockIdx(0);
    setCharIdx(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (done) return;

    const block = blocks[blockIdx];
    if (!block) { setDone(true); return; }

    if (charIdx < block.text.length) {
      // Type next character
      const t = setTimeout(() => setCharIdx(c => c + 1), charDelay);
      return () => clearTimeout(t);
    }

    // Block finished — pause then advance to next
    if (blockIdx < blocks.length - 1) {
      const t = setTimeout(() => {
        setBlockIdx(b => b + 1);
        setCharIdx(0);
      }, blockPause);
      return () => clearTimeout(t);
    }

    // All blocks done
    setDone(true);
  }, [blockIdx, charIdx, done, blocks, charDelay, blockPause]);

  return { blockIdx, charIdx, done };
};

/* ─────────── LETTER SLIDE ─────────── */
const LetterSlide = () => {
  const { blockIdx, charIdx, done } = useTypewriter(LETTER_BLOCKS);

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

        <div className="letter-body">
          {LETTER_BLOCKS.map((block, bi) => {
            if (bi > blockIdx) return null;

            const isTyping = bi === blockIdx;
            const text = isTyping ? block.text.slice(0, charIdx) : block.text;
            const showCursor = isTyping && !done;

            const cls =
              block.role === 'title' ? 'letter-title tw-title' :
              block.role === 'sign'  ? 'letter-sign tw-para'   :
                                       'tw-para';

            return (
              <motion.p
                key={bi}
                className={cls}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                {text}
                {showCursor && <span className="tw-cursor">|</span>}
              </motion.p>
            );
          })}
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
