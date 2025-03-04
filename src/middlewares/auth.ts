// import { NextFunction, Request, Response } from "express";
// import * as jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // Carrega as variáveis de ambiente
// dotenv.config();

// type TokenPayload = {
//     id: string;
//     iat: number;
//     exp: number;
// };

// interface CustomRequest extends Request {
//     userId?: string; // userId como opcional
// }

// export function AuthMiddleware(
//     req: CustomRequest,
//     res: Response,
//     next: NextFunction
// ) {
//     const { authorization } = req.headers;

//     console.log("Authorization Header:", authorization);

//     if (!authorization) {
//         return res.status(401).json({ error: "Token não fornecido" });
//     }

//     const parts = authorization.split(" ");
//     if (parts.length !== 2 || parts[0] !== "Bearer") {
//         return res.status(401).json({ error: "Formato do token inválido" });
//     }

//     const token = parts[1];
//     console.log("Token:", token);

//     try {
//         const secret = process.env.SECRET_KEY;

//         console.log("SECRET_KEY:", secret);
//         if (!secret) {
//             throw new Error("SECRET_KEY não está definido no .env");
//         }

//         const decoded = jwt.verify(token, secret) as TokenPayload;

//         if (!decoded || !decoded.id) {
//             throw new Error("Token inválido: id não encontrado");
//         }

//         console.log("Decoded User ID:", decoded.id);

//         req.userId = decoded.id;
//         next();
//     } catch (error) {
//         console.error("Erro ao verificar o token:", error);
//         return res.status(401).json({ error: "Token inválido" });
//     }
// }

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

interface CustomRequest extends Request {
    userId?: string;
}

export function AuthMiddleware(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    // Obtém o token do cookie
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const secret = process.env.SECRET_KEY;

        if (!secret) {
            throw new Error("SECRET_KEY não está definido no .env");
        }

        // Decodifica o token usando a chave secreta
        const decoded = jwt.verify(token, secret) as TokenPayload;

        // Verifica se o token é válido e contém o ID do usuário
        if (!decoded || !decoded.id) {
            throw new Error("Token inválido: id não encontrado");
        }

        // Armazena o ID do usuário no objeto req
        req.userId = decoded.id;
        next(); 
    } catch (error) {
        console.error("Erro ao verificar o token:", error);
        return res.status(401).json({ error: "Token inválido" });
    }
}
