import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class ImpactValidatedController {
    async store(req: Request, res: Response) {
        const {
            userId,
            subject,
            urgency,
            locality,
            support,
            affectedCommunity,
            biomes,
            situation,
            contribution,
            date,
        } = req.body;

        if (!userId || !subject || !urgency || !locality || !support || !affectedCommunity || !biomes || !situation || !contribution || !date) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }

        try {
            const impactValidated = await prisma.impactsValidated.create({
                data: {
                    userId, 
                    subject,
                    urgency,
                    locality,
                    support,
                    affectedCommunity,
                    biomes,
                    situation,
                    contribution,
                    date: new Date(date),
                },
            });

            return res.status(201).json(impactValidated);
        } catch (error) {
            console.error("Erro ao processar a requisição ou validar impacto:", error);
            return res.status(500).json({ error: "Erro ao processar a requisição." });
        }
    }
}
