const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  imageUrl: String,
  description: String,
  isPublic: { type: Boolean, default: true },
  password: String,
  postCount: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  badgeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);
