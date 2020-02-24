import { Mongoose } from 'mongoose'
//@ts-ignore
import { IRole } from 'entities/Role';
//@ts-ignore
import { Crypto } from 'rapin/types/library/crypto';

export declare class User {
  crypto: Crypto;
  token: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  roleType: string;
  role: IRole;
  constructor(registry: any);
  login(email: string, password: string, override?: boolean): Promise<string | boolean>;
  getToken(email: string, password: string, expiresIn?: number): Promise<string | boolean>;
  verify(token: string, login?: boolean): Promise<boolean>;
  getId(): string;
  getFirstName(): string;
  getLastName(): string;
  getEmail(): string;
  getImage(): string;
  getRoleType(): string;
  getRole(): IRole;
  isLogged(): boolean;
}

declare module 'rapin' {
  interface Context {
    mongoose: Mongoose;
    user: User;
  }
}
export declare const Auth: (roles?: string | string[]) => (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void