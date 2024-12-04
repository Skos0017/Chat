import { Request, Response } from 'express';
import { readTemplate } from '../index';

export function reg(req: Request, res: Response) {
    const pageName = req.params.pageName; // Получаем имя страницы из параметров запроса
    console.log(pageName);
    // TODO: Добавить проверку на существование страницы
    // pageName == null присвоить страницу по умолчанию
    // pageName == login или enter-page тогда вывести 1 страницу enter-page
    // pageName == / и кук нету переадрисовать на login или enter-page
    //редирект научиться делать 
    



    if (pageName == null || pageName == '' || pageName == '/') {
        if (req.cookies != null) {
            readTemplate(`/../views/main-page.html`).then(page => {
                res.set('Content-Type', 'text/html')
                    .status(200)
                    .send(page);
            }).catch(err => {
                console.log(err);
                res.status(500).send('Внутренняя ошибка сервера');
            });
        } else {
            res.redirect('/enter-page'); // Изменено на правильный маршрут
        }
    }else if (pageName === 'login' || pageName === 'enter-page'){
        readTemplate(`/../views/enter-page.html`).then(page => {
            res.set('Content-Type', 'text/html')
                .status(200)
                .send(page);
        }).catch(err => {
            console.log(err);
            res.status(500).send('Внутренняя ошибка сервера');
        });
    }else {
        readTemplate(`/../views/${pageName}.html`).then(page => {
            res.set('Content-Type', 'text/html')
                .status(200)
                .send(page);
        }).catch(err => {
            console.log(err);
            res.status(500).send('Внутренняя ошибка сервера');
        });

    }
}