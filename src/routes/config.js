import express from 'express';
import { db } from '../firebase.js';

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

export default router;
