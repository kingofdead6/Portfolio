import mongoose from 'mongoose';

const techStackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String, required: true }, 
  showOnMainPage: { type: Boolean, default: false },
});

export default mongoose.model('TechStack', techStackSchema);