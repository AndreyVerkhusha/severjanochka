import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeCart, changeFavorite, createCart, createFavorite, getAllDatas } from "./redux/actions/action";
import { RootState } from "./redux/reducers/";
import { Cart as CartType, Favorite as FavoriteType, ProductElem } from "./types/types";
import { AnimatePresence} from "framer-motion";

import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Favorite from "./pages/Favorite/Favorite";
import Footer from "./components/Footer/Footer";
import ProductCard from "./pages/ProductCard/ProductCard";
import Cart from "./pages/Cart/Cart";
import CategoryList from "./pages/CategoryList/CategoryList";
import CategoryIdentifier from "./pages/CategoryIdentifier/CategoryIdentifier";
import Registration from "./pages/Registration/Registration";

function App() {
    const dispatch = useDispatch();
    const {
        catalog, category, favorite, cart,
        cartLoading, resultFullPrice, resultDiscountPrice
    } = useSelector((state: RootState) => state.reducer);

    if (!localStorage.getItem("fakeUserId")) {
        const random = String(Math.floor(Math.random() * 10000));
        localStorage.setItem("fakeUserId", random);
    }

    let addedToCart = (item: ProductElem) => {
        let copyCart: CartType = JSON.parse(JSON.stringify(cart)); // глубокое копирование, чтобы стор не мутировал.
        if (copyCart.data === undefined) {
            let newCart = {
                id: Number(localStorage.getItem("fakeUserId")),
                data: [item]
            };
            dispatch(createCart(newCart));
        } else {
            copyCart.data.push(item);
            dispatch(changeCart(copyCart));
        }
    };
    let addedToFavorite = (item: ProductElem) => {
        let copyFavorite: FavoriteType = JSON.parse(JSON.stringify(favorite));//глубокое копирование,чтобы стор не мутировал.
        if (copyFavorite.data === undefined) {
            let newFavor = {
                id: Number(localStorage.getItem("fakeUserId")),
                data: [item]
            };
            dispatch(createFavorite(newFavor));
        } else {
            let findIndx = copyFavorite.data.findIndex(elem => elem.id === item.id);
            if (findIndx === -1) {
                copyFavorite.data.push(item);
            } else copyFavorite.data = copyFavorite.data.filter(elem => elem.id !== item.id);
            dispatch(changeFavorite(copyFavorite));
        }
    };

    useEffect(() => {
        dispatch(getAllDatas()); // получение каталога товаров, категорий, корзины.

        // фейковый id-шник для текущего пользователя. Используется для идентифицированния пользователя.
        //  Применение:
        //      удалять только свой комментарий в карточке товара;
        //      отображение только своей корзины c товарами;
        //      отображение только своего избранного;
    }, [dispatch]);
    return (
        <div className="app">
            <AnimatePresence>
                <Header
                    catalog={catalog}
                    category={category}
                    favorite={favorite}
                    cart={cart}
                />

                <Routes>
                    <Route
                        path={"/"}
                        element={
                            <Home
                                favorite={favorite}
                                catalog={catalog}
                                addedToCart={addedToCart}
                                cartLoading={cartLoading}
                                addedToFavorite={addedToFavorite}
                            />
                        }
                    />
                    <Route
                        path={"/catalog-list"}
                        element={
                            <CategoryList
                                category={category}
                            />
                        }
                    />
                    <Route
                        path={"/catalog-list/:identifier"}
                        element={
                            <CategoryIdentifier
                                catalog={catalog}
                                favorite={favorite}
                                category={category}
                                addedToCart={addedToCart}
                                cartLoading={cartLoading}
                                addedToFavorite={addedToFavorite}
                            />
                        }
                    />
                    <Route
                        path={"/favorite"}
                        element={
                            <Favorite
                                favorite={favorite}
                                addedToCart={addedToCart}
                                cartLoading={cartLoading}
                                addedToFavorite={addedToFavorite}
                            />
                        }
                    />
                    <Route
                        path={"/product-card/:id"}
                        element={
                            <ProductCard
                                catalog={catalog}
                                addedToCart={addedToCart}
                                favorite={favorite}
                                cartLoading={cartLoading}
                                addedToFavorite={addedToFavorite}
                            />
                        }
                    />
                    <Route
                        path={"/cart"}
                        element={
                            <Cart
                                cart={cart}
                                cartLoading={cartLoading}
                                resultFullPrice={resultFullPrice}
                                resultDiscountPrice={resultDiscountPrice}
                            />
                        }
                    />
                    <Route
                        path={"/authentification"}
                        element={
                            <Registration/>
                        }
                    />
                    {/* <Route
                    path={"*"}
                    element={<Navigate to="/" replace />}
                />*/}
                </Routes>
                <Footer/>
            </AnimatePresence>
        </div>
    );
}

export default App;
