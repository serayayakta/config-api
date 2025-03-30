import express from 'express';
import { db } from '../firebase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doc = await db.collection('config').doc('main').get();
    res.json(doc.exists ? doc.data() : {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

export default router;
