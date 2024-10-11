const Comment = require('../models/Comment');
const Post = require('../models/Post');
const bcrypt = require('bcrypt');

// 댓글 등록 함수
exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { nickname, content, password } = req.body;

        // 게시글 존재 여부 확인
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않는 게시글입니다.' });
        }

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 댓글 생성
        const newComment = new Comment({
            postId,
            nickname,
            content,
            password: hashedPassword
        });

        // 댓글 저장
        const savedComment = await newComment.save();

        // 응답
        return res.status(200).json({
            id: savedComment._id,
            nickname: savedComment.nickname,
            content: savedComment.content,
            createdAt: savedComment.createdAt
        });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 댓글 목록 조회 함수
exports.getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;
        const { page = 1, pageSize = 10 } = req.query;

        // 페이징 및 필터 조건 설정
        const skip = (page - 1) * pageSize;
        const limit = parseInt(pageSize);

        // 해당 게시글의 전체 댓글 수 조회
        const totalItemCount = await Comment.countDocuments({ postId });

        // 전체 페이지 수 계산
        const totalPages = Math.ceil(totalItemCount / pageSize);

        // 댓글 조회
        const comments = await Comment.find({ postId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // 최신순 정렬

        // 응답
        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data: comments.map(comment => ({
                id: comment._id,
                nickname: comment.nickname,
                content: comment.content,
                createdAt: comment.createdAt
            }))
        });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 댓글 수정 함수
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { nickname, content, password } = req.body;

        // 댓글 찾기
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(password, comment.password);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        // 댓글 업데이트
        comment.nickname = nickname || comment.nickname;
        comment.content = content || comment.content;
        await comment.save();

        // 응답
        return res.status(200).json({
            id: comment._id,
            nickname: comment.nickname,
            content: comment.content,
            createdAt: comment.createdAt
        });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 댓글 삭제 함수
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { password } = req.body;

        // 댓글 찾기
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(password, comment.password);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다.' });
        }

        // 댓글 삭제
        await Comment.findByIdAndDelete(commentId);

        // 응답
        return res.status(200).json({ message: '댓글 삭제 성공' });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

