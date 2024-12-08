import { Request, Response, NextFunction } from 'express';

export function LogRequest() {
    return function (req: Request, res: Response, next: NextFunction) {
        console.log(`${req.method}\t | ${req.path}`);
        next();
    }
}