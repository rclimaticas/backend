// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";
// import { router } from './routes';

// dotenv.config();

// const app = express();

// // Configuração do CORS para permitir cookies e definir origem específica
// const corsOptions = {
//   origin: 'https://expert-space-goldfish-x5rv5j4jwg4rfpqw7-3000.app.github.dev', // Substitua pelo seu domínio frontend
//   credentials: true,  // Permite o envio de cookies com as requisições
// };

// app.use(cors(corsOptions));
// app.use(cookieParser());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(router);

// const email = process.env.EMAIL_SLEEP;
// const password = process.env.EMAIL_PASSWORD;

// // setInterval(() => {
// //   axios.post('https://backend-rclimaticas-2.onrender.com/login', {
// //     email,
// //     password,
// //   })
// //   .then(response => {
// //     console.log('Resposta do servidor:', response.data);
// //   })
// //   .catch(error => {
// //     console.error('Erro ao enviar o request:', error.message);
// //   });
// // }, 180000); 

// const PORT = process.env.PORT || 3333;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { router } from './routes';
import axios from 'axios';

dotenv.config();

const app = express();

// Configuração do CORS para permitir cookies e definir origem específica
const corsOptions = {
  origin: process.env.API_URL as string, // Substitua pelo seu domínio frontend
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const email = process.env.EMAIL_SLEEP;
const password = process.env.EMAIL_PASSWORD;

// setInterval(() => {
//   axios.post('https://backend-rclimaticas-2.onrender.com/login', {
//     email,
//     password,
//   })
//   .then(response => {
//     console.log('Resposta do servidor:', response.data);
//   })
//   .catch(error => {
//     console.error('Erro ao enviar o request:', error.message);
//   });
// }, 180000);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
