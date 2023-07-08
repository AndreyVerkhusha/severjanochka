import React, { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Cart as CartType, CategoryElem, Favorite, ProductElem } from "../../types/types";
import { Tooltip } from "antd";
import { motion } from "framer-motion";

import logo from "../../images/Header/logo.svg";
import btn_catalog from "../../images/Header/btn_catalog.svg";
import search from "../../images/Header/search.svg";

import { ReactComponent as Cart } from "../../images/Cart/cart.svg";
import { ReactComponent as FavoriteHeader } from "../../images/Favorite/favorite_header.svg";
import { ReactComponent as CategorySearch } from "../../images/Header/category_search.svg";
import { ReactComponent as Order } from "../../images/Header/order.svg";

type Props = {
    category: CategoryElem[];
    catalog: ProductElem[];
    favorite: Favorite;
    cart: CartType;
}
const Header: FC<Props> = ({category, catalog, favorite, cart}) => {
    const history = useNavigate();
    const location = useLocation();

    const [listSearch, setListSearch] = useState<(ProductElem | CategoryElem)[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [flags, setFlags] = useState({
        openDropSearch: false,
        openDropCatalog: false,
        showTooltip: false
    });

    let handleSearch = (value: string) => {
        setSearchValue(value);
        setFlags(prev => ({...prev, "openDropSearch": true}));
        const findCatalog: ProductElem[] = catalog
            .filter(elem => elem.name.toLowerCase().includes(value.toLowerCase()))?.slice(0, 3);
        const findCategory: CategoryElem[] = category
            .filter(elem => elem.lable.toLowerCase().includes(value.toLowerCase()))?.slice(0, 1);
        setListSearch([...findCategory, ...findCatalog]);
    };
    let boldWordsSearch = (name: string) => {
        // функция выделяющая bold буквы, которые совпадают с поисковым запросом в названии товара.

        const parts = name.split(new RegExp(`(${searchValue})`, "gi"));
        let arr: JSX.Element[] = [];
        for (let indx = 0; indx < parts.length; indx++) {
            if (parts[indx].toLowerCase() === searchValue.toLowerCase()) {
                arr = [
                    ...arr,
                    <span style={{fontWeight: "bold"}} key={indx}>{parts[indx]}</span>
                ];
            } else arr = [...arr, <span key={indx}>{parts[indx]}</span>];
        }
        return arr;
    };
    return (

        <motion.div
            className="header"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <div
                    className="logo_block"
                    onClick={() => history("/")}
                >
                    <img src={logo} alt="logo"/>
                </div>
                <div
                    className="btn_catalog"
                    onMouseOver={() => setFlags(prev => ({...prev, "openDropCatalog": true}))}
                    onClick={() => history("/catalog-list")}
                    tabIndex={0}
                >
                    <img src={btn_catalog} alt="Каталог"/>
                    <span>Каталог</span>
                </div>
                <div
                    className={flags.openDropCatalog
                        ? "catalog_drop-down open"
                        : "catalog_drop-down"
                    }
                    onMouseLeave={() => setFlags(prev => ({...prev, "openDropCatalog": false}))}
                >
                    <ul className="catalog_list">
                        {category.map((elem, indx) =>
                            <li
                                className={location.pathname.includes(elem.value) ? "active" : ""}
                                onClick={() => {
                                    history(`/catalog-list/${elem.value}`);
                                    setFlags(prev => ({...prev, "openDropCatalog": false}));
                                }}
                                key={indx}
                            >
                                {elem.lable}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="search">
                    <input
                        type="text"
                        value={searchValue}
                        placeholder={"Поиск товара"}
                        onChange={(e) => handleSearch(e.target.value)}
                        onBlur={() => {
                            setTimeout(() => {
                                setFlags(prev => ({...prev, "openDropSearch": false}));
                            }, 100);
                        }}
                        onFocus={() => {
                            if (listSearch.length > 0)
                                setFlags(prev => ({...prev, "openDropSearch": true}));
                        }}
                    />
                    {listSearch.length > 0 &&
                        <>
                            <div className={flags.openDropSearch ? "drop_search open" : "drop_search"}>
                                {listSearch.map((elem, indx) => {
                                        if (elem.name) {
                                            if (elem.name.length > 24)
                                                return (
                                                    <Tooltip placement="right" title={elem.name} key={indx}>
                                                        <div onClick={() => history(`/product-card/${elem.id}`)}>
                                                            {boldWordsSearch(elem.name)}
                                                        </div>
                                                    </Tooltip>
                                                );
                                            else
                                                return <div
                                                    onClick={() => history(`/product-card/${elem.id}`)}
                                                    key={indx}
                                                >
                                                    {boldWordsSearch(elem.name)}
                                                </div>;
                                        }
                                        if (elem.lable) {
                                            return (
                                                <div
                                                    onClick={() => history(`/catalog-list/${elem.value}`)}
                                                    key={indx}
                                                >
                                                    {boldWordsSearch(elem.lable)}
                                                    <CategorySearch/>
                                                </div>
                                            );
                                        }
                                        return <></>;
                                    }
                                )}
                            </div>
                            <img src={search} className="search_icon" alt="Поиск"/>
                        </>
                    }
                </div>
                <div className="group_buttons">
                    <div
                        className={window.location.href.includes("/favorite") ? "button active" : "button"}
                        onClick={() => history("/favorite")}
                    >
                        <FavoriteHeader alt="Избранное"/>
                        <span>Избранное</span>
                        {favorite.data?.length > 0 &&
                            <div className="count"><span>{favorite.data?.length}</span></div>
                        }
                    </div>
                    <div
                        className={window.location.href.includes("/catalog-list") ? "button active" : "button"}
                        onClick={() => history("/catalog-list")}
                    >
                        <Order/>
                        <span>Каталог</span>
                    </div>
                    {/*<div
                        className={window.location.href.includes("/orderlist") ? "button active" : "button"}
                        onClick={() => history("/orderlist")}
                    >
                        <Order/>
                        <span>Заказы</span>
                    </div>*/}
                    <div
                        className={window.location.href.includes("/cart") ? "button active" : "button"}
                        onClick={() => history("/cart")}
                    >
                        <Cart/>
                        <span>Корзина</span>
                        {cart.data?.length > 0 &&
                            <div className="count"><span>{cart.data.length}</span></div>
                        }
                    </div>
                </div>
                <div className="sign_in">
                    <div
                        className={location.pathname.includes("authentification") ? "active" : ""}
                        onClick={() => history("/authentification")}
                    >
                        Регистрация
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export default Header;