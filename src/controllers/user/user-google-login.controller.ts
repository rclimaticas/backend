import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleLoginController {
    async authenticate(req: Request, res: Response) {
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

            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: email || "",
                        username: name || "Usuário do Google",
                        imageBase64: picture || "",
                        password: process.env.GOOGLE_PASSWORD as string,
                    },
                });
            }

            const appToken = jwt.sign(
                { id: user.id },
                process.env.SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            res.cookie("authToken", appToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.json({ message: "Login bem-sucedido com Google!", token: appToken });
        } catch (error) {
            console.error("Erro na autenticação com Google:", error);
            return res.status(500).json({ error: "Erro ao autenticar com Google." });
        }
    }
}
