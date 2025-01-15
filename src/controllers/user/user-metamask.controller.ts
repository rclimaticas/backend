import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class MetaMaskLoginController {
    async authenticate(req: Request, res: Response) {
        const metamaskAddress = req.body.metamaskAddress || req.body.address;

        if (!metamaskAddress) {
            return res.status(400).json({ error: "Endereço da carteira MetaMask é necessário!" });
        }

        try {
            if (!/^0x[a-fA-F0-9]{40}$/.test(metamaskAddress)) {
                return res.status(400).json({ error: "Endereço de carteira inválido!" });
            }

            let user = await prisma.user.findUnique({
                where: { metamaskAddress },
            });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        email: "",
                        username: "Usuário",
                        imageBase64: "", 
                        metamaskAddress,
                        password: process.env.API_PASSWORD as string,
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


            return res.json({ message: "Login bem-sucedido com MetaMask!", token: appToken });
        } catch (error) {
            console.error("Erro na autenticação com MetaMask:", error);
            return res.status(500).json({ error: "Erro ao autenticar com MetaMask." });
        }
    }
}
