console.log("Server file started");

import dotenv from 'dotenv';
dotenv.config();

import User from './models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// ✅ SIGNUP API
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ message: 'User created', token });

  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// 🔥 LOGIN API (NEW)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ message: 'Login successful', token });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// test route
app.get('/', (req, res) => {
  res.send('Server is running');
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});