"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpactsCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
const nodemailer = __importStar(require("nodemailer"));
const axios_1 = __importDefault(require("axios"));
// tempo de disparo de flags -> validador -> bot
// fluxo sendo visível
// retorno dos dados para validadores para abrir mais os dados
class ImpactsCreateController {
    async store(req, res) {
        const { subject, urgency, locality, support, affectedCommunity, biomes, situation, contribution, userId } = req.body;
        try {
            const newImpact = await prisma_1.prisma.impacts.create({
                data: {
                    subject,
                    urgency,
                    locality,
                    support,
                    affectedCommunity,
                    biomes,
                    situation,
                    contribution,
                    date: new Date(),
                    userId
                },
            });
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            const response = await axios_1.default.get(`https://urpia-algorithm-production.up.railway.app/?impact_id=${newImpact.id}`);
            const nearestNeighbors = response.data.nearest_neighbors;
            if (!nearestNeighbors || nearestNeighbors.length === 0) {
                return res.status(404).json({ error: "Nenhum e-mail encontrado." });
            }
            const transporter = nodemailer.createTransport({
                host: 'mail.privateemail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'vitor@ligacolaborativa.site',
                    pass: process.env.PASSWORD_EMAIL,
                },
            });
            for (const neighbor of nearestNeighbors) {
                let mailOptions = {
                    from: 'vitor@ligacolaborativa.site',
                    to: neighbor.email,
                    subject: 'Novo Impacto Criado',
                    text: `Olá,
                    Um novo impacto foi criado com os seguintes detalhes:
                    Assunto: ${subject}
                    Urgência: ${urgency}
                    Localidade: ${locality}
                    Suporte: ${support}
                    Comunidade Afetada: ${affectedCommunity}
                    Biomas: ${biomes}
                    Situação: ${situation}
                    Contribuição: ${contribution}
                    ID do Usuário: ${userId}
                    Nome do Usuário: ${user.username}
                    E-mail do Usuário: ${user.email}
                    Data: ${new Date().toISOString()}

                    Atenciosamente,
                    Equipe Liga Colaborativa
                    `,
                };
                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`E-mail enviado para: ${neighbor.email}`);
                }
                catch (error) {
                    console.error(`Erro ao enviar e-mail para: ${neighbor.email}`, error);
                }
            }
            res.status(201).json(newImpact);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao criar o impacto." });
        }
    }
}
exports.ImpactsCreateController = ImpactsCreateController;
// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import * as nodemailer from 'nodemailer';
// export class ImpactsCreateController {
//     async store(req: Request, res: Response) {
//         const { subject, urgency, locality, support, affectedCommunity, biomes, situation, contribution, userId } = req.body;
//         try {
//             const newImpact = await prisma.impacts.create({
//                 data: {
//                     subject,
//                     urgency,
//                     locality,
//                     support,
//                     affectedCommunity,
//                     biomes,
//                     situation,
//                     contribution,
//                     date: new Date(),
//                     userId
//                 },
//             });
//             const user = await prisma.user.findUnique({
//                 where: { id: userId },
//             });
//             if (!user) {
//                 return res.status(404).json({ error: "Usuário não encontrado." });
//             }
//             const transporter = nodemailer.createTransport({
//                 host: 'mail.privateemail.com',
//                 port: 465, // ou 587 para TLS
//                 secure: true, // true para 465, false para outras portas
//                 auth: {
//                     user: 'vitor@ligacolaborativa.site',
//                     pass: process.env.PASSWORD_EMAIL,
//                 },
//             });
//             let mailOptions = {
//                 from: 'vitor@ligacolaborativa.site',
//                 to: 'jvittor@gmail.com',
//                 subject: 'Novo Impacto Criado',
//                 text: `
//                     Um novo impacto foi criado com os seguintes detalhes:
//                     Assunto: ${subject}
//                     Urgência: ${urgency}
//                     Localidade: ${locality}
//                     Suporte: ${support}
//                     Comunidade Afetada: ${affectedCommunity}
//                     Biomas: ${biomes}
//                     Situação: ${situation}
//                     Contribuição: ${contribution}
//                     ID do Usuário: ${userId}
//                     Nome do Usuário: ${user.username}
//                     E-mail do Usuário: ${user.email}
//                     Data: ${new Date().toISOString()}
//                 `,
//             };
//             // enviando o email
//             await transporter.sendMail(mailOptions);
//             res.status(201).json(newImpact);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: "Erro ao criar o impacto." });
//         }
//     }
// }
// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import * as nodemailer from "nodemailer";
// import * as word2vec from "node-word2vec";
// // Carregar o modelo Word2Vec
// let word2VecModel: any;
// word2vec.loadModel("path_to_pretrained_word2vec_model.bin", (error, model) => {
//   if (error) {
//     console.error("Erro ao carregar o modelo Word2Vec:", error);
//   } else {
//     word2VecModel = model;
//   }
// });
// // Função para calcular a similaridade de cosseno entre dois vetores
// function cosineSimilarity(vecA: number[], vecB: number[]): number {
//   const dotProduct = vecA.reduce((acc, val, idx) => acc + val * vecB[idx], 0);
//   const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
//   const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
//   return dotProduct / (normA * normB);
// }
// export class ImpactsCreateController {
//   async store(req: Request, res: Response) {
//     const {
//       subject,
//       urgency,
//       locality,
//       support,
//       affectedCommunity,
//       biomes,
//       situation,
//       contribution,
//       userId,
//     } = req.body;
//     try {
//       // Criar o impacto no banco de dados
//       const newImpact = await prisma.impacts.create({
//         data: {
//           subject,
//           urgency,
//           locality,
//           support,
//           affectedCommunity,
//           biomes,
//           situation,
//           contribution,
//           date: new Date(),
//           userId,
//         },
//       });
//       // Obter todos os usuários
//       const users = await prisma.user.findMany();
//       if (!word2VecModel) {
//         return res.status(500).json({ error: "Modelo Word2Vec não carregado." });
//       }
//       // Gerar vetores para os campos de impacto
//       const impactBiomesVec = word2VecModel.getVector(biomes);
//       const impactAffectedCommunityVec = word2VecModel.getVector(affectedCommunity);
//       const relevantUsers: string[] = [];
//       // Verificar similaridade com os usuários
//       for (const user of users) {
//         const userBiomesVec = word2VecModel.getVector(user.themeBiomes);
//         const userAffectedCommunityVec = word2VecModel.getVector(user.themeAffectedCommunity);
//         // Calcular a similaridade de cosseno
//         const biomesSimilarity = cosineSimilarity(impactBiomesVec, userBiomesVec);
//         const affectedCommunitySimilarity = cosineSimilarity(
//           impactAffectedCommunityVec,
//           userAffectedCommunityVec
//         );
//         // Se a similaridade for alta (limiar de 0.7), o usuário é relevante
//         if (biomesSimilarity > 0.7 && affectedCommunitySimilarity > 0.7) {
//           relevantUsers.push(user.email);
//         }
//       }
//       if (relevantUsers.length > 0) {
//         // Enviar email para os usuários relevantes
//         const transporter = nodemailer.createTransport({
//           host: "mail.privateemail.com",
//           port: 465, // ou 587 para TLS
//           secure: true, // true para 465, false para outras portas
//           auth: {
//             user: "vitor@ligacolaborativa.site",
//             pass: process.env.PASSWORD_EMAIL,
//           },
//         });
//         const mailOptions = {
//           from: "vitor@ligacolaborativa.site",
//           to: relevantUsers.join(", "), // Enviar para todos os usuários relevantes
//           subject: "Novo Impacto Criado",
//           text: `
//             Um novo impacto foi criado com os seguintes detalhes:
//             Assunto: ${subject}
//             Urgência: ${urgency}
//             Localidade: ${locality}
//             Suporte: ${support}
//             Comunidade Afetada: ${affectedCommunity}
//             Biomas: ${biomes}
//             Situação: ${situation}
//             Contribuição: ${contribution}
//             ID do Usuário: ${userId}
//             Data: ${new Date().toISOString()}
//           `,
//         };
//         // Enviar o email
//         await transporter.sendMail(mailOptions);
//       }
//       // Retornar o impacto criado
//       res.status(201).json(newImpact);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Erro ao criar o impacto." });
//     }
//   }
// }
// import { Request, Response } from "express";
// import { prisma } from "../../utils/prisma";
// import * as nodemailer from 'nodemailer';
// export class ImpactsCreateController {
//     // Métodos agora são funções arrow, garantindo que `this` seja vinculado corretamente
//     store = async (req: Request, res: Response) => {
//         const { subject, urgency, locality, support, affectedCommunity, biomes, situation, contribution, userId } = req.body;
//         try {
//             // Criar o impacto no banco de dados
//             const newImpact = await prisma.impacts.create({
//                 data: {
//                     subject,
//                     urgency,
//                     locality,
//                     support,
//                     affectedCommunity,
//                     biomes,
//                     situation,
//                     contribution,
//                     date: new Date(),
//                     userId
//                 },
//             });
//             // Encontrar todos os usuários
//             const users = await prisma.user.findMany();
//             // Representar biomas e comunidades como vetores binários
//             const impactVector = this.createImpactVector(biomes, affectedCommunity);
//             // Filtrar usuários com base na similaridade (produto escalar)
//             const relevantUsers = users.filter(user => {
//                 const userVector = this.createUserVector(user);
//                 const similarity = this.computeDotProduct(userVector, impactVector);
//                 return similarity > 0; // Filtra os usuários que têm algum interesse no impacto
//             });
//             if (relevantUsers.length === 0) {
//                 return res.status(404).json({ error: "Nenhum usuário relevante encontrado para esse impacto." });
//             }
//             // Criar transporte de e-mail
//             const transporter = nodemailer.createTransport({
//                 host: 'mail.privateemail.com',
//                 port: 465,
//                 secure: true,
//                 auth: {
//                     user: 'vitor@ligacolaborativa.site',
//                     pass: process.env.PASSWORD_EMAIL,
//                 },
//             });
//             // Enviar e-mail para os usuários relevantes
//             for (const user of relevantUsers) {
//                 console.log(user.email, relevantUsers.length)
//                 let mailOptions = {
//                     from: 'vitor@ligacolaborativa.site',
//                     to: user.email,
//                     subject: 'Novo Impacto Criado',
//                     text: `
//                         Um novo impacto foi criado com os seguintes detalhes:
//                         Assunto: ${subject}
//                         Urgência: ${urgency}
//                         Localidade: ${locality}
//                         Suporte: ${support}
//                         Comunidade Afetada: ${affectedCommunity}
//                         Biomas: ${biomes}
//                         Situação: ${situation}
//                         Contribuição: ${contribution}
//                         ID do Impacto: ${newImpact.id}
//                         Nome do Usuário: ${user.username}
//                         E-mail do Usuário: ${user.email}
//                         Data: ${new Date().toISOString()}
//                     `,
//                 };
//                 await transporter.sendMail(mailOptions);
//             }
//             res.status(201).json(newImpact);
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ error: "Erro ao criar o impacto." });
//         }
//     };
//     // Função para criar o vetor de impacto
//     createImpactVector = (biomes: string[], affectedCommunity: string[]): number[] => {
//         const allBiomes = ["Mata Atlântica", "Amazônia", "Pantanal", "Pampas", "Cerrado", "Zonas Urbanas", "Urbanas"];
//         const allCommunities = ["Agricultor Familiar", "Indígenas", "Quilombolas", "Fundo de Pasto", "Gerais"];
//         // Representar biomas e comunidades como vetores binários
//         let impactVector = allBiomes.map(biome => biomes.includes(biome) ? 1 : 0);
//         impactVector = impactVector.concat(allCommunities.map(community => affectedCommunity.includes(community) ? 1 : 0));
//         return impactVector;
//     };
//     // Função para criar o vetor de interesse do usuário
//     createUserVector = (user: any): number[] => {
//         const allBiomes = ["Mata Atlântica", "Amazônia", "Pantanal", "Pampas", "Cerrado", "Zonas Urbanas", "Urbanas"];
//         const allCommunities = ["Agricultor Familiar", "Indígenas", "Quilombolas", "Fundo de Pasto", "Gerais"];
//         // Representar os interesses do usuário como vetores binários
//         let userVector = allBiomes.map(biome => user.themesBiomes.includes(biome) ? 1 : 0);
//         userVector = userVector.concat(allCommunities.map(community => user.themesCommunities.includes(community) ? 1 : 0));
//         return userVector;
//     };
//     // Função para calcular o produto escalar entre dois vetores
//     computeDotProduct = (vectorA: number[], vectorB: number[]): number => {
//         return vectorA.reduce((sum, current, index) => sum + (current * vectorB[index]), 0);
//     };
// }
