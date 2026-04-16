console.log("Server file started");

import User from './models/user.js'; // ⚠️ fix capital U
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect('mongodb+srv://ServeEase:ServeEase@cluster0.knnyr0f.mongodb.net/?appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ ADD SIGNUP API HERE 👇
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, 'secretkey');

    res.json({ message: 'User created', token });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});