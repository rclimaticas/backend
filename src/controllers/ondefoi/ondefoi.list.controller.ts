import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class OndeFoiListController {
  async index(req: Request, res: Response) {
    try {
      console.log("📥 Recebendo solicitação para listar entradas do OndeFoi");
      
      const entries = await prisma.ondeFoi.findMany({
        orderBy: { date: "desc" },
      });
      
      console.log("✅ Entradas encontradas:", entries.length);
      return res.status(200).json(entries);
    } catch (error) {
      console.error("🚨 Erro ao buscar as entradas do OndeFoi:", error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
