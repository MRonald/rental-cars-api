import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";
import { AppError } from "../errors/AppErrors";

interface IPayload {
    sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token missing', 401);
    }

    const [, token] = authHeader.split(' ');
    
    try {
        const { sub: userId } = verify(token, '55f53fecb2689dc917cfe0e599619ec1') as IPayload;

        const usersRepository = new UsersRepository();
        const user = usersRepository.findById(userId);

        if (!user) {
            throw new AppError('User does not exists', 401);
        }

        request.user = {
            id: userId
        };
        
        next();
    } catch {
        throw new AppError('Invalid token', 401);
    }
}