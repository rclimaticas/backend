import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import uploadRouter from './upload';
import { router } from './routes';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(router);

const authUrl = process.env.AUTH_URL || '';
const requestUrl = process.env.REQUEST_URL || '';
const loginData = {
  email: process.env.EMAIL_SLEEP || '',
  password: process.env.EMAIL_PASSWORD || ''
};
let accessToken: string | null = null;

async function login() {
  try {
    const response = await axios.post(authUrl, loginData);
    accessToken = response.data.token;
    console.log('Login bem-sucedido, token obtido:', accessToken);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro ao fazer login (Axios):', error.message, error.response?.data);
    } else if (error instanceof Error) {
      console.error('Erro ao fazer login:', error.message);
    } else {
      console.error('Erro desconhecido ao fazer login:', error);
    }
  }
}

async function makeRequest() {
  if (!accessToken) {
    console.error('Token de acesso não disponível. Tentando fazer login novamente.');
    await login();
  }

  if (accessToken) {
    try {
      const response = await axios.get(requestUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Response:', response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao fazer o request (Axios):', error.message, error.response?.data);
        if (error.response && error.response.status === 401) {
          accessToken = null;
          await login();
        }
      } else if (error instanceof Error) {
        console.error('Erro ao fazer o request:', error.message);
      } else {
        console.error('Erro desconhecido ao fazer o request:', error);
      }
    }
  }
}

setInterval(() => {
  console.log('Executando tarefa periódica...');
  makeRequest();
}, 180000);

app.listen(3333, () => console.log('Server is running'));
