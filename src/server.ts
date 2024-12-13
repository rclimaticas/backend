import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const email = process.env.EMAIL_SLEEP;
const password = process.env.EMAIL_PASSWORD;

setInterval(() => {
  axios.post('https://backend-rclimaticas-2.onrender.com/login', {
    email,
    password,
  })
  .then(response => {
    console.log('Resposta do servidor:', response.data);
  })
  .catch(error => {
    console.error('Erro ao enviar o request:', error.message);
  });
}, 180000); 

app.listen(3333, () => console.log('Server is running'));
