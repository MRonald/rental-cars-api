import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";
import fs from 'fs';
import { parse as csvParse } from "csv-parse";

interface IImportCategory {
    name: string;
    description: string;
}

class ImportCategoryUseCase {
    constructor(private categoryRepository: ICategoriesRepository) {}

    loadCategory(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path);
            const categories: IImportCategory[] = [];

            const parseFile = csvParse();
        
            stream.pipe(parseFile);
        
            parseFile.on('data', async (line) => {
                const [name, description] = line;

                categories.push({
                    name, 
                    description,
                });
            }).on('end', () => {
                fs.promises.unlink(file.path);
                resolve(categories);
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategory(file);
        
        categories.map(async (category) => {
            const { name, description } = category;

            const existsCategory = await this.categoryRepository.findByName(name);

            if (!existsCategory) {
                await this.categoryRepository.create({
                    name,
                    description
                });
            }
        });
    }
}

export { ImportCategoryUseCase };