import { render } from "@testing-library/react";

import Header from "./Header";
import { initialState } from "../../redux/reducers/reducer";


describe("Group test Header", () => {
    it("Render Header", () => {
        render(
            <Header
                catalog={initialState.catalog}
                cart={initialState.cart}
                category={initialState.category}
                favorite={initialState.favorite}
            />
        );

    });
});