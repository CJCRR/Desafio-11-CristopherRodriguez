import { dirname } from "path";
import { fileURLToPath } from "url";
import { faker } from '@faker-js/faker'

const __dirname= dirname(fileURLToPath(import.meta.url))

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        code: faker.string.nanoid(10),
        status: true,
        price: parseFloat(faker.commerce.price()),
        stock: parseInt(faker.number.int({ min: 20, max: 100 })),
        category: faker.commerce.department(),
        thumbnail: [faker.image.url()],
    };
};

export{__dirname}