import React from 'react';
import { motion } from 'framer-motion';

// ✏️ THAY NỘI DUNG LỜI CHÚC Ở ĐÂY
const LETTER_CONTENT = {
  // ✏️ Đổi tên người yêu của bạn ở đây
  partnerName: 'Em Yêu',
  // ✏️ Đổi tên của bạn ở đây
  yourName: 'Anh',
  paragraphs: [
    'Chúc mừng sinh nhật thiên thần của anh! 🎂',
    'Anh không phải là người quá giỏi diễn đạt, nhưng anh mong em biết rằng mỗi ngày có em bên cạnh đều là ngày hạnh phúc nhất đối với anh.',
    'Tuổi mới, chúc em luôn xinh đẹp, vui vẻ và thành công với những dự định của mình. Dù có khó khăn gì đi nữa, hãy luôn nhớ rằng phía sau em luôn có anh ủng hộ.',
    'Hãy cứ là chính em — một cô gái rạng rỡ và tuyệt vời nhất! ✨',
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
          Gửi {LETTER_CONTENT.partnerName}, Nửa Kia Của Anh...
        </h2>

        <div className="letter-body">
          {LETTER_CONTENT.paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <p className="letter-sign">
            Yêu em mãi mãi, <br />
            {LETTER_CONTENT.yourName} ❤️
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Letter;
