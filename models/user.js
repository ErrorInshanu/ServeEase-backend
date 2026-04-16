import mongoose from 'mongoose';

// structure of user
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// create model
export default mongoose.model('User', userSchema);