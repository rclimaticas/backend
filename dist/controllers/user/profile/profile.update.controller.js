"use strict";
// import { Request, Response } from "express";
// import { prisma } from "../../../utils/prisma";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUpdateController = void 0;
const prisma_1 = require("../../../utils/prisma");
class ProfileUpdateController {
    async update(req, res) {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }
        const { email, username, name, password, whatsapp, gender, instagram, twitter, linkedin, facebook, areaOfInterest, contributionAxis, weeklyAvailability, themesBiomes, themesCommunities, imageBase64, roles, city, state, organization, peoples, } = req.body;
        try {
            const updatedUser = await prisma_1.prisma.user.update({
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
        }
        catch (error) {
            console.error("Erro ao atualizar os dados do usuário:", error);
            res
                .status(500)
                .json({ error: "Erro ao atualizar os dados do usuário." });
        }
    }
}
exports.ProfileUpdateController = ProfileUpdateController;
