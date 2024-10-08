const Group = require('../models/Group');

// 그룹 등록
exports.createGroup = async (req, res) => {
  const { groupName, imageUrl, description, isPublic, password } = req.body;
  try {
    const newGroup = new Group({ groupName, imageUrl, description, isPublic, password });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 목록 조회
exports.getGroups = async (req, res) => {
  const { page = 1, pageSize = 10, sortBy, keyword, isPublic } = req.query;
  const query = {};
  
  if (keyword) query.groupName = { $regex: keyword, $options: 'i' };
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';

  const sortOptions = {};
  if (sortBy === 'latest') sortOptions.createdAt = -1;
  else if (sortBy === 'mostPosted') sortOptions.postCount = -1;
  else if (sortBy === 'mostLiked') sortOptions.likes = -1;
  else if (sortBy === 'mostBadge') sortOptions.badgeCount = -1;

  try {
    const groups = await Group.find(query)
      .sort(sortOptions)
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 상세 조회
exports.getGroup = async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.query;
  
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
    if (!group.isPublic && group.password !== password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 수정
exports.updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const { groupName, imageUrl, description, isPublic, password } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
    if (group.password !== password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 그룹 정보 업데이트
    group.groupName = groupName || group.groupName;
    group.imageUrl = imageUrl || group.imageUrl;
    group.description = description || group.description;
    group.isPublic = isPublic !== undefined ? isPublic : group.isPublic;

    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 삭제
exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });
    if (group.password !== password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 그룹 삭제
    await Group.findByIdAndDelete(groupId); // 수정된 부분
    res.json({ message: '그룹이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 공감하기
exports.likeGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });

    // 공감 수 증가
    group.likes += 1;
    await group.save();

    // 성공 메시지 반환
    res.status(200).json({ message: '그룹 공감하기 성공' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 그룹 조회 권한을 위한 비밀번호 확인
exports.verifyPassword = async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });

    // 비밀번호 확인
    if (group.password === password) {
      return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } else {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류', error: error.message });
  }

  
};
// 그룹 공개 여부 확인
exports.getGroupIsPublic = async (req, res) => {
  const { groupId } = req.params;
  
  try {
    const group = await Group.findById(groupId, 'isPublic');
    if (!group) return res.status(404).json({ error: '그룹을 찾을 수 없습니다.' });

    res.status(200).json({
      id: groupId,
      isPublic: group.isPublic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};