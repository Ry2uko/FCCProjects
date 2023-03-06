import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  userA: {
    type: String,
    required: true
  },
  userABooks: {
    type: Array,
    default: [] // book id
  },
  userB: {
    type: String,
    required: true
  },
  userBBooks: {
    type: Array,
    default: [] // book id
  },
  requested_on: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  }
});

export default mongoose.model('Request', requestSchema);