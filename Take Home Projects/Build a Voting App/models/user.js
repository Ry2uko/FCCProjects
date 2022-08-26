import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  polls_created: {
    type: Number,
    default: 0
  },
  polls_voted: {
    type: Object,
    default: {}
  },
  total_votes: {
    type: Number,
    default: 0
  },
  date_created: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  },
});

export default mongoose.model('User', userSchema);