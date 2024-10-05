const Group = require('../models/Group');

// 그룹 등록
exports.createGroup = async (req, res) => {
  const { groupName, imageUrl, description, isPublic, password } = req.body;
  try {
    const newGroup = new Group({
      groupName,
      imageUrl,
      description,
      isPublic,
      password,
    });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// 그룹 수정 (비밀번호 확인)
exports.updateGroup = async (req, res) => {
  const { groupId } = req.params;
  const { password, ...updateData } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group || group.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    Object.assign(group, updateData);
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group' });
  }
};

// 그룹 삭제 (비밀번호 확인)
exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group || group.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    await group.remove();
    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

// 그룹 목록 조회
exports.getGroups = async (req, res) => {
  const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = true } = req.query;

  try {
    const query = { isPublic };
    if (keyword) {
      query.groupName = new RegExp(keyword, 'i');
    }

    const groups = await Group.find(query)
      .sort(getSortOption(sortBy))
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

// 그룹 상세 조회
exports.getGroup = async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;  // For private groups

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!group.isPublic && group.password !== password) {
      return res.status(401).json({ error: 'Incorrect password for private group' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group details' });
  }
};

// 공감 보내기
exports.likeGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    group.likes += 1;
    await group.save();
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like group' });
  }
};

// 그룹 정렬 옵션
function getSortOption(sortBy) {
  switch (sortBy) {
    case 'mostPosted':
      return { postCount: -1 };
    case 'mostLiked':
      return { likes: -1 };
    case 'mostBadge':
      return { badgeCount: -1 };
    default:
      return { createdAt: -1 };  // 최신순
  }
}