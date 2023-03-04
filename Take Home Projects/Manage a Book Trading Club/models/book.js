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
  user: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    default: ''
  },
  available: { // if someone hasn't traded yet
    type: Boolean,
    default: true
  },
  requests: { // request id
    type: Array,
    default: []
  },
  requests_count: {
    type: Number,
    default: 0
  },
  requests_user: { // user id
    type: Array,
    default: []
  }
});

export default mongoose.model('Book', bookSchema);