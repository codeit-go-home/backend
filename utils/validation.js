  // 기존 validation 관련 코드가 있을 경우 그 아래에 추가
exports.validatePostData = (req, res, next) => {
    const { nickname, title, content, postPassword } = req.body;
    if (!nickname || !title || !content || !postPassword) {
        return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
    }
    next();
};

exports.validateGetPostsQuery = (req, res, next) => {
    const { page = 1, pageSize = 10, sortBy, isPublic } = req.query;
    
    // page와 pageSize는 숫자여야 함
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return res.status(400).json({ message: '잘못된 페이지 정보입니다.' });
    }

    // sortBy는 정해진 값만 허용
    const validSortOptions = ['latest', 'mostCommented', 'mostLiked'];
    if (sortBy && !validSortOptions.includes(sortBy)) {
        return res.status(400).json({ message: '잘못된 정렬 기준입니다.' });
    }

    // isPublic은 true 또는 false만 허용
    if (isPublic && isPublic !== 'true' && isPublic !== 'false') {
        return res.status(400).json({ message: '잘못된 공개 여부 값입니다.' });
    }

    next();
};

exports.validateUpdatePostData = (req, res, next) => {
    const { nickname, title, content, postPassword } = req.body;
    
    // 필수 필드 확인
    if (!nickname || !title || !content || !postPassword) {
        return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
    }

    next();
};



exports.validateDeletePostData = (req, res, next) => {
    const { postPassword } = req.body;

    // 비밀번호가 없는 경우
    if (!postPassword) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    next();
};

exports.validatePostId = (req, res, next) => {
    const { postId } = req.params;

    // postId가 유효한 MongoDB ObjectId인지 확인
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    next();
};
exports.validateVerifyPostPassword = (req, res, next) => {
    const { password } = req.body;

    // 비밀번호가 없는 경우
    if (!password) {
        return res.status(400).json({ message: '잘못된 요청입니다. 비밀번호를 입력해주세요.' });
    }

    next();
};


exports.validatePostId = (req, res, next) => {
    const { postId } = req.params;

    // postId가 유효한 MongoDB ObjectId인지 확인
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    next();
};

exports.validatePostId = (req, res, next) => {
    const { postId } = req.params;

    // postId가 유효한 MongoDB ObjectId인지 확인
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    next();
};

exports.validateCommentData = (req, res, next) => {
    const { nickname, content, password } = req.body;

    // 필수 필드 확인
    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다. 필수 필드가 누락되었습니다.' });
    }

    next();
};

exports.validateGetCommentsQuery = (req, res, next) => {
    const { page = 1, pageSize = 10 } = req.query;

    // page와 pageSize가 숫자인지 확인
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
        return res.status(400).json({ message: '잘못된 페이지 정보입니다.' });
    }

    next();
};

exports.validateUpdateCommentData = (req, res, next) => {
    const { nickname, content, password } = req.body;

    // 필수 필드 확인
    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다. 필수 필드가 누락되었습니다.' });
    }

    next();
};

exports.validateDeleteCommentData = (req, res, next) => {
    const { password } = req.body;

    // 비밀번호가 없는 경우
    if (!password) {
        return res.status(400).json({ message: '잘못된 요청입니다.' });
    }

    next();
};



