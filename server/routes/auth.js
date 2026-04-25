import express from 'express';
import { ApiKey } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { key } = req.body;
  const keyDoc = await ApiKey.findOne({ key });
  
  if (keyDoc) {
    res.json({ apiKey: keyDoc.key, user: keyDoc });
  } else {
    res.status(401).json({ error: "Neteisingas raktas." });
  }
});

router.put('/me/update-key', auth(), async (req, res) => {
  try {
    const { newKey } = req.body;
    if (!newKey || newKey.length < 5) return res.status(400).json({ error: "Per trumpas raktas." });
    
    const existing = await ApiKey.findOne({ key: newKey });
    if (existing) return res.status(400).json({ error: "Raktas užimtas." });

    req.user.key = newKey;
    await req.user.save();
    
    res.json({ message: "Pakeista", newKey });
  } catch (err) { 
    res.status(500).json({ error: "Klaida keičiant raktą." }); 
  }
});

export default router;