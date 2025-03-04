// import { Request, Response } from "express";
// import { prisma } from "../../../utils/prisma";

// export class ProfileUpdateController {
//     async update(req: Request, res: Response) {
//         const userId = parseInt(req.params.id);
//         const {
//             email,
//             username,
//             password,
//             whatsapp,
//             gender,
//             instagram,
//             twitter,
//             linkedin,
//             facebook,
//             areaOfInterest,
//             contributionAxis,
//             weeklyAvailability,
//             themesBiomes,
//             themesCommunities,
//             imageBase64,
//             roles,
//             city,
//             state,
//             organization,
//             peoples,
//         } = req.body;
//         try {

//             const updatedUser = await prisma.user.update({
//                 where: { id: userId },
//                 data: {
//                     email,
//                     username,
//                     password,
//                     whatsapp,
//                     gender,
//                     instagram,
//                     twitter,
//                     linkedin,
//                     facebook,
//                     imageBase64,
//                     areaOfInterest,
//                     contributionAxis,
//                     weeklyAvailability,
//                     themesBiomes,
//                     themesCommunities,
//                     roles,
//                     city,
//                     state,
//                     organization,
//                     peoples,
//                 },

//             });

//             res.json(updatedUser);
//         } catch (error) {
//             res.status(500).json({ error: "Erro ao atualizar so dados do usuário." });
//         }
//     }
// }

import { Request, Response } from "express";
import { prisma } from "../../../utils/prisma";

// Define o tipo CustomRequest para incluir o userId do middleware
interface CustomRequest extends Request {
    userId?: string;
}

export class ProfileUpdateController {
    async update(req: Request, res: Response) {
        const userId = (req as CustomRequest).userId;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const {
            email,
            username,
            name,
            password,
            whatsapp,
            gender,
            instagram,
            twitter,
            linkedin,
            facebook,
            areaOfInterest,
            contributionAxis,
            weeklyAvailability,
            themesBiomes,
            themesCommunities,
            imageBase64,
            roles,
            city,
            state,
            organization,
            peoples,
        } = req.body;

        try {
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    email,
                    username,
                    name,
                    password,
                    whatsapp,
                    gender,
                    instagram,
                    twitter,
                    linkedin,
                    facebook,
                    imageBase64,
                    areaOfInterest,
                    contributionAxis,
                    weeklyAvailability,
                    themesBiomes,
                    themesCommunities,
                    roles,
                    city,
                    state,
                    organization,
                    peoples,
                },
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Erro ao atualizar os dados do usuário:", error);
            res
                .status(500)
                .json({ error: "Erro ao atualizar os dados do usuário." });
        }
    }
}
