import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import trialsRouter from './routes/trials.js';
import bookmarksRouter from './routes/bookmarks.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/trials', trialsRouter);
app.use('/api/bookmarks', bookmarksRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});