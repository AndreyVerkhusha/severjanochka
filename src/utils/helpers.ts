import { ProductElem } from "../types/types";
import { NoticeType } from "antd/es/message/interface";
import { message } from "antd";

export const customHelpersFunctions = {
    returnNotification(typeNotification: string, text: string) {
        if (typeNotification && text) {
            message.open({
                type: typeNotification as NoticeType,
                content: text,
                className: "custom-class",
                style: {
                    marginTop: "7vh"
                }
            });
        }
    },
    currentRatingStar(elem: ProductElem, indx: number) {
        let result = 0;
        if (elem.rating.length > 1) {
            result = elem.rating
                .reduce((a, b) => a + b, 0) / elem.rating.length;
            return result !== 0 && indx < Math.ceil(result);
        }
        return false;
    },
    crateUniqueId() {
        return Math.floor(Math.random() * 10000);
        /*return `${Math.random().toString(16).slice(2)}`*/
    },
    declension(number: number, txt: string[], cases = [2, 0, 1, 1, 1, 2]) {
        // функция склонения.

        // let number = 1; // один банан
        // let number = 3; // три банана
        // let number = 10; // десять бананов
        return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },
    getCurrentCategory(catalog: ProductElem[], identifier: string) {
        // получить отфильтрованные по категориям списки продуктов

        let arrItems = catalog.filter(elem => elem.category === identifier);
        if (arrItems.length > 0)
            return arrItems;
        return [];
    },
    convertLocationName(str: string) {
        switch (str) {
            case "home":
                return "Главная";
            case "favorite":
                return "Избранное";
            case "catalog-list":
                return "Каталог";
            case "cart":
                return "Корзина";
            case "milk":
                return "Молоко, сыр, яйцо";
            case "bread":
                return "Хлеб";
            case "fruits":
                return "Фрукты и овощи";
            case "drinks":
                return "Напитки";
            case "teaCoffee":
                return "Чай, кофе";
            case "grocery":
                return "Бакалея";
            case "healthyFood":
                return "Здоровое питание";
            case "childrenFood":
                return "Детское питание";
            case "meat":
                return "Мясо, птица, колбаса";
            case "fastFood":
                return "Быстрая еда";
            case "petSupplies":
                return "Зоотовары";
            case "nonFoodItems":
                return "Непродовольственные товары";
            case "product-card":
                return "Карточка товара";
            default:
                return "";
        }
    }
};