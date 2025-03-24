import { Router } from 'express';
import express from 'express';
import { UserRegisterController } from './controllers/user/user-register.controller';
import { UserLoginController } from './controllers/user/user-login.controller';
import { UserLogoutController } from './controllers/user/user-logout.controller';
import { AuthMiddleware } from './middlewares/auth';
import { AdminMiddleware } from './middlewares/admin.auth';
import multer from 'multer';
import { prisma } from './utils/prisma';
import fs from 'fs';
import path from 'path';

import { MaterialCreateController } from './controllers/material/material.create.controller';
import { MaterialGetController } from './controllers/material/material.get.controller';
import { MaterialUpdateController } from './controllers/material/material.update.controler';
import { MaterialDeleteController } from './controllers/material/material.delete.controller';

import { ProfileUpdateController } from './controllers/user/profile/profile.update.controller';
import { ProfileGetController } from './controllers/user/profile/profile.get.controller';
import { ProfileDeleteController } from './controllers/user/profile/profile.delete.controller';

import { ImpactsCreateController } from './controllers/impactos/impacts.create.controller';
import { ImpactsListController } from './controllers/impactos/impacts.list.controller';
import {ImpactsListGlobalController } from './controllers/impactos/impacts.list.global.controller';
import { ImpactsUpdateController } from './controllers/impactos/impacts.update.controller';

import { NewsletterCreateController } from './controllers/newsletter/newsletter.create.controller';
import { NewsletterListController } from './controllers/newsletter/newsletter.list.controller';
import { NewsletterDeleteController } from './controllers/newsletter/newsletter.delete.controller';

import { NewsScrapeController } from './controllers/webscraping/news-scrape.controller';

import { SofiaChatController } from './controllers/sofiachat/sofia-chat.controller';

import { GoogleLoginController } from './controllers/user/user-google-login.controller';

import { MetaMaskLoginController } from './controllers/user/user-metamask.controller';

import { OndeFoiCreateController } from './controllers/ondefoi/ondefoi.create.controller';
import { OndeFoiListController } from './controllers/ondefoi/ondefoi.list.controller';

// Multer configuration
const upload = multer();

// User controllers
const registerController = new UserRegisterController();
const loginController = new UserLoginController();
const logoutController = new UserLogoutController();

// Material controllers
const materialController = new MaterialCreateController();
const materialGetController = new MaterialGetController();
const materialUpdateController = new MaterialUpdateController();
const materialDeleteController = new MaterialDeleteController();

// Profile controllers
const profileUpdateController = new ProfileUpdateController();
const profileGetController = new ProfileGetController();
const profileDeleteController = new ProfileDeleteController();

// Impacts controllers
const impactsCreateController = new ImpactsCreateController();
const impactsListController = new ImpactsListController();
const impactsListGlobalController = new ImpactsListGlobalController();
const impactsUpdateController = new ImpactsUpdateController();

// Newsletter controllers
const newsletterCreateController = new NewsletterCreateController();
const newsletterListController = new NewsletterListController()
const newsletterDeleteController = new NewsletterDeleteController();

// SofiaChat controllers
const sofiaChatController = new SofiaChatController();

// Webscraping controlles
const newsScrapeController = new NewsScrapeController();

// Google Login Auth
const googleLoginController = new GoogleLoginController();

// Meta Mask Login Auth
const metaMaskLoginController = new MetaMaskLoginController();

// Onde Foi controllers
const ondefoiCreateController = new OndeFoiCreateController();
const ondefoiListController = new OndeFoiListController();

export const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// User routes
router.post("/register", registerController.store);
router.post("/login", loginController.authenticate);
router.post("/logout", logoutController.logout);


router.post('/upload/:materialId', upload.single('fileUpload'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado');
    }

    const { originalname, buffer } = req.file;
    const { materialId } = req.params;

    try {
        const material = await prisma.material.findUnique({
            where: { id: parseInt(materialId, 10) },
        });

        if (!material) {
            return res.status(404).send('Material não encontrado');
        }

        const uploadPath = path.join(__dirname, 'uploads', originalname);
        fs.writeFileSync(uploadPath, buffer);
        const file = await prisma.fileUpload.create({
            data: {
                path: uploadPath,
                date: new Date(),
                materialId: parseInt(materialId, 10),
            },
        });
        res.status(201).json(file);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar o arquivo');
    }
});

router.post("/materials", materialController.store);
router.get("/materials/material", materialGetController.list)
router.put("/materials/:materialId", AuthMiddleware, materialUpdateController.update);
router.delete("/materials/:materialId", AuthMiddleware, materialDeleteController.delete);
router.get("/materials", materialGetController.list);

// Profile routes
router.put("/user/update", AuthMiddleware, profileUpdateController.update);
router.get("/users/profile", profileGetController.show);
router.get("/users", profileGetController.index);
router.delete("/profile/:id", AuthMiddleware, profileDeleteController.delete);

// Impacts routes
router.post("/impacts", AuthMiddleware, impactsCreateController.store);
router.get("/impacts/user", AuthMiddleware, impactsListController.index);
router.get("/impacts", AuthMiddleware, AdminMiddleware, impactsListGlobalController.index)
router.put("/impacts/:id", AuthMiddleware, AdminMiddleware, impactsUpdateController.update);

// Newsletter routes
router.post("/newsletter", newsletterCreateController.store)
router.get("/newsletter/emails", newsletterListController.getEmails)
router.delete("/newsletter/delete", newsletterDeleteController.deleteAllEmails)

// News scraping route
router.get("/scrape-news", newsScrapeController.scrape); 

// SofiaChat routes
router.post("/sofia-chat", sofiaChatController.sofia)

// Google Auth Login
router.post("/auth/google", googleLoginController.authenticate);

// Meta Mask Auth
router.post("/auth/metamask", metaMaskLoginController.authenticate);

// Onde Foi routes
router.post("/ondefoi", ondefoiCreateController.store);
router.get("/ondefoi/list", ondefoiListController.index);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
}); 


