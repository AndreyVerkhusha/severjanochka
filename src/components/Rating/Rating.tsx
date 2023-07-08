import React, { FC } from "react";

import { customHelpersFunctions } from "../../utils/helpers";
import { ProductElem } from "../../types/types";

import {ReactComponent as Star} from "../../images/Another/star_grey.svg";

type Props = {
    elem: ProductElem
}
const Rating: FC<Props> = ({elem}) => {
    return (
        <div className="rating">
            {Array(5).fill(0).map((el, ind) =>
                <div
                    className={customHelpersFunctions.currentRatingStar(elem, ind) ? "active" : ""}
                    key={ind}
                >
                    <Star />
                </div>
            )}
        </div>
    );
};

export default Rating;