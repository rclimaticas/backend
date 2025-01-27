// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import * as nodemailer from 'nodemailer';

// export class NewsletterCreateController {
//     async store(req: Request, res: Response) {
//         const { name, email } = req.body;

//         try {
//             const newNewsletter = await prisma.newsletter.create({
//                 data: {
//                     name,
//                     email,
//                     date: new Date() 
//                 },
//             });
//             const transporter = nodemailer.createTransport({
//                 host: 'mail.privateemail.com',
//                 port: 465,
//                 secure: true,
//                 auth: {
//                     user: 'vitor@ligacolaborativa.site',
//                     pass: process.env.PASSWORD_EMAIL,
//                 },
//             });
//             let mailOptions = {
//                 from: 'vitor@ligacolaborativa.site',
//                 to: `${email}`,
//                 subject: 'Novo Email cadastrado na Newsletter',
//                 text: `
//                     Um novo email foi cadastrado na Newsletter:
//                     Email: ${email},
//                     Nome: ${name}
//                     Data: ${new Date().toISOString()}
//                 `,
//             };

//             // enviando o email
//             await transporter.sendMail(mailOptions);
//             res.status(201).json(newNewsletter);
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao criar o material." });
//         }
//     }
// }


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
        text: `
          Olá ${name},

          Obrigado por se cadastrar na nossa Newsletter!

          Aqui estão suas informações de login:
          Email: ${email}

          Mantenha essas informações em segurança.

          Data de cadastro: ${new Date().toISOString()}
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

