import express from 'express';
import { ApiKey } from '../models.js';

const router = express.Router();

router.get('/me', async (req, res) => {
  const userKey = req.headers['x-api-key'];
  if (!userKey) return res.status(401).json({ error: "Nėra rakto." });
  
  const keyDoc = await ApiKey.findOne({ key: userKey });
  if (!keyDoc) return res.status(401).json({ error: "Sesija negalioja." });

  res.json(keyDoc);
});

router.get('/', async (req, res) => {
  try {
    const users = await ApiKey.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Klaida gaunant vartotojus" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await ApiKey.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Vartotojas nerastas" });
    }
    res.status(200).json({ message: "Vartotojas sėkmingai pašalintas" });
  } catch (error) {
    res.status(500).json({ message: "Klaida šalinant vartotoją" });
  }
});

export default router;