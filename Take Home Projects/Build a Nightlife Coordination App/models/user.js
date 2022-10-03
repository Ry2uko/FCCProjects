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
  destination: {
    type: String,
    default: "" 
  },
  destination_link: {
    type: String,
    default: ""
  }
});

export default mongoose.model('User', userSchema);