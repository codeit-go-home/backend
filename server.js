const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');
const Group = require('./models/Group');

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
