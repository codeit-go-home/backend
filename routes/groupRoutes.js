const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const auth = require('../middleware/auth');

// 그룹 등록
router.post('/groups', auth, groupController.createGroup);

// 그룹 수정
router.put('/groups/:groupId', auth, groupController.updateGroup);

// 그룹 삭제
router.delete('/groups/:groupId', auth, groupController.deleteGroup);

// 그룹 목록 조회
router.get('/groups', groupController.getGroups);

// 그룹 상세 조회
router.get('/groups/:groupId', groupController.getGroup);

// 그룹 공감 보내기
router.post('/groups/:groupId/like', auth, groupController.likeGroup);

module.exports = router;