const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 등록
router.post('/', groupController.createGroup);
// 그룹 목록 조회
router.get('/', groupController.getGroups);
// 다른 라우트 추가...

module.exports = router;

