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

  const { value, description } = req.body;
  const { key } = req.params;

  if (!value) return res.status(400).json({ error: 'Missing value' });

  try {
    const docRef = db.collection('config').doc('main');
    const docSnap = await docRef.get();
    const existingData = docSnap.exists ? docSnap.data() : {};
    const existingField = existingData[key];

    const now = new Date().toISOString();

    await docRef.update({
      [key]: {
        value,
        description: description || '',
        createdAt: existingField?.createdAt || now,
        updatedAt: now,
      },
    });

    res.json({ success: true });
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
