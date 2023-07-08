import React, { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { CategoryElem } from "../../types/types";
import { motion } from "framer-motion";

import { getCatalogImage } from "../../images/Catalog";
import Navigate from "../../components/Navigate/Navigate";

type Props = {
    category: CategoryElem[];
}
const CategoryList: FC<Props> = ({category}) => {
    const params = useParams();
    const history = useNavigate();

    return (
        <motion.div
            className="catalog"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <Navigate/>
                <div className="title">Каталог</div>
                <main>
                    {category.length > 0 && Object.keys(params).length === 0 &&
                        category.map((elem, index) =>
                            <div
                                className={
                                    classNames("catalog_photo", {
                                        width_584: index === 0 || index === 8 || index === 10
                                    })
                                }
                                onClick={() => history(`/catalog-list/${elem.value}`)}
                                key={elem.value}
                            >
                                <img src={getCatalogImage(index)} alt="img"></img>
                                <span>{elem.lable}</span>
                            </div>
                        )
                    }
                </main>
            </div>
        </motion.div>
    );
};

export default CategoryList;