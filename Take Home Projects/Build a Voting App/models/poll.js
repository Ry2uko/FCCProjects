import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  date_created: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  },
  total_votes: {
    type: Number, 
    default: 0
  },
  options: {
    type: Object,
    required: true
  }
});

export default mongoose.model('Poll', pollSchema)