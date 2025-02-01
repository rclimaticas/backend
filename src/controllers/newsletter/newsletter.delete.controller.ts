import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class NewsletterDeleteController {
  deleteAllEmails = async (req: Request, res: Response) => {
    try {
      const deletedEmails = await prisma.newsletter.deleteMany({});

      if (deletedEmails.count === 0) {
        return res.status(404).json({ message: "Nenhum e-mail encontrado para exclusão." });
      }

      return res.status(200).json({ message: "Todos os e-mails foram removidos da whitelist." });
    } catch (error) {
      console.error("Erro ao apagar os e-mails da whitelist:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  };
}
