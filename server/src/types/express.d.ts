import { DecodedData } from 'helpers';
import { Multer } from 'multer';
import { StoreMethods } from 'sessions';
import * as express from 'express';

declare module 'express-serve-static-core' {
    interface CustomRequest extends Request {
        userId: string; // req.userId
        sessionStore: StoreMethods; // modified Store
        user: DecodedData; 
        session: { admin : Boolean, userAgent : String, userId : String }; //uponlogin
        file: Express.Multer.File ;
    }

    // type TypedRequestHandler = (req: Request, res: CustomRequest, next: NextFunction) => void;

    interface Router {
        get: TypedRouterMethod;
        post: TypedRouterMethod;
        put: TypedRouterMethod;
        delete: TypedRouterMethod;
        use: (...handlers: TypedRequestHandler[]) => Router;
    }

    interface TypedRouterMethod {
        (path: string, ...handlers: TypedRequestHandler[]): Router;
    }
}



