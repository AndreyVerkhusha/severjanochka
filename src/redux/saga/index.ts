import { all, call, delay, put, takeEvery } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { ActionTypes, ChangeCart, ChangeComment, ChangeFavorite, CreateFavorite } from "../../types/typesReducer";
import {
    cartLoading,
    putCartStore,
    putFavoriteStore,
    putProductStore,
    setCart,
    setCatalog,
    setCategory,
    setFavorite
} from "../actions/action";
import { customHelpersFunctions } from "../../utils/helpers";

const contentType = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
};

function* fetchAllDatas() {
    try {
        const resultCatalog: AxiosResponse = yield call(() =>
            axios.get("https://vercel-server-delta.vercel.app/catalog/"));
        if (resultCatalog.data.length > 0)
            yield put(setCatalog(resultCatalog.data));

        const resultCategory: AxiosResponse = yield call(() =>
            axios.get("https://vercel-server-delta.vercel.app/category/"));
        if (resultCategory.data.length > 0)
            yield put(setCategory(resultCategory.data));

        const resultCart: AxiosResponse = yield call(() =>
            axios.get("https://vercel-server-delta.vercel.app/cart/"));
        if (resultCart.data.length > 0) {
            yield put(setCart(resultCart.data));
        }

        const resultFavorite: AxiosResponse = yield call(() =>
            axios.get("https://vercel-server-delta.vercel.app/favorite/"));
        if (resultFavorite.data.length > 0) {
            yield put(setFavorite(resultFavorite.data));
        }

    } catch (e) {
        if (e instanceof Error && e.message) {
            return customHelpersFunctions.returnNotification("error", e.message);
        }
    }
}

function* changeComment({payload, status}: ChangeComment) {

    // Используя пакет json-server нельзя обратиться к дочерним полям объекта, и элеметарно добавить \ удалить в них данные.
    // По-этому просто обновляю весь элемент, вместе с массивом комментариев через put-запрос.
    // Если запрос отработал удачно, при добавлении\удалении комментария передаю статус, который
    // в виде notification выводится пользователю. Так-же обновляется карточка товара в store redux.

    try {
        const result: AxiosResponse = yield call(() =>
            axios.put(`https://vercel-server-delta.vercel.app/catalog/${payload.id}/`, payload, contentType));
        if (result.data) {
            yield put(putProductStore(payload));
            return customHelpersFunctions.returnNotification("success", status);
        }
    } catch (e) {
        if (e instanceof Error && e.message)
            return customHelpersFunctions.returnNotification("error", e.message);
    }
}

function* changeCart({payload}: ChangeCart) {
    const fakeUserId = localStorage.getItem("fakeUserId");
    // Используя пакет json-server нельзя обратиться к дочерним полям объекта, и элеметарно добавить \ удалить в них данные.
    // По-этому просто обновляю весь элемент, вместе с массивом корзины через put-запрос.
    // Если запрос отработал удачно обновляется карточка товара в store redux.

    yield put(cartLoading(true)); // добавил индикацию загрузки (спинер крутящийся).
    yield delay(500);// задержка 700 мс. Чтобы вы увидели этот спинер
    try {
        const result: AxiosResponse = yield call(() =>
            axios.put(`https://vercel-server-delta.vercel.app/cart/${fakeUserId}/`, payload, contentType));
        if (result.data)
            yield put(putCartStore(result.data));

    } catch (e) {
        yield put(cartLoading(false));
        if (e instanceof Error && e.message)
            return customHelpersFunctions.returnNotification("error", e.message);
    } finally {
        yield put(cartLoading(false));
    }
}

function* createCart({payload}: ChangeCart) {
    yield put(cartLoading(true)); // добавил индикацию загрузки (спинер крутящийся).
    yield delay(500);// задержка 700 мс. Чтобы вы увидели этот спинер
    try {
        const result: AxiosResponse = yield call(() =>
            axios.post("https://vercel-server-delta.vercel.app/cart/", payload, contentType));
        if (result.data)
            yield put(putCartStore(result.data));
    } catch (e) {
        if (e instanceof Error && e.message)
            return customHelpersFunctions.returnNotification("error", e.message);
    } finally {
        yield put(cartLoading(false));
    }
}

function* createFavorite({payload}: CreateFavorite) {
    try {
        const result: AxiosResponse = yield call(() =>
            axios.post("https://vercel-server-delta.vercel.app/favorite/", payload, contentType));
        if (result.data)
            yield put(putFavoriteStore(result.data));
    } catch (e) {
        if (e instanceof Error && e.message)
            return customHelpersFunctions.returnNotification("error", e.message);
    }
}

function* changeFavorite({payload}: ChangeFavorite) {
    const fakeUserId = localStorage.getItem("fakeUserId");
    // Используя пакет json-server нельзя обратиться к дочерним полям объекта, и элеметарно добавить \ удалить в них данные.
    // По-этому просто обновляю весь элемент, вместе с массивом корзины через put-запрос.
    // Если запрос отработал удачно обновляется карточка товара в store redux.

    try {
        const result: AxiosResponse = yield call(() =>
            axios.put(`https://vercel-server-delta.vercel.app/favorite/${fakeUserId}/`, payload, contentType));
        if (result.data)
            yield put(putFavoriteStore(result.data));
    } catch (e) {
        if (e instanceof Error && e.message)
            return customHelpersFunctions.returnNotification("error", e.message);
    }
}

function* mySaga() {
    yield all([
        takeEvery(ActionTypes.GET_ALL_DATAS, fetchAllDatas),
        takeEvery(ActionTypes.CHANGE_ITEMS_COMMENT, changeComment),
        takeEvery(ActionTypes.CHANGE_ITEMS_CART, changeCart),
        takeEvery(ActionTypes.CREATE_CART, createCart),
        takeEvery(ActionTypes.CREATE_FAVORITE, createFavorite),
        takeEvery(ActionTypes.CHANGE_ITEMS_FAVORITE, changeFavorite)
    ]);
}

export default mySaga;