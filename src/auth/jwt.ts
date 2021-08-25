import jwt from 'jsonwebtoken';

export const generateAccessToken = (id:string) => jwt.sign(id, 'secret token');
