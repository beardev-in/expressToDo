import { Store } from "express-session";

// express-session.d.ts
declare module 'sessions' {
    interface SessionData {
        userId: string;
        admin: boolean;
        userAgent: string;
        cookie : {
            originalMaxAge: number;
            expires: string;
            secure: boolean;
            httpOnly: boolean;
            path: string;
        }
    }

    //extend types for methods
    interface StoreMethods extends Store {
        all(callback: (err: Error, sessions: SessionData[] | null ) => void): void;
        get(sessionId: string, callback: (err: Error, sessionData: SessionData | null) => void): void;
        destroy(sessionId: string, callback: (err: Error) => void): void;
    }
}
