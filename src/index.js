import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import configRoutes from './routes/config.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/config', configRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
