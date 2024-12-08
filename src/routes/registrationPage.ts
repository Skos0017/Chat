import { Request, RequestHandler, Response } from 'express';
import { readTemplate } from '../index';

const viewsDir = "/../views/"

export function sendPageHTML(htmlPage: string): RequestHandler {
    return function (req: Request, res: Response) {
        readTemplate(viewsDir + `${htmlPage}.html`).then(page => {
            res.set('Content-Type', 'text/html')
                .status(200)
                .send(page);
        }).catch(err => {
            console.log(err);
            res.
                status(500).
                send('Внутренняя ошибка сервера');
        });
    }
}