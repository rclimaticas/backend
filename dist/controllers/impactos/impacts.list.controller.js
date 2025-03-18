"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsListController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../utils/prisma");
class ImpactsListController {
    async index(req, res) {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.authToken;
        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            const userId = decoded.id;
            const impacts = await prisma_1.prisma.impacts.findMany({
                where: { userId },
                orderBy: { date: "desc" },
            });
            if (impacts.length === 0) {
                return res.status(404).json({ message: "Nenhum impacto encontrado para este usuário." });
            }
            res.status(200).json(impacts);
        }
        catch (error) {
            console.error("Erro ao decodificar token ou buscar impactos:", error);
            return res.status(500).json({ error: "Erro ao processar a requisição." });
        }
    }
}
exports.ImpactsListController = ImpactsListController;
