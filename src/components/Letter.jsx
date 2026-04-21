import React from 'react';
import { motion } from 'framer-motion';

// ✏️ THAY NỘI DUNG LỜI CHÚC Ở ĐÂY
const LETTER_CONTENT = {
  // ✏️ Đổi tên người yêu của bạn ở đây
  partnerName: 'Em Yêu',
  // ✏️ Đổi tên của bạn ở đây
  yourName: 'Anh',
  paragraphs: [
    'Hôm nay là ngày đặc biệt nhất của năm — ngày em chào đời, ngày mà anh biết ơn vì em đã xuất hiện trong cuộc đời này và đi vào cuộc đời anh.',
    'Một tuổi mới, một trang mới. Anh chúc em năm nay sẽ chạm được những điều em hằng mơ ước — công việc thuận lợi, sức khỏe dồi dào, và trái tim luôn nhẹ nhàng, bình yên. Em xứng đáng được nhận tất cả những điều tốt đẹp nhất mà cuộc đời có thể trao.',
    'Và dù năm mới có mang đến bao nhiêu thử thách, em đừng bao giờ quên rằng phía sau em luôn có anh — không phải để gánh thay, mà để cùng em bước qua từng bước một.',
    'Sinh nhật vui, em yêu. Cảm ơn em vì đã sinh ra, vì đã là em — và vì đã để anh được yêu em. ✨',
  ],
};

const Letter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.5 }}
    >
      <div className="letter-card glass">
        {/* Thanh gradient trên cùng */}
        <div className="letter-top-bar" />

        <h2 className="letter-title">
          Chúc Mừng Sinh Nhật {LETTER_CONTENT.partnerName}! 🎂
        </h2>

        <div className="letter-body">
          {LETTER_CONTENT.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="letter-sign">
            Mãi yêu em, hôm nay và tất cả những ngày sinh nhật còn lại. <br />
            {LETTER_CONTENT.yourName} ❤️
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Letter;
