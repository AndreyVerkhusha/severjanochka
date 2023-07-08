import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Favorite as FavoriteType, ProductElem } from "../../types/types";

import Spin from "../Spin/Spin";
import Rating from "../Rating/Rating";
import { ReactComponent as Favorite } from "../../images/Favorite/favorite.svg";

type Props = {
    favorite: FavoriteType;
    addedToCart: (item: ProductElem) => void;
    items?: ProductElem[];
    isFavoritePage?: boolean;
    cartLoading: boolean;
    addedToFavorite: (item: ProductElem) => void;
};
const ProductList: FC<Props> = (props) => {
    const {items, favorite, isFavoritePage, addedToCart, cartLoading, addedToFavorite} = props;
    const history = useNavigate();

    const [toDisplayItems, setToDisplayItems] = useState<ProductElem[]>([]);

    let setActiveFavorSvg = (elem: ProductElem) => {
        if (favorite.data?.length > 0) {
            for (let indx = 0; indx < favorite.data.length; indx++)
                if (elem.id === favorite.data[indx].id) return true;
        }
        return false;
    };

    useEffect(() => {
        // ProductList вызывается в нескольких местах, с разными данными.
        // Создал отдельный стейт для вывода конечного массива, чтобы не дублировать jsx разметку
        if (isFavoritePage)
            setToDisplayItems(favorite.data || []);
        else setToDisplayItems(items || []);
    }, [items, favorite, isFavoritePage]);
    return (
        <div className="product_list">
            <ul className="list">
                {toDisplayItems && toDisplayItems.length > 0
                    ? toDisplayItems.map((elem, indx) =>
                        <li
                            key={indx}
                            onClick={() => history(`/product-card/${elem.id}`)}
                        >
                            <div className="group_blocks">
                                <div className="preview_image-block">
                                    <img className="item_img" src={elem.image} alt={elem.name}/>
                                    <div
                                        className={favorite.data?.length > 0 &&
                                        setActiveFavorSvg(elem)
                                            ? "favorite_icon active"
                                            : "favorite_icon"
                                        }
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addedToFavorite(elem);
                                        }}
                                    >
                                        <Favorite/>
                                    </div>
                                    <div className="discount">{elem.discountProcentague}</div>
                                </div>
                                <div className="preview_info-block">
                                    <div className="price">
                                        <div>
                                            <span>{elem.discountPrice} ₽</span>
                                            <span>C картой</span>
                                        </div>
                                        <div>
                                            <span>{elem.fullPrice} ₽</span>
                                            <span>Обычная</span>
                                        </div>
                                    </div>
                                    <div className="name">{elem.name}</div>
                                    <Rating elem={elem}/>
                                    <div
                                        className={cartLoading ? "btn_in-basket disabled" : "btn_in-basket"}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!cartLoading)
                                                addedToCart(elem);
                                        }}
                                    >
                                        В корзину
                                        {cartLoading && <Spin/>}
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                    : <></>
                }
            </ul>
        </div>
    );
};

export default ProductList;