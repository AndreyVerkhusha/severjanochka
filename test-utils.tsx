import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { Cart, Favorite } from "./src/types/types";

const initialState = {
    catalog: [],
    category: [],
    favorite: {} as Favorite,
    cart: {} as Cart,
    cartLoading: false,
    resultFullPrice: 0,
    resultDiscountPrice: 0
};

function renderWithWrapers(
    ui: React.ReactElement,
    {
        store = initialState,
        ...options
    } = {}
) {
    function Wrapper({children}: PropsWithChildren<{}>) {
        return (
            // @ts-ignore
            <Provider store={store}>
                {children}
            </Provider>
        );
    }

    return {store, ...render(ui, {wrapper: Wrapper, ...options})};
}


export * from "@testing-library/react";
export { renderWithWrapers as render };