import mongoose from 'mongoose';

const picSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  picUrl: {
    type: String,
    required: true 
  },
  picDesc: {
    type: String, 
    required: true
  },
  uploaded_on: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
  },
  starred: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Pic', picSchema);