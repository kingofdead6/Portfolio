import mongoose from 'mongoose';

const ourSkillsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String, required: true }, // Cloudinary URL
  showOnMainPage: { type: Boolean, default: false },
});

export default mongoose.model('OurSkills', ourSkillsSchema);