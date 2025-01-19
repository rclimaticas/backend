import { Request, Response } from "express";

export class UserLogoutController {
    async logout(req: Request, res: Response) {
        const cookies = req.cookies;
        for (const cookieName in cookies) {
            res.clearCookie(cookieName, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'none',
            });
        }

        return res.status(200).json({ message: "Logout realizado com sucesso e todos os cookies removidos!" });
    }
}
