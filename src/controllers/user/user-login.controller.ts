// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export class UserLoginController {
//     async authenticate(req: Request, res: Response) {
//         const { email, password } = req.body;

//         const user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ error: "Usuário não encontrado!" });
//         }

//         const isValidPassword = await bcrypt.compare(password, user.password);

//         if (!isValidPassword) {
//             return res.status(401).json({ error: "Senha incorreta!" });
//         }
//         const token = jwt.sign(
//             { id: user.id }, 
//             process.env.SECRET_KEY as string, 
//             { expiresIn: "1d" }
//         );        

//         res.cookie('authToken', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'none',
//             maxAge: 24 * 60 * 60 * 1000, 
//           });



//         return res.json({ message: "Login bem-sucedido!", token });
//     }
// }

import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export class UserLoginController {
    private authorizedEmails: string[] = process.env.AUTHORIZED_EMAILS
        ? process.env.AUTHORIZED_EMAILS.split(",")
        : [];

    constructor() {
        this.authenticate = this.authenticate.bind(this);
    }

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

        return res.json({ message: "Login bem-sucedido!", token, role });
    }
}
