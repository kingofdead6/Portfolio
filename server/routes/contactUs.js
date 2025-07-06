import express from 'express';
import ContactUs from '../models/ContactUs.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Add ContactUs (public)
router.post('/', async (req, res) => {
  try {
    const contact = new ContactUs({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all ContactUs (admin)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await ContactUs.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove ContactUs
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await ContactUs.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle seen
router.patch('/:id/toggle-seen', auth, async (req, res) => {
  try {
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.seen = !contact.seen;
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;