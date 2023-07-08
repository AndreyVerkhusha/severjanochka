import { ActionTypes } from "../../types/typesReducer";
import { Cart, CategoryElem, Favorite, ProductElem } from "../../types/types";

export const getAllDatas = () =>
    ({type: ActionTypes.GET_ALL_DATAS});

export const setCatalog = (payload: ProductElem) =>
    ({type: ActionTypes.SET_CATALOG_DATA, payload});

export const setCategory = (payload: CategoryElem) =>
    ({type: ActionTypes.SET_CATEGORY_DATA, payload});

export const setCart = (payload: Cart) =>
    ({type: ActionTypes.SET_CART_DATA, payload});

export const setFavorite = (payload: Cart) =>
    ({type: ActionTypes.SET_FAVORITE_DATA, payload});

export const changeComment = (payload: ProductElem, status: string) =>
    ({type: ActionTypes.CHANGE_ITEMS_COMMENT, payload, status});

export const changeCart = (payload: Cart) =>
    ({type: ActionTypes.CHANGE_ITEMS_CART, payload});

export const createCart = (payload: Cart) =>
    ({type: ActionTypes.CREATE_CART, payload});

export const cartLoading = (payload: boolean) =>
    ({type: ActionTypes.CART_LOADING, payload});

export const putProductStore = (action: ProductElem) =>
    ({type: ActionTypes.RELOAD_PRODUCT_STORE, payload: action});

export const putCartStore = (action: Cart) =>
    ({type: ActionTypes.RELOAD_CART_STORE, payload: action});

export const createFavorite = (action: Favorite) =>
    ({type: ActionTypes.CREATE_FAVORITE, payload: action});

export const changeFavorite = (payload: Favorite) =>
    ({type: ActionTypes.CHANGE_ITEMS_FAVORITE, payload});

export const putFavoriteStore = (action: ProductElem[]) =>
    ({type: ActionTypes.RELOAD_FAVORITE_STORE, payload: action});