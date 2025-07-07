import express from 'express';
import NewsLetter from '../models/NewsLetter.js';
import auth from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
import ExcelJS from 'exceljs';

const router = express.Router();

// Add NewsLetter (public)
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    const existing = await NewsLetter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    const newsLetter = new NewsLetter({ email });
    await newsLetter.save();
    res.status(201).json(newsLetter);
  } catch (error) {
    console.error('Error adding newsletter:', error);
    res.status(500).json({ message: error.message || 'Failed to subscribe' });
  }
});

// Get all NewsLetters (admin)
router.get('/', auth, async (req, res) => {
  try {
    const newsLetters = await NewsLetter.find();
    res.json(newsLetters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove NewsLetter
router.delete('/:id', auth, async (req, res) => {
  try {
    const newsLetter = await NewsLetter.findByIdAndDelete(req.params.id);
    if (!newsLetter) return res.status(404).json({ message: 'Subscription not found' });
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    console.error('Error deleting newsletter:', error);
    res.status(500).json({ message: error.message });
  }
});

// Remove Multiple NewsLetters
router.delete('/', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No subscriptions selected' });
    }
    const result = await NewsLetter.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No subscriptions found' });
    }
    res.json({ message: `${result.deletedCount} subscription(s) deleted` });
  } catch (error) {
    console.error('Error deleting multiple newsletters:', error);
    res.status(500).json({ message: error.message });
  }
});

// Download NewsLetters as Excel
router.get('/download', auth, async (req, res) => {
  try {
    const newsLetters = await NewsLetter.find();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Subscribers');

    worksheet.columns = [
      { header: 'Email', key: 'email', width: 50 },
    ];

    newsLetters.forEach((subscriber) => {
      worksheet.addRow({ email: subscriber.email });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=subscribers.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error generating Excel file:', error);
    res.status(500).json({ message: error.message || 'Failed to download subscribers' });
  }
});

// Send custom email
router.post('/send-email', auth, async (req, res) => {
  const { emails, subject, message, isHtml } = req.body;

  try {
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ message: 'At least one email is required' });
    }
    if (!subject) return res.status(400).json({ message: 'Subject is required' });
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emails.join(','),
      subject,
      [isHtml ? 'html' : 'text']: message,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ message: error.message || 'Failed to send emails' });
  }
});

export default router;