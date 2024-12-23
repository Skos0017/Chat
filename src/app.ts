import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import * as http from 'http';
import { WebSocketServer } from 'ws';

import { readFilePromise, writeFilePromise } from './utils/file-operator_module';
import { User } from './models/User';
import { CheckRegisteredUser  } from './middlewares/CheckRegisteredUser';
import { CookieCheckAdmin } from './middlewares/CookieCheckAdmin';
import { CookieCheckPublic } from './middlewares/CookieCheckPublic';
import { sendPageHTML } from './routes/registrationPage';
import { LogRequest } from './middlewares/LogRequest';
import { SetupWebSocket } from './websocket/server';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


export const registratedUsers: User[] = [];
export const userDataJson = "./userData.json";


SetupWebSocket(wss);

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(LogRequest());

app.get('/', CookieCheckAdmin(registratedUsers), sendPageHTML("/main-page"));
app.get('/main-page', CookieCheckAdmin(registratedUsers), sendPageHTML("/main-page"));

app.get('/login', CookieCheckPublic(registratedUsers), sendPageHTML("/enter-page"));
app.get('/enter-page', CookieCheckPublic(registratedUsers), sendPageHTML("/enter-page"));
app.get('/registration', CookieCheckPublic(registratedUsers), sendPageHTML("/registration-page"));
app.get('/registration-page', CookieCheckPublic(registratedUsers), sendPageHTML("/registration-page"));

app.post('/login', CheckRegisteredUser (registratedUsers), (req: Request, res: Response) => {
    let { login, password } = req.body.user;

    readFilePromise(userDataJson)
        .then((dataUsers: string) => {
            let users: User[] = JSON.parse(dataUsers);
            let userLogin: User | undefined = users.find(value => value.username === login);

            if (!userLogin) {
                return res.status(404).json({ "message": "Логин или Пароль не правильные" });
            }

            if (userLogin.password !== password) {
                return res.status(404).json({ "message": "Логин или Пароль не правильные" });
            }

            res.status(201).cookie('Token', userLogin.token, { httpOnly: true }).json({ "message": '' });
        });
});

app.post('/registration', CheckRegisteredUser(registratedUsers), (req: Request, res: Response) => {
    // {user: {'Name': 'Kas'}}
    let newUser: User = new User(req.body.user);

    readFilePromise(userDataJson)
        .then(dataUsers => {
            let users: User[] = JSON.parse(dataUsers);
            users.push(newUser);

            newUser.setUserToken(generateToken(128, 9));
            registratedUsers.push(newUser);

            return writeFilePromise(userDataJson, JSON.stringify(users, null, 2));
        })
        .then(page => {
            res.set('Content-Type', 'text/html')
                .status(200)
                .cookie('Token', newUser.token, { httpOnly: true })
                .send(page);
        });
});

app.post('/logout', (req, res) => {
    // Перебираем все куки и удаляем их
    Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName); // Удаляем куку по имени
    });

    // Отправляем ответ
    res.status(200).json({ message: 'Вы успешно вышли из аккаунта' });
});

function generateToken(length: number = 128, countSymbolsInBucket: number = 9) {
    let alphabeth = 'abcdefghijklmnopqrstuvwxyz';
    let symbolsSet = alphabeth + alphabeth.toUpperCase() + '0123456789';
    let token = '';

    for (let i = 1; i <= length; i++) {
        if (i % countSymbolsInBucket === 0) {
            token += '-';
            continue;
        }
        let randomIndex = Math.floor(Math.random() * symbolsSet.length);
        token += symbolsSet[randomIndex];
    }
    return token;
}

export { app, server, wss };
