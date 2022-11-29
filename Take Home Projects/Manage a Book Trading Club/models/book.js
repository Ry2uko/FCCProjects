import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({});

export default mongoose.model('Book', bookSchema);