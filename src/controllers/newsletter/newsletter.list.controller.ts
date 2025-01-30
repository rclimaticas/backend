import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export class NewsletterListController {

  getEmails = async (req: Request, res: Response) => {
    try {
      const emails = await prisma.newsletter.findMany({
        select: {
          email: true, 
        },
      });

      if (emails.length === 0) {
        return res.status(404).json({ message: "Nenhum e-mail encontrado." });
      }

      return res.status(200).json(emails);
    } catch (error) {
      console.error("Erro ao buscar os e-mails:", error);
      return res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  };
}
