import React, { FC, useEffect, useState } from "react";
import classNames from "classnames";
import { useDispatch } from "react-redux";
import { Cart as CartType, ProductElem } from "../../types/types";
import { changeCart } from "../../redux/actions/action";
import { customHelpersFunctions } from "../../utils/helpers";
import { motion } from "framer-motion";

import Navigate from "../../components/Navigate/Navigate";
import Spin from "../../components/Spin/Spin";
import increment from "../../images/Cart/increment.svg";
import decrement from "../../images/Cart/decrement.svg";
import bonus_icon from "../../images/Cart/bonus_icon.svg";
import no_image from "../../images/Card/no_image.png";
import Checkbox from "../../components/Checkbox/Checkbox";

type PropsCart = {
    cart: CartType;
    cartLoading: boolean;
    resultFullPrice: number;
    resultDiscountPrice: number;
}
type PropsCartItem = {
    item: ProductElem;
    count: number;
    fullPrice: number;
    discountPrice: number;
    incrementItem: (item: ProductElem) => void;
    decrementItem: (item: ProductElem) => void;
    cartLoading: boolean;
    loadingId: number | null;
    checkedIds: number[];
    setCheckedIds: (value: boolean | number) => void;
}

const CartItem: FC<PropsCartItem> = (props) => {
    let {
        item, count, fullPrice, discountPrice,
        incrementItem, decrementItem, cartLoading,
        loadingId, checkedIds, setCheckedIds
    } = props;

    return (
        <>
            <Checkbox
                id={String(item.id)}
                className={"checkbox-custom-label"}
                value={checkedIds.includes(item.id)}
                setValue={() => setCheckedIds(item.id)}
            />
            <div className="image">
                <img src={item.image || no_image} alt={item.name}/>
            </div>
            <div className="info">
                <div className="name">{item.name}</div>
                <div className="detail_price">
                    <div className="have_discount-price">
                        <div>{item.discountPrice}</div>
                        <div>С картой</div>
                    </div>
                    <div className="full_price">
                        <div>{item.fullPrice} за шт.</div>
                        <div>Обычная цена</div>
                    </div>
                    <div className="discount">
                        <span>{item.discountProcentague}</span>
                    </div>
                </div>
            </div>
            <div className="increm_decrem">
                <img
                    src={decrement}
                    onClick={() => {
                        if (!cartLoading)
                            decrementItem(item);
                    }}
                    alt="decrement"
                />
                {cartLoading && loadingId === item.id &&
                    <Spin/>
                }
                <span className={classNames({hide: cartLoading && loadingId === item.id})}>
                    {count}
                </span>
                <img
                    src={increment}
                    onClick={() => {
                        if (!cartLoading)
                            incrementItem(item);
                    }}
                    alt="increment"
                />
            </div>
            <div className="price">
                <span>{discountPrice} ₽</span>
                <span>{fullPrice} ₽</span>
            </div>
        </>
    );
};
const Cart: FC<PropsCart> = ({cart, cartLoading, resultFullPrice, resultDiscountPrice}) => {
    const dispatch = useDispatch();

    const [displayUniqItems, setDisplayUniqItems] = useState<ProductElem[]>([]);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [toggleFlagDiscount, setToggleFlagDiscount] = useState<boolean>(false); // флаг "списать с карты"
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [countCartDiscount] = useState<number>(200); // накопленные баллы на карте.
    const [minCartPay] = useState<number>(500); // минимальная сумма для покупки.

    let toDisplayUniqItems = (arr: ProductElem[]) => {
        // вывод пользователю только уникальных элентов массива.

        let tmpArray: number[] = [];
        let itemCheck = (id: number) => {
            if (tmpArray.indexOf(id) === -1) {
                tmpArray.push(id);
                return true;
            }
            return false;
        };
        return arr.filter((item) => item.id && itemCheck(item.id));
    };
    let calculateInItems = (item: ProductElem, currentCalc: string) => {
        // подсчёт суммы и количества для каждого элемента в корзине.

        let count = 0;
        let discountPrice = 0;
        let fullPrice = 0;

        for (let indx = 0; indx < cart.data.length; indx++) {
            if (cart.data[indx].id === item.id) {
                count += 1;
                discountPrice += Number(cart.data[indx].discountPrice.replace(",", "."));
                fullPrice += Number(cart.data[indx].fullPrice.replace(",", "."));
            }
        }

        if (currentCalc === "count")
            return count;
        if (currentCalc === "discountPrice")
            return Number(discountPrice.toFixed(2)); // округление до 2 символа после запятой
        if (currentCalc === "fullPrice")
            return Number(fullPrice.toFixed(2)); // округление до 2 символа после запятой

        return 0;
    };
    let decrementItem = (item: ProductElem) => {
        // найти обязательно последний index удаляемого объекта.
        // Иначе товары в списке могут поменяться местами после удаления.

        let copyCart = JSON.parse(JSON.stringify({...cart})); // используется глубокое копирование, чтобы стейт не мутировал.
        let indxRemove;
        for (let indx = copyCart.data.length - 1; indx > -1; indx--) {
            if (copyCart.data[indx].id === item.id) {
                indxRemove = indx;
                break;
            }
        }
        if (indxRemove !== undefined) {
            copyCart.data.splice(indxRemove, 1);
        }
        dispatch(changeCart(copyCart));
        setLoadingId(item.id); // обозначить в каком элементе списка будет крутиться спинер, пока идёт загрузка.
    };
    let incrementItem = (item: ProductElem) => {
        let copyCart = JSON.parse(JSON.stringify({...cart})); // используется глубокое копирование, чтобы стейт не мутировал.
        copyCart.data.push(item);
        dispatch(changeCart(copyCart));
        setLoadingId(item.id); // обозначить в каком элементе списка будет крутиться спинер, пока идёт загрузка.
    };
    let discountResult = () => {
        // функция высчитывает общую скидку, и, если надо, учтёт снятие бонусов на карте.

        let result = 0;
        if (resultDiscountPrice && resultFullPrice)
            result = Number(resultFullPrice.toFixed(2)) - Number(resultDiscountPrice.toFixed(2));
        if (toggleFlagDiscount)
            result += countCartDiscount;
        return result.toFixed(2);
    };
    let payResult = () => {
        // функция высчитывает конечную сумму к оплате

        let result = 0;
        if (resultFullPrice)
            result = Number(resultFullPrice.toFixed(2)) - Number(discountResult());
        if (result < 0)
            return 0;
        return result.toFixed(2);
    };
    let changeCheckedAll = (current: "checked" | "unchecked") => {
        // функция снятия \ выделения всех чекбоксов товаров в корзине

        let result: number[] = [];
        if (current === "unchecked")
            return result;

        if (displayUniqItems.length > 0) {
            for (let indx = 0; indx < displayUniqItems.length; indx++)
                result = [...result, displayUniqItems[indx].id];
        }
        return result;
    };
    let removeItem = () => {
        // удалить выбранные элементы в списке товаров

        let copyCart = JSON.parse(JSON.stringify({...cart})); // используется глубокое копирование, чтобы стейт не мутировал.
        copyCart.data = copyCart.data.filter((elem: ProductElem) => !checkedIds.includes(elem.id));
        dispatch(changeCart(copyCart));
    };

    useEffect(() => {
        if (cart !== undefined && Object.keys(cart).length > 0)
            setDisplayUniqItems(toDisplayUniqItems(JSON.parse(JSON.stringify(cart.data))));
    }, [cart, cartLoading]);
    return (
        <motion.div
            className="cart"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <Navigate/>
                <div className="h1">
                    <span>Корзина</span>
                    {cart?.data?.length > 0 &&
                        <div className="count_items">{cart.data.length}</div>
                    }
                </div>
                <main>
                    {displayUniqItems.length > 0 &&
                        <div className="check_all">
                            <div>
                                <Checkbox
                                    id={"checkedAll"}
                                    value={checkedAll}
                                    className={checkedIds.length === displayUniqItems.length
                                        ? "checkbox-custom-label checked_all midst_active"
                                        : "checkbox-custom-label checked_all"
                                    }
                                    label={checkedIds.length === displayUniqItems.length
                                        ? "Cнять все"
                                        : "Выделить все"
                                    }
                                    setValue={(value) => {
                                        if (typeof value === "boolean") {
                                            if (value === false) {
                                                if (checkedIds.length !== displayUniqItems.length) {
                                                    return setCheckedIds(changeCheckedAll("checked"));
                                                }
                                                setCheckedIds(changeCheckedAll("unchecked"));
                                                setCheckedAll(value);
                                            }
                                            if (value === true) {
                                                if (checkedIds.length === displayUniqItems.length)
                                                    return setCheckedIds(changeCheckedAll("unchecked"));
                                                setCheckedIds(changeCheckedAll("checked"));
                                                setCheckedAll(value);
                                            }
                                        }
                                    }}
                                />
                            </div>
                            {checkedIds.length > 0 &&
                                <div onClick={removeItem}>Удалить выбранные</div>
                            }
                        </div>
                    }
                    <div className="group_block">
                        <div className="list_items">
                            {displayUniqItems.length > 0
                                ? displayUniqItems.map((elem) =>
                                    <div className="item" key={elem.id}>
                                        <CartItem
                                            item={elem}
                                            count={calculateInItems(elem, "count")}
                                            fullPrice={calculateInItems(elem, "fullPrice")}
                                            discountPrice={calculateInItems(elem, "discountPrice")}
                                            decrementItem={decrementItem}
                                            incrementItem={incrementItem}
                                            cartLoading={cartLoading}
                                            loadingId={loadingId}
                                            checkedIds={checkedIds}
                                            setCheckedIds={(id) => {
                                                if (typeof id === "number") {
                                                    if (checkedIds.includes(id)) {
                                                        let newArr = [...checkedIds];
                                                        newArr = newArr.filter(elemId => elemId !== id);
                                                        if (newArr.length === 0)
                                                            setCheckedAll(false);
                                                        return setCheckedIds(newArr);
                                                    }
                                                    setCheckedIds(prev => [...prev, id]);
                                                }
                                            }}
                                        />
                                    </div>)
                                : <div className="no_data">Нет товаров в корзине.</div>
                            }
                        </div>
                        <div className="info_payment">
                            <div className="windraw_money">
                                <div className="toggle_checkbox">
                                    <label className="switch" htmlFor="checkbox_discount">
                                        <input
                                            type="checkbox"
                                            id="checkbox_discount"
                                            checked={toggleFlagDiscount}
                                            onChange={(e) => setToggleFlagDiscount(e.target.checked)}
                                        />
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                                <span>Списать {countCartDiscount} ₽</span>
                            </div>
                            <div className="count_accumulated">
                                На карте накоплено {countCartDiscount} ₽
                            </div>
                            <div className="count_product row">
                                <div>
                                    {cart.data?.length}
                                    {customHelpersFunctions.declension(cart.data?.length, [" товар", " товара", " товаров"])}
                                </div>
                                <div>{resultFullPrice.toFixed(2)} ₽</div>
                            </div>
                            <div className="discount row">
                                <div>Скидка</div>
                                <div>
                                    {discountResult()}
                                    ₽
                                </div>
                            </div>
                            <div className="result row">
                                <div>Итог</div>
                                <div>{payResult()} ₽</div>
                            </div>
                            <div className="increment_bonus">
                                <img src={bonus_icon} alt="bonus"/>
                                {displayUniqItems.length > 0 &&
                                    <span>
                                        Вы получаете
                                        {" "}
                                        <span style={{fontWeight: 600}}>
                                            {cart.data.length * 10} бонусов на карту
                                        </span>
                                    </span>
                                }
                            </div>
                            <div
                                className={payResult() < minCartPay
                                    ? "min_order active"
                                    : "min_order"
                                }
                            >
                                <span>Минимальная сумма заказа {minCartPay} ₽</span>
                            </div>
                            <div
                                className={payResult() < minCartPay
                                    ? "checkout_order disabled"
                                    : "checkout_order"
                                }
                                onClick={() => {
                                    if (payResult() >= minCartPay)
                                        return customHelpersFunctions
                                            .returnNotification("success", "Пока это всё");
                                    else return;
                                }}
                            >
                                {payResult() < minCartPay
                                    ? <span>Минимальная сумма заказа {minCartPay} ₽</span>
                                    : <span>Оформить заказ</span>
                                }

                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </motion.div>
    );
};

export default Cart;