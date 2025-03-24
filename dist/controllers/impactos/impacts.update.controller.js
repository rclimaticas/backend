"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsUpdateController = void 0;
const prisma_1 = require("../../utils/prisma");
class ImpactsUpdateController {
    async update(req, res) {
        const { id } = req.params;
        const { subject, urgency, locality, support, affectedCommunity, biomes, situation, contribution, date, validated, } = req.body;
        try {
            const existingImpact = await prisma_1.prisma.impacts.findUnique({
                where: { id: Number(id) },
            });
            if (!existingImpact) {
                return res.status(404).json({ message: "Impacto não encontrado." });
            }
            const updatedImpact = await prisma_1.prisma.impacts.update({
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
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao atualizar o impacto." });
        }
    }
}
exports.ImpactsUpdateController = ImpactsUpdateController;
