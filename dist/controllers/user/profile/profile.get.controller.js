"use strict";
// // import { Request, Response } from 'express';
// // import { prisma } from '../../../utils/prisma';
// // import nodemailer from 'nodemailer';
// // import ExcelJS from 'exceljs';
// // import { Buffer } from 'buffer';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileGetController = void 0;
const prisma_1 = require("../../../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ProfileGetController {
    constructor() {
        this.getUserIdFromToken = (token) => {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return decoded.id;
            }
            catch (error) {
                console.error("Erro ao decodificar o token:", error);
                return null;
            }
        };
        this.index = async (req, res) => {
            try {
                const users = await prisma_1.prisma.user.findMany();
                res.status(200).json(users);
            }
            catch (error) {
                console.error("Erro ao listar os usuários:", error);
                res.status(500).json({ error: "Erro ao buscar os usuários." });
            }
        };
        this.show = async (req, res) => {
            // Pega o token diretamente dos cookies
            const token = req.cookies['authToken'];
            if (!token) {
                res.status(401).json({ error: "Token de autenticação não fornecido." });
                return;
            }
            const userId = this.getUserIdFromToken(token);
            if (!userId) {
                res.status(401).json({ error: "Token inválido ou expirado." });
                return;
            }
            try {
                const user = await prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!user) {
                    res.status(404).json({ error: "Usuário não encontrado." });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Erro ao buscar o usuário:", error);
                res.status(500).json({ error: "Erro ao buscar o usuário." });
            }
        };
    }
}
exports.ProfileGetController = ProfileGetController;
