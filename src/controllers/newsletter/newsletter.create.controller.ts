import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import * as nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";

export class NewsletterCreateController {
  generateSecurePassword = () => {
    const password = crypto.randomBytes(16).toString("base64");
    return password.replace(/[^a-zA-Z0-9]/g, "");
  };

  store = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
      let user = await prisma.user.findUnique({
        where: { email },
      });

      let password;

      if (!user) {
        password = this.generateSecurePassword();

        user = await prisma.user.create({
          data: {
            name,
            email,
            password,
            username: `user_${Date.now()}`,
          },
        });

        console.log(`Usuário ${name} (${email}) cadastrado com sucesso.`);
      } else {
        password = user.password;
        console.log(`Usuário ${name} (${email}) já existente. Usando senha existente.`);
      }

      const newNewsletter = await prisma.newsletter.create({
        data: {
          name,
          email,
          date: new Date(),
        },
      });

      const transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        secure: true,
        auth: {
          user: "vitor@ligacolaborativa.site",
          pass: process.env.PASSWORD_EMAIL,
        },
      });

      const mailOptions = {
        from: "vitor@ligacolaborativa.site",
        to: `${email}`,
        subject: "Informações de Cadastro na Newsletter",
        html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>E-mail com Fundo Branco Centralizado</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #d3d3d3;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px;">
                                <tr>
                                    <td align="center" style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;">
                                        <img src="https://rclimaticas-fileupload.s3.sa-east-1.amazonaws.com/logoLC-DRqUmzjb.png" width="100" alt="Logo" style="display: block;"/>
                                        <h2 style="color: #4A90E2; font-size: 28px;">Olá, ${name}, parabéns!</h2>
                                        <p style="font-size: 25px; line-height: 1.6; text-align: center;">
                                            Seu cadastro foi realizado com sucesso.<br><br>
                                            Na natureza tudo é evolução... Evolução vem das experiências... <strong>E a Liga Colaborativa está evoluindo!</strong><br><br>
                                            Estamos dando mais um passo para uma <strong>Nova Versão da Plataforma Colaborativa</strong>, com solução de bugs, novas funcionalidades e uma melhor experiência do usuário.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="background-color: #000000; padding: 20px; color: #ffffff;">
                                        <a href="#" style="display: block; margin-bottom: 20px;">
                                            <img src="https://res.cloudinary.com/dw4jmcntj/image/upload/v1738267140/y2smwgdioixgt1hcqgdn.png" width="300" alt="NFT" style="display: block;"/>
                                        </a>
                                        <a href="#" style="display: inline-block; padding: 12px 24px; background-color: orange; color: black; text-decoration: none; font-size: 25px; font-weight: bold; text-align: center; font-family: Arial, sans-serif;">RESGATE SEU NFT</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px; font-family: Arial, sans-serif; color: #777777; font-size: 16px;">
                                        <p>&copy; 2025 Liga Colaborativa dos Povos. Todos os direitos reservados.</p>
                                        <p>
                                            <a href="#" style="margin: 0 10px;">
                                                <img src="https://img.icons8.com/?size=100&id=g7SBGFwja0xa&format=png&color=000000" width="30" alt="Ícone 1" style="display: inline-block;"/>
                                            </a>
                                            <a href="#" style="margin: 0 10px;">
                                                <img src="https://img.icons8.com/?size=100&id=Fto28UC6Owy0&format=png&color=000000" width="30" alt="Ícone 2" style="display: inline-block;"/>
                                            </a>
                                            <a href="#" style="margin: 0 10px;">
                                                <img src="https://img.icons8.com/?size=100&id=h7SY5uPzkIHw&format=png&color=000000" width="30" alt="Ícone 3" style="display: inline-block;"/>
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log(`E-mail enviado para ${email} com sucesso.`);
      res.status(201).json(newNewsletter);
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      res.status(500).json({ error: "Erro ao processar a requisição." });
    }
  };
}
