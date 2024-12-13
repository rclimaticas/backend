import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
};

export function AuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization } = req.headers;

    console.log("Authorization Header:", authorization);

    if (!authorization) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    const [, token] = authorization.split(" ");
    console.log("Token:", token);

    try {
        const secret = process.env.SECRET_KEY;

        console.log("SECRET_KEY:", secret);
        if (!secret) {
            throw new Error("SECRET_KEY não está definido no .env");
        }

        const decoded = jwt.verify(token, secret) as TokenPayload;

        if (!decoded || !decoded.id) {
            throw new Error("Token inválido: id não encontrado");
        }

        console.log("Decoded User ID:", decoded.id);

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(401).json({ error: "s" });
    }
}
