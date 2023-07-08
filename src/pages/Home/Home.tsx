import React, { FC, useState } from "react";
import { Favorite, ProductElem } from "../../types/types";

import ProductList from "../../components/ProductList/ProductList";
import TitleSection from "../../components/TitleSection/TitleSection";
import { motion } from "framer-motion";

import special_1 from "../../images/Home/special_1.svg";
import special_2 from "../../images/Home/special_2.svg";
import special_3 from "../../images/Home/special_3.svg";
import article_1 from "../../images/Home/article_1.svg";
import article_2 from "../../images/Home/article_2.svg";
import article_3 from "../../images/Home/article_3.svg";

type Props = {
    catalog: ProductElem[];
    favorite: Favorite;
    addedToCart: (item: ProductElem) => void;
    addedToFavorite: (item: ProductElem) => void;
    cartLoading: boolean;
}
const Home: FC<Props> = ({favorite, catalog, addedToCart, addedToFavorite, cartLoading}) => {
    const [activeLocation, setActiveLocation] = useState(0);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            {catalog.length > 0 &&
                <div className="home">
                    <div className="pattern"/>
                    <div className="pattern_2"/>
                    <div className="container">
                        <TitleSection title={"Акции"}/>
                        <ProductList
                            items={catalog.slice(0, 8)}
                            favorite={favorite}
                            addedToCart={addedToCart}
                            cartLoading={cartLoading}
                            addedToFavorite={addedToFavorite}
                        />
                        <TitleSection title={"Новинки"}/>
                        <ProductList
                            items={catalog.slice(6, 14)}
                            favorite={favorite}
                            addedToCart={addedToCart}
                            cartLoading={cartLoading}
                            addedToFavorite={addedToFavorite}
                        />
                        <div className="special">
                            <div className="card">
                                <div className="group_text">
                                    <div className="name">Оформите карту «Северяночка»</div>
                                    <div className="info">И получайте бонусы при покупке в магазинах и на сайте</div>
                                </div>
                                <img src={special_1} className="image" alt="Северяночка"/>
                            </div>
                            <div className="sell">
                                <div className="group_text">
                                    <div className="name">Покупайте акционные товары</div>
                                    <div className="info">И получайте вдвое больше бонусов</div>
                                </div>
                                <img src={special_2} className="image" alt="Северяночка"/>
                                <img src={special_3} className="image_elem-1" alt=""/>
                                <img src={special_3} className="image_elem-2" alt=""/>
                            </div>
                        </div>
                        <TitleSection title={"Наши магазины"}/>
                        <div className="location_block">
                            <div className="nav_list">
                                <div
                                    className={activeLocation === 0 ? "btn active" : "btn"}
                                    onClick={() => setActiveLocation(0)}
                                >
                                    <span>ул.Пушкина</span>
                                </div>
                                <div
                                    className={activeLocation === 1 ? "btn active" : "btn"}
                                    onClick={() => setActiveLocation(1)}
                                >
                                    <span>Невский проспект</span>
                                </div>
                                <div
                                    className={activeLocation === 2 ? "btn active" : "btn"}
                                    onClick={() => setActiveLocation(2)}
                                >
                                    <span>Кремль</span>
                                </div>
                            </div>
                            {activeLocation === 0 &&
                                <iframe
                                    src={
                                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2361.192811722237!2d91.42" +
                                        "096091585238!3d53.714827480057906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2" +
                                        "!1s0x5d2c3d439b7a2499%3A0x2881e3f6dfe09a4d!2z0JTQvtC8INCa0L7Qu9C-0YLRg9GI0L" +
                                        "rQuNC90LAu!5e0!3m2!1sru!2sru!4v1669582354302!5m2!1sru!2sru"
                                    }
                                    width="100%"
                                    height="410"
                                    style={{border: 0}}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="myFrame1"
                                />
                            }

                            {activeLocation === 1 &&
                                <iframe
                                    src={
                                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1999.057956857937!2d30" +
                                        ".35796341290305!3d59.931180462596004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!" +
                                        "3m3!1m2!1s0x469631a5e66d51c5%3A0x6f00589ac258db97!2z0J3QtdCy0YHQutC40Lkg0L_RgC4" +
                                        "sINCh0LDQvdC60YIt0J_QtdGC0LXRgNCx0YPRgNCz!5e0!3m2!1sru!2s" +
                                        "ru!4v1669575236439!5m2!1sru!2sru"
                                    }
                                    width="100%"
                                    height="410"
                                    style={{border: 0}}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="myFrame2"
                                />
                            }
                            {activeLocation === 2 &&
                                <iframe
                                    src={
                                        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.372780580629!2d37.612" +
                                        "63385879531!3d55.75202622286786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!" +
                                        "1m2!1s0x46b54a50b315e573%3A0xa886bf5a3d9b2e68!2z0JzQvtGB0LrQvtCy0YHQutC40Lkg0" +
                                        "JrRgNC10LzQu9GM!5e0!3m2!1sru!2sru!4v1669575081040!5m2!1sru!2sru"
                                    }
                                    width="100%"
                                    height="410"
                                    style={{border: 0}}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="myFrame3"
                                />
                            }

                        </div>
                        <TitleSection title={"Статьи"}/>
                        <ul className="article_list">
                            <li>
                                <div className="preview_image-block">
                                    <img src={article_1} alt="Режим использования масок"/>
                                </div>
                                <div className="preview_info-block">
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="title_article">
                                        Режим использования масок и
                                        перчаток на территории магазинов
                                    </div>
                                    <div className="info_article">
                                        Подробная информация о режимах использования масок и перчаток
                                        на территории магазинов "ЛЕНТА".
                                        Информация обновляется каждый будний день.
                                    </div>
                                    <div className="btn_info">Подробнее</div>
                                </div>
                            </li>
                            <li>
                                <div className="preview_image-block">
                                    <img src={article_2} alt="Весеннее настроение для каждой"/>
                                </div>
                                <div className="preview_info-block">
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="title_article">
                                        Весеннее настроение для каждой
                                    </div>
                                    <div className="info_article">
                                        8 Марта – это не просто Международный женский день, это ещё день тюльпанов,
                                        приятных сюрпризов и праздничных тёплых пожеланий.
                                    </div>
                                    <div className="btn_info">Подробнее</div>
                                </div>
                            </li>
                            <li>
                                <div className="preview_image-block">
                                    <img src={article_3} alt="Голосуем!"/>
                                </div>
                                <div className="preview_info-block">
                                    <div className="date">{new Date().toLocaleDateString()}</div>
                                    <div className="title_article">
                                        ЗОЖ или ФАСТФУД. А вы на чьей стороне? Голосуем!
                                    </div>
                                    <div className="info_article">
                                        Голосуйте за любимые категории, выбирайте категорию-победителя в
                                        мобильном приложении и получайте кешбэк 10% баллами в апреле!
                                    </div>
                                    <div className="btn_info">Подробнее</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </motion.div>
    );
};

export default Home;