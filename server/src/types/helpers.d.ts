// helpers.d.ts

import { StoreMethods } from 'sessions';
import { SessionData } from 'express-session';

declare module 'helpers' {
    interface DecodedData {
        userId: string;
        admin: Boolean;
    }

    declare function getSessions(sessionStore: StoreMethods): Promise<SessionData[] | null>;
    declare function getSession(sessionStore: StoreMethods, sessionId: string): Promise<SessionData | null>;
    declare function deleteSession(sessionStore: StoreMethods, sessionId: string): Promise<void>;
    declare function verifyToken(token: (string | undefined), secretKey: string):  Promise<undefined | DecodedData>;
}



