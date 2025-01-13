"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(routes_1.router);
const email = process.env.EMAIL_SLEEP;
const password = process.env.EMAIL_PASSWORD;
setInterval(() => {
    axios_1.default.post('https://backend-rclimaticas-2.onrender.com/login', {
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
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
