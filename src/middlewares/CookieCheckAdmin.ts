import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User'
import { CheckCookie } from '../lib/CheckCookie';

const enterPageHTML = '/../views/enter-page.html'

//Перенапровляет пользователяна страницу регистрации или авторизации
//работает с тонином и в случае еслиесть открывает главную страницу 
export function CookieCheckAdmin(registratedUsers: User[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        const cookieFound = CheckCookie(registratedUsers, req.headers.cookie)
        if (!cookieFound) {
            // Редирект на страницу login
            res.redirect("/login");
            return
        }

        next();
    }
}
