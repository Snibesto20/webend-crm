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
    const newKey = new ApiKey(req.body);
    await newKey.save();
    res.status(201).json(newKey);
  } catch (err) { res.status(400).json({ error: "Raktas jau yra." }); }
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