"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterController = void 0;
const prisma_1 = require("../../utils/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRegisterController {
    async store(req, res) {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, senha e nome são obrigatórios!" });
        }
        const userByEmail = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (userByEmail) {
            return res.status(400).json({ error: "E-mail já está em uso!" });
        }
        const hash_password = await bcryptjs_1.default.hash(password, 8);
        let username = name.toLowerCase().replace(/\s+/g, "_");
        let uniqueUsername = username;
        let counter = 1;
        while (await prisma_1.prisma.user.findUnique({ where: { username: uniqueUsername } })) {
            uniqueUsername = `${username}${counter}`;
            counter++;
        }
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                username: uniqueUsername,
                password: hash_password,
                name,
                metamaskAddress: null,
            },
        });
        return res.status(201).json({ user });
    }
}
exports.UserRegisterController = UserRegisterController;
