import express from 'express';
import OurProjects from '../models/OurProjects.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Add Project
router.post('/', auth, upload.single('picture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    if (!req.body.name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: 'Description is required' });
    }
    if (!req.body.techUsed) {
      return res.status(400).json({ message: 'Tech Used is required' });
    }
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'projects',
    });
    const project = new OurProjects({
      picture: result.secure_url,
      name: req.body.name,
      description: req.body.description,
      techUsed: req.body.techUsed.split(',').map(tech => tech.trim()),
      liveSiteLink: req.body.liveSiteLink || '',
      showOnMainPage: req.body.showOnMainPage === 'true',
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ message: error.message || 'Failed to add project' });
  }
});

// Get all Projects
router.get('/', async (req, res) => {
  try {
    const projects = await OurProjects.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove Project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await OurProjects.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: error.message });
  }
});

// Toggle showOnMainPage
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const project = await OurProjects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.showOnMainPage = !project.showOnMainPage;
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Error toggling project visibility:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
