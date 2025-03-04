import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import bcrypt from "bcryptjs";

export class UserRegisterController {
    async store(req: Request, res: Response) {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: "Email, senha e nome são obrigatórios!" });
        }

        const userByEmail = await prisma.user.findUnique({ where: { email } });
        if (userByEmail) {
            return res.status(400).json({ error: "E-mail já está em uso!" });
        }

        const hash_password = await bcrypt.hash(password, 8);

        let username = name.toLowerCase().replace(/\s+/g, "_");
        let uniqueUsername = username;
        let counter = 1;

        while (await prisma.user.findUnique({ where: { username: uniqueUsername } })) {
            uniqueUsername = `${username}${counter}`;
            counter++;
        }

        const user = await prisma.user.create({
            data: {
                email,
                username: uniqueUsername,
                password: hash_password,
                name,
                metamaskAddress: null,
            },
        });

        return res.status(201).json({ user });
    }
}
