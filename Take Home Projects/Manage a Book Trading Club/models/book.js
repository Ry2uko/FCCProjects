import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: ''
  },
  user: { // username
    type: String,
    required: true
  },
  condition: {
    type: String,
    default: ''
  },
  requests: { // request id
    type: Array,
    default: []
  },
  requests_count: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Book', bookSchema);