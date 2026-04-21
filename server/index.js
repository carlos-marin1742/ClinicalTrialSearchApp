import express from 'express';
import cors from 'cors';
import trialsRouter from './routes/trials.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/trials', trialsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});