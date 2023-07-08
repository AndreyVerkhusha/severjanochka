import milk from "./milk.jpg";
import bread from "./bread.jpg";
import fruits from "./fruits.jpg";
import drinks from "./drinks.jpg";
import teaCoffee from "./teaCoffee.jpg";
import grocery from "./grocery.jpg";
import healthyFood from "./healthyFood.jpg";
import childrenFood from "./childrenFood.jpg";
import meat from "./meat.jpg";
import petSupplies from "./petSupplies.jpg";
import fastFood from "./fastFood.jpg";
import nonFoodItems from "./nonFoodItems.jpg";

// сделал дополнительный файл index.js здесь, чтобы не засорять импортами изображений файл helpers
export const getCatalogImage = (indx: number) => {
    return [
        milk, bread, fruits, drinks,
        teaCoffee, grocery, healthyFood, childrenFood,
        meat, fastFood, petSupplies, nonFoodItems
    ][indx];
};