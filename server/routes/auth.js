import express from 'express';
import { ApiKey } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) return res.status(401).json({ error: "Raktas nepateiktas." });

    const keyDoc = await ApiKey.findOne({ key: String(key).trim() });
    
    if (keyDoc) {
      // Explicit payload filtering to protect internal document hooks
      res.json({ 
        apiKey: keyDoc.key, 
        user: {
          _id: keyDoc._id,
          owner: keyDoc.owner,
          role: keyDoc.role
        } 
      });
    } else {
      res.status(401).json({ error: "Neteisingas raktas." });
    }
  } catch (err) {
    res.status(500).json({ error: "Serverio klaida login metu." });
  }
});

router.put('/me/update-key', auth(), async (req, res) => {
  try {
    const { newKey } = req.body;
    
    // Strict enforcement for user updates
    if (!newKey || String(newKey).trim().length < 5) {
      return res.status(400).json({ error: "Per trumpas raktas. Turi būti bent 5 simboliai." });
    }

    const trimmedNewKey = String(newKey).trim();

    // Verify nobody else is already claiming this updated key
    const duplicate = await ApiKey.findOne({ key: trimmedNewKey, _id: { $ne: req.user._id } }).lean();
    if (duplicate) {
      return res.status(400).json({ error: "Šis raktas jau užimtas." });
    }

    req.user.key = trimmedNewKey;
    await req.user.save();
    
    res.json({ message: "Pakeista", newKey: trimmedNewKey });
  } catch (err) { 
    res.status(500).json({ error: "Klaida keičiant raktą." }); 
  }
});

export default router;