import express from 'express';
import OurSkills from '../models/skills.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Add Skill
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
      folder: 'skills',
    });
    const skill = new OurSkills({
      name: req.body.name,
      picture: result.secure_url,
      showOnMainPage: req.body.showOnMainPage === 'true',
    });
    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ message: error.message || 'Failed to add skill' });
  }
});

// Get all Skills
router.get('/', async (req, res) => {
  try {
    const skills = await OurSkills.find();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update Skill
router.patch('/:id', auth, upload.single('picture'), async (req, res) => {
  try {
    const skill = await OurSkills.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (req.body.name) skill.name = req.body.name;
    if (req.body.showOnMainPage !== undefined) skill.showOnMainPage = req.body.showOnMainPage === 'true';
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: 'skills',
      });
      skill.picture = result.secure_url;
    }

    await skill.save();
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: error.message || 'Failed to update skill' });
  }
});

// Remove Skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await OurSkills.findByIdAndDelete(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: error.message });
  }
});

// Toggle showOnMainPage
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const skill = await OurSkills.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    skill.showOnMainPage = !skill.showOnMainPage;
    await skill.save();
    res.json(skill);
  } catch (error) {
    console.error('Error toggling skill visibility:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;