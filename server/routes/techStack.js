import express from 'express';
import TechStack from '../models/TechStack.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Add TechStack
router.post('/', auth, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'techstack',
    });
    const techStack = new TechStack({
      name: req.body.name,
      picture: result.secure_url,
      showOnMainPage: req.body.showOnMainPage === 'true',
    });
    await techStack.save();
    res.status(201).json(techStack);
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ message: error.message || 'Failed to add tech' });
  }
});

// Get all TechStacks
router.get('/', async (req, res) => {
  try {
    const techStacks = await TechStack.find();
    res.json(techStacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove TechStack
router.delete('/:id', auth, async (req, res) => {
  try {
    const techStack = await TechStack.findByIdAndDelete(req.params.id);
    if (!techStack) return res.status(404).json({ message: 'TechStack not found' });
    res.json({ message: 'TechStack deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle showOnMainPage
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const techStack = await TechStack.findById(req.params.id);
    if (!techStack) return res.status(404).json({ message: 'TechStack not found' });
    techStack.showOnMainPage = !techStack.showOnMainPage;
    await techStack.save();
    res.json(techStack);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;