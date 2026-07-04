import express from 'express';
import { ApiKey } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

const MIN_KEY_LENGTH = 5;
const ALLOWED_ROLES = ['admin', 'marketing'];

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const keys = await ApiKey.find().select('owner key role').lean();
    res.json(keys);
  } catch (err) { 
    res.status(500).json({ error: "KEY_FETCH_ERROR" }); 
  }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { owner, key, role } = req.body;

    if (!owner || !owner.trim()) {
      return res.status(400).json({ error: "KEY_OWNER_REQUIRED" });
    }

    if (!key || String(key).trim().length < MIN_KEY_LENGTH) {
      return res.status(400).json({ error: "KEY_TOO_SHORT" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: "KEY_INVALID_ROLE" });
    }

    const trimmedOwner = owner.trim();
    const trimmedKey = key.trim();

    const ownerExists = await ApiKey.findOne({ owner: trimmedOwner }).lean();
    if (ownerExists) {
      return res.status(400).json({ error: "KEY_DUPLICATE_OWNER" });
    }

    const keyExists = await ApiKey.findOne({ key: trimmedKey }).lean();
    if (keyExists) {
      return res.status(400).json({ error: "KEY_DUPLICATE" });
    }

    const newKeyDoc = new ApiKey({ 
      owner: trimmedOwner, 
      key: trimmedKey, 
      role 
    });
    
    await newKeyDoc.save();
    res.status(201).json(newKeyDoc);
  } catch (err) { 
    res.status(400).json({ error: "GLOBAL_VALIDATION_ERROR" }); 
  }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const targetKey = await ApiKey.findById(req.params.id);
    if (!targetKey) {
      return res.status(404).json({ error: "GLOBAL_NOT_FOUND" });
    }
    
    if (targetKey.role === 'admin') {
      return res.status(403).json({ error: "KEY_DELETE_ADMIN_FORBIDDEN" });
    }
    
    await ApiKey.findByIdAndDelete(req.params.id);
    res.json({ message: 'SUCCESS' });
  } catch (err) { 
    res.status(500).json({ error: "KEY_DELETE_ERROR" }); 
  }
});

export default router;