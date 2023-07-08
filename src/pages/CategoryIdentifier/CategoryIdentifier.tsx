import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CategoryElem, Favorite, ProductElem } from "../../types/types";
import { customHelpersFunctions } from "../../utils/helpers";
import { motion } from 'framer-motion';

import Navigate from "../../components/Navigate/Navigate";
import ProductList from "../../components/ProductList/ProductList";
import Filter from "../../components/Filter/Filter";

type Props = {
    catalog: ProductElem[];
    favorite: Favorite;
    category: CategoryElem[];
    addedToCart: (item: ProductElem) => void;
    addedToFavorite: (item: ProductElem) => void;
    cartLoading: boolean;
}
const CategoryIdentifier: FC<Props> = (props) => {
    const {favorite, category, addedToCart, addedToFavorite, cartLoading, catalog} = props;
    const params = useParams();

    const [items, setItems] = useState<ProductElem[] | []>([]);
    const [range, setRange] = useState<{ minRange: number, maxRange: number | null }>({
        minRange: 0,
        maxRange: null
    });
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false); // фейковая подгрузка спина после корректировки цены

    let getCurrentTitleCatalog = () => {
        let resultTitle = "";
        if (category.length > 0) {
            let elem = category.find(elem => elem.value === params.identifier);
            if (elem !== undefined) resultTitle = elem.lable;
        }
        return resultTitle;
    };
    let diapazonFilterPut = () => { // функция  фиксирует изменения диапазона цен
        setLoading(true);
        setTimeout(() => {
            if (params.identifier) {
                let newItems = customHelpersFunctions.getCurrentCategory(catalog, params.identifier);
                newItems = newItems
                    .filter(item =>
                        range.maxRange !== null &&
                        Number(item.fullPrice.split(",")[0]) <= range.maxRange &&
                        Number(item.fullPrice.split(",")[0]) >= range.minRange
                    );
                setItems(newItems);
            }
            setLoading(false);
        }, 700);
    };
    let clearFilter = () => {
        setRange((prev) => ({...prev, "minRange": 0}));
        setRange((prev) => ({...prev, "maxRange": maxPrice}));
        if (params.identifier) {
            setItems(customHelpersFunctions.getCurrentCategory(catalog, params.identifier));
        }
    };

    useEffect(() => {
        if (catalog.length > 0 && params.identifier !== undefined) {
            let items = customHelpersFunctions.getCurrentCategory(catalog, params.identifier);
            let maxNum = 0;
            if (items.length > 0) {
                for (let indx = 0; indx < items.length; indx++) {
                    if (Number(items[indx].fullPrice.replace(",", ".")) > maxNum)
                        maxNum = Number(items[indx].fullPrice.replace(",", "."));
                }
            }
            setMaxPrice(maxNum);
            setRange((prev) => ({...prev, "maxRange": maxNum}));
            setItems(items);
        }
    }, [catalog, params.identifier]);
    return (
        <motion.div
            className="catalog_identifier"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <Navigate/>
                <div className="h1">{getCurrentTitleCatalog()}</div>
                <main>
                    <Filter
                        range={range}
                        maxPrice={maxPrice}
                        setRange={setRange}
                        diapazonFilterPut={diapazonFilterPut}
                        clearFilter={clearFilter}
                        loading={loading}
                    />
                    <ProductList
                        items={items}
                        favorite={favorite}
                        addedToCart={addedToCart}
                        cartLoading={cartLoading}
                        addedToFavorite={addedToFavorite}
                    />
                </main>
            </div>
        </motion.div>
    );
};

export default CategoryIdentifier;