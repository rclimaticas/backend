"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
const nodemailer = __importStar(require("nodemailer"));
class NewsletterCreateController {
    async store(req, res) {
        const { name, email } = req.body;
        try {
            const newNewsletter = await prisma_1.prisma.newsletter.create({
                data: {
                    name,
                    email,
                    date: new Date()
                },
            });
            const transporter = nodemailer.createTransport({
                host: 'mail.privateemail.com',
                port: 465, // ou 587 para TLS
                secure: true, // true para 465, false para outras portas
                auth: {
                    user: 'vitor@ligacolaborativa.site',
                    pass: process.env.PASSWORD_EMAIL,
                },
            });
            let mailOptions = {
                from: 'vitor@ligacolaborativa.site',
                to: 'jvittor.contatos@gmail.com',
                subject: 'Novo Email cadastrado na Newsletter',
                text: `
                    Um novo email foi cadastrado na Newsletter:
                    Email: ${email},
                    Nome: ${name}
                    Data: ${new Date().toISOString()}
                `,
            };
            // enviando o email
            await transporter.sendMail(mailOptions);
            res.status(201).json(newNewsletter);
        }
        catch (error) {
            res.status(500).json({ error: "Erro ao criar o material." });
        }
    }
}
exports.NewsletterCreateController = NewsletterCreateController;
