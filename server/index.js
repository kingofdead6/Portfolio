import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import techStackRoutes from './routes/techStack.js';
import ourProjectsRoutes from './routes/ourProjects.js';
import contactUsRoutes from './routes/contactUs.js';
import newsLetterRoutes from './routes/newsLetter.js';
import adminRoutes from './routes/admin.js';
import skillsRoutes from './routes/skills.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/techstack', techStackRoutes);
app.use('/api/projects', ourProjectsRoutes);
app.use('/api/contactus', contactUsRoutes);
app.use('/api/newsletter', newsLetterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skills' , skillsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get('/', (req, res) => {
  res.send('Backend API is running');
});
