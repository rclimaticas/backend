import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserLoginController {
    async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }

        // Gerar o token JWT
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY!, { expiresIn: "1d" });

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
