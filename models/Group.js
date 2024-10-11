const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  imageUrl: String,
  description: String,
  isPublic: { type: Boolean, default: true },
  password: String,
  postCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  badges: {
    sevenDayStreak: { type: Boolean, default: false },  // 7일 연속 추억 등록
    twentyPosts: { type: Boolean, default: false },     // 20개 이상 추억 등록
    oneYearAnniversary: { type: Boolean, default: false }, // 1년 달성
    tenThousandLikes: { type: Boolean, default: false },    // 1만 공감 받기
    tenThousandPosts: { type: Boolean, default: false }     // 1만 개 추억 등록
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);
