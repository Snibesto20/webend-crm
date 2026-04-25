import express from 'express';
import { Client } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

router.get('/', auth(['admin', 'marketing']), async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth(['admin', 'marketing']), async (req, res) => {
  try {
    const exists = await Client.findOne({ name: req.body.name.toUpperCase() });
    if (exists) return res.status(400).json({ error: "Klientas su tokiu pavadinimu jau egzistuoja." });

    const clientData = {
      ...req.body,
      name: req.body.name.toUpperCase(),
      marketer: req.user.owner 
    };

    const newClient = new Client(clientData);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Nerastas" });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Nerastas" });
    res.json({ message: 'Ištrinta' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;