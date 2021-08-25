import { Request } from 'express';

export interface MyContext {
    req:Request,
    generateAccessToken: Function,
    validateToken: Function,
}
