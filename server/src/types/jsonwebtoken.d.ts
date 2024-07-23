// jsonwebtoken.d.ts
import { JwtPayload, Secret, SignOptions, VerifyOptions } from 'jsonwebtoken';

declare module "jsonwebtoken" {
    import { Secret } from 'jsonwebtoken';

    declare function verify(
        token: string, 
        secretOrPublicKey: Secret, 
        callback: (err: jwt.VerifyErrors | null, decoded: any) => void): void;

    declare function sign(
        payload: string | Buffer | object,
        secretOrPrivateKey: Secret,
        options?: SignOptions,
        callback?: (err: Error | null, encoded: string) => void): string;
}


// jsonwebtoken.d.ts
// import { DecodedData } from 'helpers';


// declare module 'jsonwebtoken' {
//   export function sign(
//     payload: string | Buffer | object,
//     secretOrPrivateKey: Secret,
//     options?: SignOptions
//   ): string;

//   export function verify(
//     token: string,
//     secretOrPublicKey: Secret,
//     options?: VerifyOptions & { complete: true }
//   ): undefined | DecodedData;

//   // Add any other custom methods or types you need to augment
// }
