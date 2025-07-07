import mongoose from 'mongoose';

const ourProjectsSchema = new mongoose.Schema({
  picture: { type: String, required: true }, // Cloudinary URL
  name: { type: String, required: true },
  description: { type: String, required: true },
  techUsed: { type: [String], required: true },
  liveSiteLink: { type: String, required: true },
  githubLink: { type: String, required: true },
  showOnMainPage: { type: Boolean, default: false },
});

export default mongoose.model('OurProjects', ourProjectsSchema);