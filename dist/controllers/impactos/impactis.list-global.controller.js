"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsListGlobalController = void 0;
const prisma_1 = require("../../utils/prisma");
class ImpactsListGlobalController {
    async index(req, res) {
        try {
            const impacts = await prisma_1.prisma.impacts.findMany({
                orderBy: { date: 'desc' },
            });
            if (impacts.length === 0) {
                return res.status(404).json({ message: "Nenhum impacto encontrado." });
            }
            res.status(200).json(impacts);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao listar os impactos." });
        }
    }
}
exports.ImpactsListGlobalController = ImpactsListGlobalController;
