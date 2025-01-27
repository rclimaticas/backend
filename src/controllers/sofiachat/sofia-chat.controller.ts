import { Request, Response } from 'express';
import axios from 'axios';

export class SofiaChatController {
    async sofia(req: Request, res: Response) {
        try {
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ message: 'Mensagem não fornecida.' });
            }

            const response = await axios.post(
                'https://api.deepai.org/api/text-generator',
                { text: message },
                {
                    headers: {
                        'Api-Key': process.env.DEEPAI_API_KEY,
                    },
                }
            );

            const reply = response.data.output;

            res.json({ reply });
        } catch (error) {
            console.error('Erro ao interagir com o modelo:', error);
            res.status(500).json({ message: 'Erro ao processar sua mensagem.' });
        }
    }
}

// import { Request, Response } from 'express';

// export class SofiaChatController {
//     async sofia(req: Request, res: Response) {
//         try {
//             const { message } = req.body;

//             if (!message) {
//                 return res.status(400).json({ message: 'Mensagem não fornecida.' });
//             }
//             const responses: { [key: string]: string } = {
//                 'O que é tecnologia?': 'Tecnologia é o conjunto de conhecimentos e técnicas que permitem a criação de ferramentas e sistemas para resolver problemas e facilitar a vida humana.',
//                 'Qual a importância da ciência?': 'A ciência é fundamental para o desenvolvimento de novas tecnologias, soluções para problemas globais e para a melhoria da qualidade de vida.',
//                 'O que faz um engenheiro?': 'O engenheiro utiliza conhecimentos de ciência e matemática para projetar, construir e otimizar sistemas, estruturas e tecnologias em diversas áreas.',
//             };
//             const reply = responses[message];

//             if (!reply) {
//                 return res.status(400).json({ message: 'Desculpe, não entendi sua pergunta.' });
//             }

//             res.json({ reply });
//         } catch (error) {
//             console.error('Erro ao processar sua mensagem:', error);
//             res.status(500).json({ message: 'Erro ao processar sua mensagem.' });
//         }
//     }
// }
