import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Register Admin
router.post('/register', async (req, res) => {
  try {
    const { username,email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username,email, password: hashedPassword });
    await admin.save();
    res.status(201).json({ message: 'Admin registered' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Admin
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'Invalid token' });

    res.json(admin);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});
export default router;