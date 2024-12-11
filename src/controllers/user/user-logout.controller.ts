import { Request, Response } from "express";

export class UserLogoutController {
    async logout(req: Request, res: Response) {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({ message: "Logout realizado com sucesso!" });
    }
}
