const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    groupId: { type: Number, required: true }, // 그룹 ID 추가
    nickname: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, // 이미지 URL
    tags: [String], // 태그 배열
    location: { type: String },
    moment: { type: Date }, // 추억의 순간
    isPublic: { type: Boolean, default: true }, // 공개 여부
    postPassword: { type: String, required: true }, // 게시글 비밀번호
    likeCount: { type: Number, default: 0 }, // 공감 수
    commentCount: { type: Number, default: 0 }, // 댓글 수
}, {
    timestamps: true, // 생성일, 수정일 자동 생성
});

module.exports = mongoose.model('Post', postSchema);
