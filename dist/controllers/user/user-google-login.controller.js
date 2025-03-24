"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleLoginController = void 0;
const prisma_1 = require("../../utils/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
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
dotenv_1.default.config();
class GoogleLoginController {
    constructor() {
        this.authorizedEmails = [
            "vitor@ligacolaborativa.site",
            "rafael.freire@espiralds.com",
            "santospassos.adv@gmail.com",
            "liga@ligacolaborativa.site",
        ];
    }
    async authenticate(req, res) {
        const { tokenGoogle } = req.body;
        if (!tokenGoogle) {
            return res.status(400).json({ error: "Token do Google é necessário!" });
        }
        try {
            const userInfoResponse = await axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`);
            const { email, name, picture } = userInfoResponse.data;
            console.log("Informações do usuário:", userInfoResponse.data);
            let user = await prisma_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await prisma_1.prisma.user.create({
                    data: {
                        email: email || "",
                        username: name || "Usuário do Google",
                        imageBase64: picture || "",
                        password: process.env.API_PASSWORD,
                        metamaskAddress: null,
                    },
                });
            }
            const ligador = this.authorizedEmails.includes(email) ? 1 : 0;
            const token = jsonwebtoken_1.default.sign({ id: user.id, ligador }, process.env.SECRET_KEY, { expiresIn: "1d" });
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000,
            });
            const userWithToken = {
                ...user,
                token,
                ligador,
            };
            console.log(userWithToken);
            return res.json({
                message: "Login bem-sucedido com Google!",
                user: userWithToken,
            });
        }
        catch (error) {
            console.error("Erro na autenticação com Google:", error);
            return res.status(500).json({ error: "Erro ao autenticar com Google." });
        }
    }
}
exports.GoogleLoginController = GoogleLoginController;
