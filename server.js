const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // multer 추가
require('dotenv').config();

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const Group = require('./models/Group');

const app = express();

// multer 설정
const storage = multer.memoryStorage(); // 메모리 스토리지 사용
const upload = multer({ storage });

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api/groups', groupRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', commentRoutes);

// 이미지 업로드 라우트 추가
app.post('/api/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // 여기에 이미지 URL 생성 로직 추가 (예: S3에 업로드 등)
  const imageUrl = 'some_generated_url'; // 실제 URL 생성 로직으로 대체

  res.json({ imageUrl });
});

// 테스트용 라우트 추가
app.post('/api/test-group', async (req, res) => {
  const { name, description } = req.body;

  try {
    const newGroup = new Group({ name, description });
    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

// MongoDB 연결
const uri = process.env.MONGO_URI || 'mongodb+srv://20221370:123456789@codeit-toy.lj1me.mongodb.net/codeit-toy?retryWrites=true&w=majority';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));
