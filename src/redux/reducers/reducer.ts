import { ActionTypes, AllAction, InitialState } from "../../types/typesReducer";
import { Cart, Favorite, ProductElem } from "../../types/types";

export const initialState: InitialState = {
    catalog: [],
    category: [],
    favorite: {} as Favorite,
    cart: {} as Cart,
    cartLoading: false,
    resultFullPrice: 0,
    resultDiscountPrice: 0
};

const Reducer = (state = initialState, action: AllAction): InitialState => {
    const fakeUserId = Number(localStorage.getItem("fakeUserId"));
    const calcAllPrice = (dataCart: ProductElem[], curentPrice: string): number => {
        if (dataCart?.length > 0) {
            if (curentPrice === "fullPrice")
                return dataCart.reduce((acc, cur) => acc + Number(cur.fullPrice.replace(",", ".")), 0);
            else
                return dataCart.reduce((acc, cur) => acc + Number(cur.discountPrice.replace(",", ".")), 0);
        }
        return 0;
    };

    switch (action.type) {
        case ActionTypes.SET_CATALOG_DATA:
            return {
                ...state,
                catalog: action.payload
            };
        case ActionTypes.SET_CATEGORY_DATA:
            return {
                ...state,
                category: action.payload
            };
        case ActionTypes.SET_CART_DATA:
            let newCart = {} as Cart;
            if (action.payload.length > 0 && fakeUserId) {
                for (let indx = 0; indx < action.payload.length; indx++) {
                    if (action.payload[indx].id === fakeUserId) {
                        newCart = action.payload[indx];
                        break;
                    }
                }
            }
            return {
                ...state,
                cart: newCart,
                resultFullPrice: calcAllPrice(newCart?.data?.length > 0 ? newCart.data : [], "fullPrice"),
                resultDiscountPrice: calcAllPrice(newCart?.data?.length > 0 ? newCart.data : [], "discountPrice")
            };
        case ActionTypes.SET_FAVORITE_DATA:
            let newFavor = {} as Cart;
            if (action.payload.length > 0 && fakeUserId) {
                for (let indx = 0; indx < action.payload.length; indx++) {
                    if (action.payload[indx].id === fakeUserId) {
                        newFavor.data = action.payload[indx].data;
                        newFavor.id = fakeUserId;
                        break;
                    }
                }
            }
            return {
                ...state,
                favorite: newFavor
            };
        case ActionTypes.RELOAD_PRODUCT_STORE:
            let newArrComm = [...state.catalog];
            let findIndx = newArrComm.findIndex(elm => elm.id === action.payload.id);
            if (findIndx !== -1) {
                newArrComm[findIndx] = action.payload;
            }
            return {
                ...state,
                catalog: newArrComm
            };
        case ActionTypes.RELOAD_CART_STORE:
            return {
                ...state,
                cart: action.payload,
                resultFullPrice: calcAllPrice(action.payload.data, "fullPrice"),
                resultDiscountPrice: calcAllPrice(action.payload.data, "discountPrice")
            };
        case ActionTypes.RELOAD_FAVORITE_STORE:
            return {
                ...state,
                favorite: action.payload
            };
        case ActionTypes.CREATE_FAVORITE:
            return {
                ...state,
                favorite: action.payload
            };
        case ActionTypes.CART_LOADING:
            return {
                ...state,
                cartLoading: action.payload
            };
        default:
            return state;
    }
};
export default Reducer;