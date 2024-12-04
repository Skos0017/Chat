import { Request, Response, NextFunction } from 'express';
import { readFilePromise } from '../file-operator_module'
import { User } from '../User'

//Перенапровляет пользователяна страницу регистрации или авторизации
//работает с тонином и в случае еслиесть открывает главную страницу 
export function CookieCheck(registratedUsers: User[]) {
    return function(req: Request, res: Response, next: NextFunction) {
        if (req.url === '/registration' || req.url === '/registration-page' || req.url === '/login' || req.url === '/enter-page') {
            next();
            return;
        }

        //Добавить редирект на страника логина
        // если есть кука то не чего не далать вызвать next;


        const cookieHeader = req.headers.cookie;
        if (!cookieHeader) {
            readFilePromise('/../views/enter-page.html')
                .then((page: string) => {
                     res.status(200).send(page);
                })
                .catch(next);
            return;
        }

        const parsedCookies: string[] = cookieHeader.split('; ');
        const tokenCookie: string | undefined = parsedCookies.find((cookie: string) => cookie.startsWith('Token='));
        const token: string | undefined = tokenCookie ? tokenCookie.split('=')[1] : undefined;

        if (!token) {
            readFilePromise('/../views/enter-page.html')
                .then((page: string) => {
                    res.status(200).send(page);
                })
                .catch(next);
            return;
        }
        const user: User | undefined = registratedUsers.find((innerUser: User) => innerUser.token === token);


    }
}