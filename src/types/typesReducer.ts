import { Cart, CategoryElem, Favorite, ProductElem } from "./types";

export type InitialState = {
    catalog: ProductElem[];
    category: CategoryElem[];
    favorite: Favorite;
    cart: Cart;
    cartLoading: boolean;
    resultFullPrice: number;
    resultDiscountPrice: number;
}

export enum ActionTypes {
    GET_ALL_DATAS = "GET_ALL_DATAS",
    SET_CATALOG_DATA = "SET_CATALOG_DATA",
    SET_CATEGORY_DATA = "SET_CATEGORY_DATA",
    SET_CART_DATA = "SET_CART_DATA",
    CART_LOADING = "CART_LOADING",
    CREATE_FAVORITE = "CREATE_FAVORITE",
    SET_FAVORITE_DATA = "SET_FAVORITE_DATA",
    CHANGE_ITEMS_COMMENT = "CHANGE_ITEMS_COMMENT",
    RELOAD_PRODUCT_STORE = "RELOAD_PRODUCT_STORE",
    RELOAD_CART_STORE = "RELOAD_CART_STORE",
    RELOAD_FAVORITE_STORE = "RELOAD_FAVORITE_STORE",
    CHANGE_ITEMS_FAVORITE = "CHANGE_ITEMS_FAVORITE",
    CHANGE_ITEMS_CART = "CHANGE_ITEMS_CART",
    CREATE_CART = "CREATE_CART"
}

export type CatalogAction = {
    type: ActionTypes.SET_CATALOG_DATA;
    payload: ProductElem[];
}

export type CategoryAction = {
    type: ActionTypes.SET_CATEGORY_DATA;
    payload: CategoryElem[];
}

export type CartAction = {
    type: ActionTypes.SET_CART_DATA;
    payload: Cart[];
}

export type FavoriteAction = {
    type: ActionTypes.SET_FAVORITE_DATA;
    payload: Favorite[];
}

export type ChangeComment = {
    type: ActionTypes.CHANGE_ITEMS_COMMENT;
    payload: ProductElem;
    status: string;
}

export type ChangeCart = {
    type: ActionTypes.CHANGE_ITEMS_CART;
    payload: Cart;
}

export type CreateCart = {
    type: ActionTypes.CREATE_CART;
    payload: Cart;
}

export type CreateFavorite = {
    type: ActionTypes.RELOAD_FAVORITE_STORE;
    payload: Favorite;
}

export type ChangeFavorite = {
    type: ActionTypes.CHANGE_ITEMS_CART;
    payload: Favorite;
}

export type ReloadFavoriteStore = {
    type: ActionTypes.RELOAD_FAVORITE_STORE;
    payload: Favorite;
}

export type ReloadProductStore = {
    type: ActionTypes.RELOAD_PRODUCT_STORE;
    payload: ProductElem;
}

export type ReloadCartStore = {
    type: ActionTypes.RELOAD_CART_STORE;
    payload: Cart;
}

type createFavorite = {
    type: ActionTypes.CREATE_FAVORITE;
    payload: any;
}

type CartLoading = {
    type: ActionTypes.CART_LOADING;
    payload: boolean;
}

export type AllAction =
    createFavorite | CategoryAction | CatalogAction | CartAction | ReloadFavoriteStore |
    ReloadProductStore | ReloadCartStore | CartLoading | CreateCart | FavoriteAction;