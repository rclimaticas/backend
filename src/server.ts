import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import uploadRouter from './upload';

import { router } from './routes';

const app = express();
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(router);

app.listen(3333, () => console.log('Server is running'));