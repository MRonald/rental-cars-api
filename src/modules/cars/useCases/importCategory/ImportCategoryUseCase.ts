import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import fs from 'fs';
import { parse as csvParse } from "csv-parse";

class ImportCategoryUseCase {
    constructor(private categoryRepository: ICategoriesRepository) {}

    execute(file: Express.Multer.File): void {
        const stream = fs.createReadStream(file.path);

        const parseFile = csvParse();

        stream.pipe(parseFile);

        parseFile.on('data', async (line) => {
            console.log(line);
        })
    }
}

export { ImportCategoryUseCase };