"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaMaskLoginController = void 0;
const prisma_1 = require("../../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MetaMaskLoginController {
    async authenticate(req, res) {
        const metamaskAddress = req.body.metamaskAddress || req.body.address;
        // let email = `${metamaskAddress}@example.com`; caso der problema
        let email = `${metamaskAddress.slice(0, 6)}@example.com`;
        let username = `Usuário ${metamaskAddress.slice(0, 6)}`;
        if (!metamaskAddress) {
            return res.status(400).json({ error: "Endereço da carteira MetaMask é necessário!" });
        }
        try {
            if (!/^0x[a-fA-F0-9]{40}$/.test(metamaskAddress)) {
                return res.status(400).json({ error: "Endereço de carteira inválido!" });
            }
            let user = await prisma_1.prisma.user.findUnique({
                where: { metamaskAddress },
            });
            if (!user) {
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: email,
                        username: username,
                        imageBase64: "",
                        metamaskAddress,
                        password: process.env.API_PASSWORD,
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
            const userWithToken = {
                ...user,
                token: appToken,
            };
            console.log(userWithToken);
            return res.json({
                message: "Login bem-sucedido com Google!",
                user: userWithToken,
            });
        }
        catch (error) {
            console.error("Erro na autenticação com MetaMask:", error);
            return res.status(500).json({ error: "Erro ao autenticar com MetaMask." });
        }
    }
}
exports.MetaMaskLoginController = MetaMaskLoginController;
