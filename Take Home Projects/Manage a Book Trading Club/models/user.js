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
  avatar_url: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  hide_location: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: ''
  },
  trades: { // trade id
    type: Array,
    default: []
  },
  books: { // book id
    type: Array,
    default: [] 
  }
});

export default mongoose.model('User', userSchema);