import mongoose from 'mongoose';

// similar to the request model since it will only be a trade if the request is accepted

const tradeSchema = new mongoose.Schema({
  userA: { // username
    type: String,
    required: true
  },
  userABooks: {
    type: Array,
    default: []
  },
  userB: { // username
    type: String,
    required: true
  },
  userBBooks: {
    type: Array,
    default: []
  },
  accepted_on: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  }
});

export default mongoose.model('Trade', tradeSchema);