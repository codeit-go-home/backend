const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // 게시글 ID
    nickname: { type: String, required: true },
    content: { type: String, required: true },
    password: { type: String, required: true }, // 비밀번호는 해시된 형태로 저장
}, {
    timestamps: true // 생성일, 수정일 자동 생성
});

module.exports = mongoose.model('Comment', commentSchema);