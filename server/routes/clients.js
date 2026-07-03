import express from 'express';
import { Client } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

router.get('/', auth(['admin', 'marketing']), async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) { 
    res.status(500).json({ error: `Nepavyko gauti klientų sąrašo: ${err.message}` }); 
  }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, contacts, tag } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Klaida: Įmonės pavadinimas yra privalomas ir negali būti tuščias." });
    }
    if (!contacts || !Array.isArray(contacts) || contacts.filter(c => c.trim() !== '').length === 0) {
      return res.status(400).json({ error: "Klaida: Būtina pridėti bent vieną validų kontaktą (El. paštą arba Tel. nr.)." });
    }
    if (!tag) {
      return res.status(400).json({ error: "Klaida: Nepasirinktas kliento statusas." });
    }

    const nameUpper = name.trim().toUpperCase();
    const exists = await Client.findOne({ name: nameUpper });
    if (exists) {
      return res.status(400).json({ error: `Klaida: Klientas su pavadinimu "${nameUpper}" jau egzistuoja sistemoje.` });
    }

    const clientData = {
      ...req.body,
      name: nameUpper,
      marketer: req.user?.owner || 'Nenurodyta'
    };

    const newClient = new Client(clientData);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) { 
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ error: `Duomenų validacijos klaida: ${messages}` });
    }
    res.status(400).json({ error: `Nepavyko sukurti kliento paskyros: ${err.message}` }); 
  }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.name !== undefined && !updateData.name.trim()) {
      return res.status(400).json({ error: "Klaida redaguojant: Įmonės pavadinimas negali būti tuščias tekstas." });
    }
    if (updateData.contacts !== undefined && (!Array.isArray(updateData.contacts) || updateData.contacts.filter(c => c.trim() !== '').length === 0)) {
      return res.status(400).json({ error: "Klaida redaguojant: Kontaktų sąrašas negali likti visiškai tuščias." });
    }

    if (updateData.name) {
      updateData.name = updateData.name.trim().toUpperCase();
      const duplicateExists = await Client.findOne({ name: updateData.name, _id: { $ne: id } });
      if (duplicateExists) {
        return res.status(400).json({ error: `Klaida: Pavadinimas "${updateData.name}" jau užimtas kito kliento.` });
      }
    }

    const updated = await Client.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updated) return res.status(404).json({ error: "Atnaujinimo klaida: Klientas nerastas sistemoje arba jau ištrintas." });
    res.json(updated);
  } catch (err) { 
    res.status(400).json({ error: `Nepavyko atnaujinti kliento duomenų: ${err.message}` }); 
  }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Trinimo klaida: Nerastas pasirenkamas klientas." });
    res.json({ message: 'Klientas sėkmingai pašalintas iš sistemos.' });
  } catch (err) { 
    res.status(500).json({ error: `Nepavyko ištrinti kliento iš duomenų bazės: ${err.message}` }); 
  }
});

export default router;