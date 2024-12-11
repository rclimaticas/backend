"use strict";
// import { Request, Response } from 'express';
// import { prisma } from '../../../utils/prisma';
// import nodemailer from 'nodemailer';
// import ExcelJS from 'exceljs';
// import { Buffer } from 'buffer';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileGetController = void 0;
const prisma_1 = require("../../../utils/prisma");
class ProfileGetController {
    async index(req, res) {
        try {
            const users = await prisma_1.prisma.user.findMany();
            res.status(200).json(users);
        }
        catch (error) {
            console.error("Erro ao listar os usuários:", error);
            res.status(500).json({ error: "Erro ao buscar os usuários." });
        }
    }
}
exports.ProfileGetController = ProfileGetController;
