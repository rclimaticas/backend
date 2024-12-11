// import { NextFunction, Request, Response } from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";


// type TokenPayload = {
//     id: string;
//     iat: number;
//     exp: number;
// };

// export function AuthMiddleware(
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) {
//     const { authorization } = req.headers; 

//     if (!authorization) {
//         return res.status(401).json({ error: "token nao fornecido" });
//     }

//     const [, token]= authorization.split(" ");

//     try {
//         const decoded = jwt.verify(token, "my_secret");
//         const { id } = decoded as TokenPayload;

//         req.userId = id;
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "token invalido" });
//     }
// }

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        userId?: string;
    }
}

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    try {
        const secret = process.env.SECRET_KEY || "default_secret";
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.userId = decoded.id as string;
        next(); 
    } catch (error) {
        console.error("Erro ao verificar token");
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
}
