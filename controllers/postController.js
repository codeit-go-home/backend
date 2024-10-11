const multer = require('multer');
const path = require('path');

// multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 이미지가 저장될 경로
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 함수
exports.uploadImage = (req, res) => {
  try {
    const imageUrl = `/uploads/${req.file.filename}`; // 저장된 파일 경로를 URL로 변환
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
};
exports.createPost = (req, res) => {
    // 게시글 생성 로직
};

exports.getPosts = (req, res) => {
    // 게시글 목록 조회 로직
};

