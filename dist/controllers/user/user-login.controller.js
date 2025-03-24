"use strict";
// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
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
    constructor() {
        this.authorizedEmails = process.env.AUTHORIZED_EMAILS
            ? process.env.AUTHORIZED_EMAILS.split(",")
            : [];
        this.authenticate = this.authenticate.bind(this);
    }
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
        const role = this.authorizedEmails.includes(email) ? 'admin' : 'user';
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: role }, process.env.SECRET_KEY, { expiresIn: "1d" });
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.json({ message: "Login bem-sucedido!", token, role });
    }
}
exports.UserLoginController = UserLoginController;
