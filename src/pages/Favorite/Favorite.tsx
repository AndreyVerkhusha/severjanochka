import React, { FC, useEffect, useState } from "react";
import { Favorite as FavoriteType, ProductElem } from "../../types/types";

import { Pagination } from "antd";
import ProductList from "../../components/ProductList/ProductList";
import Navigate from "../../components/Navigate/Navigate";
import Filter from "../../components/Filter/Filter";
import { motion } from "framer-motion";

type Props = {
    favorite: FavoriteType;
    addedToCart: (item: ProductElem) => void;
    cartLoading: boolean;
    addedToFavorite: (item: ProductElem) => void;
}
const Favorite: FC<Props> = ({favorite, addedToCart, cartLoading, addedToFavorite}) => {
    const [favoriteItems, setFavoriteItems] = useState<ProductElem[]>([]);
    const [range, setRange] = useState<{ minRange: number, maxRange: number | null }>({
        minRange: 0,
        maxRange: null
    });
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false); // фейковая подгрузка спина после корректировки цены

    let diapazonFilterPut = () => { // функция  фиксирует изменения диапазона цен
        if (favorite.data?.length > 0) {
            setLoading(true);
            setTimeout(() => {
                let newItems = favorite
                    .data.filter(item =>
                        range.maxRange !== null &&
                        Number(item.fullPrice.split(",")[0]) <= range.maxRange &&
                        Number(item.fullPrice.split(",")[0]) >= range.minRange
                    );
                setFavoriteItems(newItems);
                setLoading(false);
            }, 700);
        }
    };
    let clearFilter = () => {
        setRange((prev) => ({...prev, "minRange": 0}));
        setRange((prev) => ({...prev, "maxRange": maxPrice}));
        setFavoriteItems(favorite.data);
    };

    useEffect(() => {
        if (favorite.data?.length > 0) {
            let maxNum = 0;
            for (let indx = 0; indx < favorite.data.length; indx++) {
                if (Number(favorite.data[indx].fullPrice.replace(",", ".")) > maxNum) {
                    maxNum = Number(favorite.data[indx].fullPrice.replace(",", "."));
                }
            }
            setMaxPrice(maxNum);
            setRange((prev) => ({...prev, "maxRange": maxNum}));
            setFavoriteItems(favorite.data);
        } else {// если в избранном пусто - обнулить стейт
            setMaxPrice(0);
            setRange((prev) => ({...prev, "maxRange": 0}));
            setFavoriteItems([]);
        }
    }, [favorite]);
    return (
        <motion.div
            className="favorite"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <Navigate/>
                <div className="h1">Избранное</div>
                <main>
                    <Filter
                        range={range}
                        maxPrice={maxPrice}
                        setRange={setRange}
                        diapazonFilterPut={diapazonFilterPut}
                        clearFilter={clearFilter}
                        needListCategory={true}
                        loading={loading}
                    />
                    <div className="favorite_list">
                        {favoriteItems.length === 0 && <div className="h2">В избранном нет товаров</div>}
                        <ProductList
                            favorite={{id: Number(localStorage.getItem("fakeUserId")), data: favoriteItems}}
                            addedToCart={addedToCart}
                            cartLoading={cartLoading}
                            isFavoritePage={true}
                            addedToFavorite={addedToFavorite}
                        />
                        {favoriteItems.length > 12 &&
                            <div className="pagination">
                                <Pagination
                                    defaultCurrent={1}
                                    total={favoriteItems.length}
                                    pageSize={12}
                                    showSizeChanger={false}
                                />
                            </div>
                        }
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default Favorite;