import { Request, Response, NextFunction } from 'express';
import { User } from '../User'
import { CheckCookie } from '../lib/CheckCookie';

const mainPage = "/";

// Перенапровляет пользователя на главную страницу
// в случае если есть кука
// /login
// /registration
// /enter-page
// /registration-page
export function CookieCheckPublic(registratedUsers: User[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        const cookieFound = CheckCookie(registratedUsers, req.headers.cookie)
        if (cookieFound) {
            // Редирект на главную страницу main-page
            res.redirect("/");
            return
        }

        next();
    }
}