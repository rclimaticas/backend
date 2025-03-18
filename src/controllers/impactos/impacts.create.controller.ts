import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";
import * as nodemailer from 'nodemailer';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export class ImpactsCreateController {
    async store(req: Request, res: Response) {
        const token = req.cookies?.authToken;
        if (!token) {
            return res.status(401).json({ error: "Token não encontrado." });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY!);
            const userId = decoded.id;

            const { subject, urgency, locality, support, affectedCommunity, biomes, situation, contribution } = req.body;

            const newImpact = await prisma.impacts.create({
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

            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            // const response = await axios.get(
            //     `https://urpia-algorithm-production.up.railway.app/?impact_id=${newImpact.id}`
            // );
            // const nearestNeighbors = response.data.nearest_neighbors;

            // let neighborsToNotify = nearestNeighbors;
            // if (!neighborsToNotify || neighborsToNotify.length === 0) {
            //     neighborsToNotify = await prisma.user.findMany({
            //         select: {
            //             email: true
            //         },
            //     });
            // }

            // if (!neighborsToNotify || neighborsToNotify.length === 0) {
            //     return res.status(404).json({ error: "Nenhum usuário para notificar." });
            // }
            const RECIPIENT_EMAILS = [
                "vitor@ligacolaborativa.site",
                "rafael.freire@espiralds.com",
                "santospassos.adv@gmail.com",
                "liga@ligacolaborativa.site",
                ];

            const transporter = nodemailer.createTransport({
                host: 'mail.privateemail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'vitor@ligacolaborativa.site',
                    pass: process.env.PASSWORD_EMAIL,
                },
            });

            const emailHtml = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Novo Impacto Criado</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #d3d3d3;">
                <table
                align="center"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                >
                <tr>
                    <td align="center" style="padding: 20px;">
                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="background-color: #ffffff; padding: 20px;"
                    >
                        <tr>
                        <td
                            align="center"
                            style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;"
                        >
                            <img
                            src="https://rclimaticas-fileupload.s3.sa-east-1.amazonaws.com/logoLC-DRqUmzjb.png"
                            width="100"
                            alt="Logo"
                            style="display: block;"
                            />
                            <h2 style="color: #4A90E2; font-size: 28px;">
                            Olá Ligador, novo Impacto criado!
                            </h2>
                            <p
                            style="font-size: 25px; line-height: 1.6; text-align: center;"
                            >
                            Assunto: ${subject}<br />
                            Urgência: ${urgency}<br />
                            Localidade: ${locality}<br />
                            Suporte: ${support}<br />
                            Comunidade Afetada: ${affectedCommunity}<br />
                            Biomas: ${biomes}<br />
                            Situação: ${situation}<br />
                            Contribuição: ${contribution}<br />
                            Nome do Usuário: ${user.username}<br />
                            E-mail do Usuário: ${user.email}<br />
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td
                            align="center"
                            style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;"
                        >
                            <p
                            style="font-size: 25px; line-height: 1.6; text-align: center;"
                            >
                            Atenciosamente, <br />
                            Equipe da Liga.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td
                            align="center"
                            style="padding: 20px; font-family: Arial, sans-serif; color: #777777; font-size: 16px;"
                        >
                            <p>
                            &copy; 2025 Liga Colaborativa dos Povos. Todos os direitos
                            reservados.
                            </p>
                            <p>
                            <a
                                href="https://www.instagram.com/aliga.on/"
                                style="margin: 0 10px;"
                            >
                                <img
                                src="https://img.icons8.com/?size=100&id=g7SBGFwja0xa&format=png&color=000000"
                                width="30"
                                alt="Instagram"
                                style="display: inline-block;"
                                />
                            </a>
                            <a
                                href="https://www.youtube.com/@ligacolaborativa"
                                style="margin: 0 10px;"
                            >
                                <img
                                src="https://img.icons8.com/?size=100&id=37325&format=png&color=000000"
                                width="30"
                                alt="YouTube"
                                style="display: inline-block;"
                                />
                            </a>
                            </p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
            </body>
            </html>
            `;
            for (const email of RECIPIENT_EMAILS) {
                let mailOptions = {
                    from: 'vitor@ligacolaborativa.site',
                    to: email,
                    subject: 'Novo Impacto Criado',
                    html: emailHtml,
                };

                try {
                    await transporter.sendMail(mailOptions);
                    console.log(`E-mail enviado para: ${email}`);
                } catch (error) {
                    console.error(`Erro ao enviar e-mail para: ${email}`, error);
                }
            }

            // for (const neighbor of neighborsToNotify) {
            //     let mailOptions = {
            //         from: 'vitor@ligacolaborativa.site',
            //         to: neighbor.email,
            //         subject: 'Novo Impacto Criado',
            //         text: `Olá,
            //         Um novo impacto foi criado com os seguintes detalhes:
            //         Assunto: ${subject}
            //         Urgência: ${urgency}
            //         Localidade: ${locality}
            //         Suporte: ${support}
            //         Comunidade Afetada: ${affectedCommunity}
            //         Biomas: ${biomes}
            //         Situação: ${situation}
            //         Contribuição: ${contribution}
            //         Nome do Usuário: ${user.username}
            //         E-mail do Usuário: ${user.email}
            //         Data: ${new Date().toISOString()}

            //         Atenciosamente,
            //         Equipe Liga Colaborativa
            //         `,
            //     };

            //     try {
            //         await transporter.sendMail(mailOptions);
            //         console.log(`E-mail enviado para: ${neighbor.email}`);
            //     } catch (error) {
            //         console.error(`Erro ao enviar e-mail para: ${neighbor.email}`, error);
            //     }
            // }

            res.status(201).json(newImpact);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao criar o impacto." });
        }
    }
}

