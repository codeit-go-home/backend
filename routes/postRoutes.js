const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 게시글 등록
router.post('/', postController.createPost);
// 게시글 목록 조회
router.get('/', postController.getPosts);
// 다른 라우트 추가...

module.exports = router;

