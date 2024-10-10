const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
// 게시글 등록
router.post('/', postController.createPost);
// 게시글 목록 조회
router.get('/', postController.getPosts);
// multer 설정을 사용하여 파일 업로드 처리
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('image'), postController.uploadImage);

module.exports = router;


