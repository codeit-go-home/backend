const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // .env 파일에서 환경 변수 로드

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const Group = require('./models/Group'); // Group 모델 가져오기

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api/groups', groupRoutes);
app.use('/api/posts', postRoutes);

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
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
