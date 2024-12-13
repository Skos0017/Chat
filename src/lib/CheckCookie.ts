import { User } from '../models/User'

export function CheckCookie(registratedUsers: User[], cookieHeader: string | undefined): boolean {
        if (!cookieHeader) {
            return false;
        }

        const parsedCookies: string[] = cookieHeader.split('; ');
        const tokenCookie: string | undefined = parsedCookies.find(
            (cookie: string) => cookie.startsWith('Token=')
        );

        const token: string | undefined = tokenCookie 
            ? tokenCookie.split('=')[1] 
            : undefined;

        if (!token) {
            return false;
        }

        const user: User | undefined = registratedUsers.find(
            (innerUser: User) => innerUser.token === token
        );

        if (!user) {
            return false;
        }

        return true;
}