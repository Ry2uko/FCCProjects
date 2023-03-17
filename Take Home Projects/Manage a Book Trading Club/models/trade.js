import mongoose from 'mongoose';
import moment from 'moment';

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
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  }
});

export default mongoose.model('Trade', tradeSchema);