import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  id: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  books: {
    type: Array,
    default: []
  }
});

export default mongoose.model('User', userSchema);