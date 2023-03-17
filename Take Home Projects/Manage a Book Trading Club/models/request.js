import mongoose from 'mongoose';
import moment from 'moment';

const requestSchema = new mongoose.Schema({
  userA: { // username
    type: String,
    required: true
  },
  userABooks: {
    type: Array,
    default: [] // book id
  },
  userB: { // username
    type: String,
    required: true
  },
  userBBooks: {
    type: Array,
    default: [] // book id
  },
  requested_on: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm:ss a')
  }
});

export default mongoose.model('Request', requestSchema);