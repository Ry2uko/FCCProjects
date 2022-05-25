import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true 
  },
  html_url: {
    type: String,
    required: true
  },
  uploaded_count: {
    type: Number,
    default: 0
  },
  joined_date: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  },
  picStarred: {
    type: Array,
    default: []
  }
});

export default mongoose.model('User', userSchema);