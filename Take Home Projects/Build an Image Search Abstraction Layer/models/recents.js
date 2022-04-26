import mongoose from 'mongoose';

const recentSchema = new mongoose.Schema({
  searchQuery: {
    type: String,
    required: true
  },
  timeSearched: {
    type: String,
    default: new Date().toLocaleString('en-us')
  }
});

export default mongoose.model('Recents', recentSchema);