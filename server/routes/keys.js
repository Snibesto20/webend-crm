import express from 'express';
import { ApiKey } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const keys = await ApiKey.find();
    res.json(keys);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { owner, key, role } = req.body;

    if (!key || key.trim().length < 5) {
      return res.status(400).json({ error: "API raktas privalo būti ne trumpesnis nei 5 simboliai." });
    }

    const newKey = new ApiKey({ owner, key: key.trim(), role });
    await newKey.save();
    res.status(201).json(newKey);
  } catch (err) { res.status(400).json({ error: "Raktas jau yra sistemoje." }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const key = await ApiKey.findById(req.params.id);
    if (key?.role === 'admin') return res.status(403).json({ error: "Adminų trinti negalima." });
    await ApiKey.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ištrinta' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;