const Post = require('../models/Post');
const bcrypt = require('bcryptjs');

// 게시글 등록 함수
exports.createPost = async (req, res) => {
    try {
        const { groupId } = req.params; // URL 파라미터로 groupId 받음
        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, postPassword } = req.body;

        // 비밀번호 암호화
        const hashedPassword = await bcrypt.hash(postPassword, 10);

        // 게시글 생성
        const newPost = new Post({
            groupId,
            nickname,
            title,
            content,
            imageUrl,
            tags,
            location,
            moment,
            isPublic,
            postPassword: hashedPassword
        });

        // 몽고DB에 저장
        const savedPost = await newPost.save();

        return res.status(201).json({
            id: savedPost._id,
            groupId: savedPost.groupId,
            nickname: savedPost.nickname,
            title: savedPost.title,
            content: savedPost.content,
            imageUrl: savedPost.imageUrl,
            tags: savedPost.tags,
            location: savedPost.location,
            moment: savedPost.moment,
            isPublic: savedPost.isPublic,
            likeCount: savedPost.likeCount,
            commentCount: savedPost.commentCount,
            createdAt: savedPost.createdAt
        });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};


// 게시글 목록 조회 함수
exports.getPosts = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic = true } = req.query;

        // 기본 페이징 및 검색 조건 설정
        const query = {
            groupId,
            isPublic: isPublic === 'true' // 문자열로 넘어오는 파라미터 처리
        };

        if (keyword) {
            query.title = { $regex: keyword, $options: 'i' }; // 제목 검색
        }

        // 정렬 조건 설정
        let sortOption;
        if (sortBy === 'mostLiked') {
            sortOption = { likeCount: -1 };
        } else if (sortBy === 'mostCommented') {
            sortOption = { commentCount: -1 };
        } else {
            sortOption = { createdAt: -1 }; // 기본 정렬: 최신순
        }

        // 데이터베이스에서 게시글 조회
        const posts = await Post.find(query)
            .sort(sortOption)
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        // 전체 게시글 수 조회
        const totalItemCount = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalItemCount / pageSize);

        // 응답
        return res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalItemCount,
            data: posts
        });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 게시글 수정 함수
exports.updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { nickname, title, content, imageUrl, tags, location, moment, isPublic, postPassword } = req.body;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다!' });
        }

        // 게시글 업데이트
        post.nickname = nickname || post.nickname;
        post.title = title || post.title;
        post.content = content || post.content;
        post.imageUrl = imageUrl || post.imageUrl;
        post.tags = tags || post.tags;
        post.location = location || post.location;
        post.moment = moment || post.moment;
        post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;

        const updatedPost = await post.save();

        // 응답
        return res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};
// 게시글 삭제 함수
exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { postPassword } = req.body;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(postPassword, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다!' });
        }

        // 게시글 삭제
        await Post.findByIdAndDelete(postId);

        // 응답
        return res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 게시글 상세 조회 함수
exports.getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 응답
        return res.status(200).json(post);
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 게시글 조회 권한 확인 함수
exports.verifyPostPassword = async (req, res) => {
    try {
        const { postId } = req.params;
        const { password } = req.body;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 비밀번호 확인
        const isPasswordMatch = await bcrypt.compare(password, post.postPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
        }

        // 성공 응답
        return res.status(200).json({ message: '비밀번호가 확인되었습니다.' });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 게시글 공감하기 함수
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 공감 수 증가
        post.likeCount += 1;
        await post.save();

        // 응답
        return res.status(200).json({ message: '게시글 공감하기 성공' });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};

// 게시글 공개 여부 확인 함수
exports.checkPostIsPublic = async (req, res) => {
    try {
        const { postId } = req.params;

        // 게시글 찾기
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: '존재하지 않습니다.' });
        }

        // 공개 여부 반환
        return res.status(200).json({ id: post._id, isPublic: post.isPublic });
    } catch (error) {
        return res.status(400).json({ message: '잘못된 요청입니다.', error });
    }
};