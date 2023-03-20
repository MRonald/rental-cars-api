import { Router } from "express";
import { SpecificationRepository } from "../modules/cars/repositories/implementations/SpecificationRepository";
import { CreateSpecificationService } from "../modules/cars/services/CreateSpecificationService";

const specificationsRoutes = Router();

const specificationsRepository = new SpecificationRepository();

specificationsRoutes.post('/', (request, response) => {
    const { name, description } = request.body;

    const createSpeficiationService = new CreateSpecificationService(specificationsRepository);

    createSpeficiationService.execute({ name, description });

    return response.status(201).send();
});

specificationsRoutes.get('/')

export { specificationsRoutes };