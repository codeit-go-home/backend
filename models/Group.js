const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  imageUrl: { type: String, required: false },
  description: { type: String, required: false },
  isPublic: { type: Boolean, default: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },  // 게시글 수
  badgeCount: { type: Number, default: 0 }, // 획득 배지수
  memoryCount: { type: Number, default: 0 }, // 추억수
});

module.exports = mongoose.model('Group', groupSchema);