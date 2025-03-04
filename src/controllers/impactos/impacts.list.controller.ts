import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";

export class ImpactsListController {
    async index(req: Request, res: Response) {

        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
            const userId = decoded.id;

            const impacts = await prisma.impacts.findMany({
                where: { userId },
                orderBy: { date: "desc" },
            });

            if (impacts.length === 0) {
                return res.status(404).json({ message: "Nenhum impacto encontrado para este usuário." });
            }

            res.status(200).json(impacts);
        } catch (error) {
            console.error("Erro ao decodificar token ou buscar impactos:", error);
            return res.status(500).json({ error: "Erro ao processar a requisição." });
        }
    }
}
