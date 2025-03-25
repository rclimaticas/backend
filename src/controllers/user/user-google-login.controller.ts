import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

// dotenv.config();

// export class GoogleLoginController {
//   async authenticate(req: Request, res: Response) {
//     const { tokenGoogle } = req.body;

//     if (!tokenGoogle) {
//       return res.status(400).json({ error: "Token do Google é necessário!" });
//     }

//     try {

//       const userInfoResponse = await axios.get(
//         `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`
//       );

//       const { email, name, picture } = userInfoResponse.data;

//       console.log("Informações do usuário:", userInfoResponse.data);

//       let user = await prisma.user.findUnique({ where: { email } });

//       if (!user) {
//         user = await prisma.user.create({
//           data: {
//             email: email || "",
//             username: name || "Usuário do Google",
//             imageBase64: picture || "",
//             password: process.env.API_PASSWORD as string,
//             metamaskAddress: null,
//           },
//         });
//       }

//       const token = jwt.sign(
//         { id: user.id },
//         process.env.SECRET_KEY as string,
//         { expiresIn: "1d" }
//       );

//       res.cookie('authToken', token, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'none',
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       const userWithToken = {
//         ...user,
//         token,
//       };

//       console.log(userWithToken)


//       return res.json({
//         message: "Login bem-sucedido com Google!",
//         user: userWithToken,
//       });


//     } catch (error) {
//       console.error("Erro na autenticação com Google:", error);
//       return res.status(500).json({ error: "Erro ao autenticar com Google." });
//     }
//   }
// }

dotenv.config();

export class GoogleLoginController {
  private authorizedEmails: string[] = process.env.AUTHORIZED_EMAILS
    ? process.env.AUTHORIZED_EMAILS.split(",")
    : [];

  constructor() {
    this.authenticate = this.authenticate.bind(this);
  }
  async authenticate(req: Request, res: Response) {
    const { tokenGoogle } = req.body;

    if (!tokenGoogle) {
      return res.status(400).json({ error: "Token do Google é necessário!" });
    }

    try {
      const userInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`
      );

      const { email, name, picture } = userInfoResponse.data;

      console.log("Informações do usuário:", userInfoResponse.data);

      let user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email || "",
            username: name || "Usuário do Google",
            imageBase64: picture || "",
            password: process.env.API_PASSWORD as string,
            metamaskAddress: null,
          },
        });
      }

      const role = this.authorizedEmails.includes(email) ? 'admin' : 'user';

      const token = jwt.sign(
        { id: user.id, role: role },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
      });

      const userWithToken = {
        ...user,
        token,
        role,
      };

      console.log(userWithToken);

      return res.json({
        message: "Login bem-sucedido com Google!",
        user: userWithToken,
      });
    } catch (error) {
      console.error("Erro na autenticação com Google:", error);
      return res.status(500).json({ error: "Erro ao autenticar com Google." });
    }
  }
}
