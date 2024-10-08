const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록
router.post('/', groupController.createGroup);

// 그룹 목록 조회
router.get('/', groupController.getGroups);

// 그룹 상세 조회
router.get('/:groupId', groupController.getGroup);

// 그룹 수정
router.put('/:groupId', groupController.updateGroup);

// 그룹 삭제
router.delete('/:groupId', groupController.deleteGroup);

// 그룹 공감하기
router.post('/:groupId/like', groupController.likeGroup);

// 그룹 권한 확인 
router.post('/:groupId/verify-password', groupController.verifyPassword);

module.exports = router;
