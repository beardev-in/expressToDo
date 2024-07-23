declare module 'bcrypt' {
    export interface Bcrypt {
      hashSync(data: string, saltOrRounds: number | string): string;
      compareSync(data: string, encrypted: string): boolean;
      genSaltSync(rounds?: number): string;
    }
  
    const bcrypt: Bcrypt;
    export default bcrypt;
}