import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  seen: { type: Boolean, default: false },
});

export default mongoose.model('ContactUs', contactUsSchema);