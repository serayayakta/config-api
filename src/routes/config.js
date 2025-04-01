import express from 'express';
import { db } from '../firebase.js';
import admin from 'firebase-admin';

const router = express.Router();

const API_KEY = process.env.API_KEY;

router.get('/', async (req, res) => {
  const clientKey = req.header('x-api-key');

  if (clientKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const docSnap = await db.collection('config').doc('main').get();

    if (docSnap.exists) {
      const data = docSnap.data();
      res.json(data);
    } else {
      res.status(404).json({ error: 'Config not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:key', async (req, res) => {
  const clientKey = req.header('x-api-key');
  if (clientKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { value, description, clientUpdatedAt } = req.body;
  const { key } = req.params;

  if (!value || !clientUpdatedAt) {
    return res.status(400).json({ error: 'Missing value or updated timestamp' });
  }

  try {
    const docRef = db.collection('config').doc('main');
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const current = docSnap.data()?.[key];

    if (!current) {
      return res.status(404).json({ error: 'Key not found' });
    }

    // Conflict detection
    if (current.updatedAt && current.updatedAt !== clientUpdatedAt) {
      return res.status(409).json({ error: 'Conflict detected' });
    }

    const updatedAt = Date.now();

    await docRef.update({
      [key]: {
        ...current,
        value,
        description: description || '',
        updatedAt,
      },
    });

    res.json({ success: true, updatedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

router.delete('/:key', async (req, res) => {
  const clientKey = req.header('x-api-key');
  if (clientKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { key } = req.params;

  try {
    const docRef = db.collection('config').doc('main');
    await docRef.update({
      [key]: admin.firestore.FieldValue.delete(),
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete field:', err);
    res.status(500).json({ error: 'Failed to delete field' });
  }
});

export default router;
