import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export function CheckRegisteredUser(registratedUsers: User[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        let user: User = new User(req.body.user);

        if (!req.body.user) {
            res.status(404).send('Ошибка запроса')
            return;
        }

        let findUserByEmail = registratedUsers.find(
            registratedUser => registratedUser.email === user.email
        );

        if (findUserByEmail) {
            res.status(401).send('Пользователь с таким email уже зарегистрирован');
            return;
        }

        next();
    }
}
