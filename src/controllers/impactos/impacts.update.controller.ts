import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class ImpactsUpdateController {
    async update(req: Request, res: Response) {
        const { id } = req.params;
        const {
            subject,
            urgency,
            locality,
            support,
            affectedCommunity,
            biomes,
            situation,
            contribution,
            date,
            validated,
        } = req.body;

        try {
            const existingImpact = await prisma.impacts.findUnique({
                where: { id: Number(id) },
            });

            if (!existingImpact) {
                return res.status(404).json({ message: "Impacto não encontrado." });
            }
            const updatedImpact = await prisma.impacts.update({
                where: { id: Number(id) },
                data: {
                    subject,
                    urgency,
                    locality,
                    support,
                    affectedCommunity,
                    biomes,
                    situation,
                    contribution,
                    date,
                    validated,
                },
            });

            res.status(200).json({
                message: "Impacto atualizado com sucesso.",
                impact: updatedImpact,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar o impacto." });
        }
    }
}
