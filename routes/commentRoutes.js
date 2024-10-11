const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { validateCommentData } = require('../utils/validation');

// 댓글 등록
router.post('/posts/:postId/comments', validateCommentData, commentController.createComment);
// 댓글 목록 조회
router.get('/posts/:postId/comments', validateGetCommentsQuery, commentController.getCommentsByPostId);
// 댓글 수정
router.put('/comments/:commentId', validateUpdateCommentData, commentController.updateComment);
// 댓글 삭제
router.delete('/comments/:commentId', validateDeleteCommentData, commentController.deleteComment);


module.exports = router;
