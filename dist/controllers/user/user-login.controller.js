"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLoginController = void 0;
const prisma_1 = require("../../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserLoginController {
    async authenticate(req, res) {
        const { email, password } = req.body;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }
        // Gerar o token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
        // Configurar o cookie
        res.cookie("authToken", token, {
            httpOnly: true, // Impede acesso ao cookie via JavaScript
            secure: process.env.NODE_ENV === "production", // Requer HTTPS em produção
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ message: "Login bem-sucedido!", token });
    }
}
exports.UserLoginController = UserLoginController;
