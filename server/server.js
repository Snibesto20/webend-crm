import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import keyRoutes from './routes/keys.js';
import emailRoutes from './routes/email.js';
import userRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB database ready!'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/keys', keyRoutes);
app.use('/api/send-email', emailRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server ready on port ${PORT}!`));