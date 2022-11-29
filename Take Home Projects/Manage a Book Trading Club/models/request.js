import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({});

export default mongoose.model('Request', requestSchema);