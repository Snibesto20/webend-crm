import express from 'express';
import { Client } from '../models.js';
import { auth } from '../middleware.js';

const router = express.Router();

const VALID_TAGS = [
  'potential 1', 'potential 2', 'potential 3', 'potential 4', 'potential 5',
  'potential 6', 'potential 7', 'potential 8', 'potential 9', 'potential 10',
  'pending', 'disapproved', 'unprocessed'
];

router.get('/', auth(['admin', 'marketing']), async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    res.json(clients);
  } catch (err) { 
    res.status(500).json({ code: 'CLIENT_FETCH_ERROR' }); 
  }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { name, contacts, tag, serviceNeeded, notes } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ code: 'CLIENT_NAME_REQUIRED' });
    }
    
    const normalizedTag = tag ? String(tag).trim().toLowerCase() : '';
    if (!VALID_TAGS.includes(normalizedTag)) {
      return res.status(400).json({ code: 'CLIENT_TAG_REQUIRED' });
    }

    const filteredContacts = Array.isArray(contacts) 
      ? contacts.map(c => String(c).trim()).filter(c => c !== '')
      : [];

    if (normalizedTag === 'unprocessed' && filteredContacts.length === 0) {
      return res.status(400).json({ code: 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' });
    }

    const nameUpper = name.trim().toUpperCase();
    const exists = await Client.findOne({ name: nameUpper }).lean();
    if (exists) {
      return res.status(400).json({ code: 'CLIENT_DUPLICATE_NAME', meta: { name: nameUpper } });
    }

    const isGhosted = normalizedTag === 'disapproved';

    const cleanClientData = {
      name: nameUpper,
      tag: normalizedTag,
      contacts: filteredContacts,
      serviceNeeded: isGhosted ? '' : (serviceNeeded ? String(serviceNeeded).trim().substring(0, 255) : ''),
      notes: notes ? String(notes).trim().substring(0, 2000) : '',
      marketer: req.user?.owner || 'Nenurodyta'
    };

    const newClient = new Client(cleanClientData);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (err) { 
    if (err.code === 'CLIENT_NAME_REQUIRED' || err.code === 'CLIENT_TAG_REQUIRED' || err.code === 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' || err.code === 'CLIENT_DUPLICATE_NAME') {
      return res.status(400).json({ code: err.code, meta: err.meta });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ code: 'GLOBAL_VALIDATION_ERROR' });
    }
    res.status(400).json({ code: 'CLIENT_CREATE_ERROR' }); 
  }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contacts, tag, serviceNeeded, notes } = req.body;
    
    const existingClient = await Client.findById(id);
    if (!existingClient) return res.status(404).json({ code: 'GLOBAL_NOT_FOUND' });

    const updateData = {};

    if (name !== undefined) {
      if (!name.trim()) return res.status(400).json({ code: 'CLIENT_NAME_REQUIRED' });
      const nameUpper = name.trim().toUpperCase();
      const duplicateExists = await Client.findOne({ name: nameUpper, _id: { $ne: id } }).lean();
      if (duplicateExists) {
        return res.status(400).json({ code: 'CLIENT_DUPLICATE_NAME', meta: { name: nameUpper } });
      }
      updateData.name = nameUpper;
    }

    if (tag !== undefined) {
      const normalizedTag = String(tag).trim().toLowerCase();
      if (!VALID_TAGS.includes(normalizedTag)) return res.status(400).json({ code: 'CLIENT_TAG_REQUIRED' });
      updateData.tag = normalizedTag;
    }

    const targetTag = updateData.tag || existingClient.tag;

    if (contacts !== undefined) {
      if (!Array.isArray(contacts)) return res.status(400).json({ code: 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' });
      const filteredContacts = contacts.map(c => String(c).trim()).filter(c => c !== '');
      if (targetTag === 'unprocessed' && filteredContacts.length === 0) {
        return res.status(400).json({ code: 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' });
      }
      updateData.contacts = filteredContacts;
    } else if (targetTag === 'unprocessed' && existingClient.contacts.length === 0) {
      return res.status(400).json({ code: 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' });
    }

    const isGhosted = targetTag === 'disapproved';
    if (isGhosted) {
      updateData.serviceNeeded = '';
    } else if (serviceNeeded !== undefined) {
      updateData.serviceNeeded = String(serviceNeeded).trim().substring(0, 255);
    }

    if (notes !== undefined) {
      updateData.notes = String(notes).trim().substring(0, 2000);
    }

    const updated = await Client.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    );
    
    res.json(updated);
  } catch (err) { 
    if (err.code === 'CLIENT_NAME_REQUIRED' || err.code === 'CLIENT_TAG_REQUIRED' || err.code === 'CLIENT_CONTACTS_REQUIRED_FOR_UNPROCESSED' || err.code === 'CLIENT_DUPLICATE_NAME') {
      return res.status(400).json({ code: err.code, meta: err.meta });
    }
    res.status(400).json({ code: 'CLIENT_UPDATE_ERROR' }); 
  }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const deleted = await Client.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ code: 'GLOBAL_NOT_FOUND' });
    res.json({ message: 'Klientas sėkmingai pašalintas iš sistemos.' });
  } catch (err) { 
    res.status(500).json({ code: 'CLIENT_DELETE_ERROR' }); 
  }
});

export default router;