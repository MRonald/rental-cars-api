import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { hash } from "bcryptjs";
import { AppError } from "../../../../errors/AppErrors";

@injectable()
class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    async execute({
        name,
        email, 
        driver_license, 
        password 
    }: ICreateUserDTO): Promise<void> {
        const userAlreadyExists = await this.usersRepository.findByEmail(email);

        if (userAlreadyExists) {
            throw new AppError('User already exists');
        }

        const passwordHash = await hash(password, 8);

        this.usersRepository.create({
            name,
            email, 
            driver_license, 
            password: passwordHash,
        });
    }
}

export { CreateUserUseCase };