import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class ImpactsListGlobalController {
    async index(req: Request, res: Response) {
        try {
            const impacts = await prisma.impacts.findMany({
                orderBy: { date: 'desc' },
            });

            if (impacts.length === 0) {
                return res.status(404).json({ message: "Nenhum impacto encontrado." });
            }

            res.status(200).json(impacts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao listar os impactos." });
        }
    }
}
