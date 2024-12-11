"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogoutController = void 0;
class UserLogoutController {
    async logout(req, res) {
        res.clearCookie("authToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ message: "Logout realizado com sucesso!" });
    }
}
exports.UserLogoutController = UserLogoutController;
