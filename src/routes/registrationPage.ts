import { Request, RequestHandler, Response } from 'express';
import { promises as fs } from 'fs';
import { readTemplate } from './templateReader';


const viewsDir = "/../views/";

export function sendPageHTML(htmlPage: string): RequestHandler {
    return function (req: Request, res: Response) {
        readTemplate(viewsDir + `${htmlPage}.html`)
            .then(page => {
                res.set('Content-Type', 'text/html')
                    .status(200)
                    .send(page);
            })
            .catch((err: unknown) => { // Указываем тип для err
                console.log(err);
                res.status(500).send('Внутренняя ошибка сервера');
            });
    };
}



export function readFilePromise(fileName: string): Promise<string> {
    return fs.readFile(fileName, 'utf-8');
}