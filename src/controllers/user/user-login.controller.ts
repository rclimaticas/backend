import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserLoginController {
    async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }
        const token = jwt.sign(
            { id: user.id }, 
            process.env.SECRET_KEY as string, 
            { expiresIn: "1d" }
        );        

        res.cookie('authToken', token, {
            httpOnly: true, // Torna o cookie acessível no JavaScript
            secure: true, // Altere para true em produção (com HTTPS)
            sameSite: 'none', // Ajuste para lax ou none se for usar requisições cruzadas
            maxAge: 24 * 60 * 60 * 1000, // 1 dia
          });
          
                   

        return res.json({ message: "Login bem-sucedido!", token });
    }
}

// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// // Carrega as variáveis de ambiente
// dotenv.config();

// export class UserLoginController {
//     async authenticate(req: Request, res: Response) {
//         const { email, password } = req.body;

//         const user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             return res.json({ error: "Usuário não encontrado!" });
//         }

//         const isValuePassword = await bcrypt.compare(password, user.password);

//         if (!isValuePassword) {
//             return res.json({ error: "Senha está incorreta!" });
//         }

//         // Obtenha o segredo do JWT das variáveis de ambiente
//         const secret = process.env.SECRET_KEY;
//         if (!secret) {
//             return res.status(500).json({ error: "SECRET_KEY não está definido!" });
//         }

//         const token = jwt.sign({ id: user.id }, secret, { expiresIn: "1d" });

//         return res.json({ user, token });
//     }
// }

// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// export class UserLoginController {
//     async authenticate(req: Request, res: Response) {
//         const {email, password} = req.body;
        
//         const user = await prisma.user.findUnique({ where: { email } });
        
//         if(!user) {
//             return res.json({ error: "usuario não encontrado ein!"})
//         }

//         const isValuePassword = await bcrypt.compare(password, user.password);

//         if(!isValuePassword) {
//             return res.json({ error: "senha esta incorreta ein!"})
//         }
        
//         const token = jwt.sign({ id: user.id }, "aFJlZXRGaWxl", { expiresIn: "1d" });
       
//         return res.json({ user, token })
//     }
// }