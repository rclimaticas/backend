"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginController = void 0;
const prisma_1 = require("../../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const google_auth_library_1 = require("google-auth-library");
dotenv_1.default.config();
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class GoogleLoginController {
    async authenticate(req, res) {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Token do Google é necessário!" });
        }
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                return res.status(401).json({ error: "Token inválido ou expirado." });
            }
            const { email, name, picture } = payload;
            let user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: email || "",
                        username: name || "Usuário do Google",
                        imageBase64: picture || "",
                        password: process.env.API_PASSWORD,
                        metamaskAddress: "",
                    },
                });
            }
            const appToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.cookie("authToken", appToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.json({ message: "Login bem-sucedido com Google!", token: appToken });
        }
        catch (error) {
            console.error("Erro na autenticação com Google:", error);
            return res.status(500).json({ error: "Erro ao autenticar com Google." });
        }
    }
}
exports.GoogleLoginController = GoogleLoginController;
