const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePostData, validateGetPostsQuery, validateUpdatePostData, validateDeletePostData,validatePostId } = require('../utils/validation');  // utils 폴더에서 validation 함수 가져옴

// 게시글 등록
router.post('/groups/:groupId/posts', validatePostData, postController.createPost);
// 게시글 목록 조회
router.get('/groups/:groupId/posts', validateGetPostsQuery, postController.getPosts);
// 게시글 수정
router.put('/posts/:postId', validateUpdatePostData, postController.updatePost);
// 게시글 삭제
router.delete('/posts/:postId', validateDeletePostData, postController.deletePost);
// 게시글 상세 조회
router.get('/posts/:postId', validatePostId, postController.getPostById);
// 게시글 조회 권한 확인
router.post('/posts/:postId/verify-password', validateVerifyPostPassword, postController.verifyPostPassword);
// 게시글 공감하기
router.post('/posts/:postId/like', validatePostId, postController.likePost);
// 게시글 공개 여부 확인
router.get('/posts/:postId/is-public', validatePostId, postController.checkPostIsPublic);


module.exports = router;

