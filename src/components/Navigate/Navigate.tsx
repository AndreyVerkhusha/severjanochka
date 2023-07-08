import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { customHelpersFunctions } from "../../utils/helpers";

import arrow from "../../images/Another/arrow.svg";

const Navigate = () => {
    const history = useNavigate();
    const location = useLocation();
    const pathArray = location.pathname.split("/").filter(Boolean);
    pathArray.unshift("home");

    return (
        <div className="navigate">
            {pathArray.map((elem, indx) =>
                <div
                    className="lable_row"
                    onClick={() => {
                        if (elem === "home") return history("/");
                        if (elem === "product-card") return;
                        history(`/${elem}`);
                    }}
                    key={indx}
                >
                    <div>{customHelpersFunctions.convertLocationName(elem)}</div>
                    {indx !== pathArray.length - 1 &&
                        <img src={arrow} alt=""/>
                    }
                </div>
            )}
        </div>
    );
};

export default Navigate;