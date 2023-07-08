import React, { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import moment from "moment";

import { Comment as CommentType, Favorite as FavoriteType, ProductElem } from "../../types/types";
import { customHelpersFunctions } from "../../utils/helpers";
import { changeComment } from "../../redux/actions/action";

import Navigate from "../../components/Navigate/Navigate";
import Rating from "../../components/Rating/Rating";
import ProductList from "../../components/ProductList/ProductList";
import TitleSection from "../../components/TitleSection/TitleSection";
import bonus_icon from "../../images/Cart/bonus_icon.svg";
import comment_user from "../../images/Card/comment_user.svg";
import { ReactComponent as Card } from "../../images/Cart/cart.svg";
import { ReactComponent as Star } from "../../images/Another/star_yellow.svg";
import { motion } from "framer-motion";

type PropsRatingList = {
    count?: number;
}
type PropsProductCard = {
    catalog: ProductElem[];
    addedToCart: (item: ProductElem) => void;
    favorite: FavoriteType;
    cartLoading: boolean;
    addedToFavorite: (item: ProductElem) => void;

}
type PropsRemove = {
    removeComment: (id: number) => void;
}

const Comment: FC<CommentType & PropsRemove> = (props) => {
    const {id, rating, name, text, date, userId, removeComment} = props;
    return (
        <div className="comment">
            <div className="user">
                <img src={comment_user} alt="comment_user"/>
                <div className="name">{name}</div>
                {localStorage.getItem("fakeUserId") === userId &&
                    <div
                        className="remove"
                        onClick={() => removeComment(id)}
                    >
                        удалить мой комментарий
                    </div>
                }
            </div>
            <div className="rating_row">
                <RatingList count={rating}/>
                <div className="date">{moment(date).format("DD.MM.YY / HH:mm")}</div>
            </div>
            <div className="text">
                {text}
            </div>
        </div>
    );
};
const RatingList: FC<PropsRatingList> = ({count}) => {
    return (
        <div className="rating">
            {Array(5).fill(0).map((el, indx) =>
                <div
                    className={(typeof count !== "undefined") && indx < count ? "active" : ""}
                    key={indx}
                >
                    <Star/>
                </div>
            )}
        </div>
    );
};
const ProductCard: FC<PropsProductCard> = (props) => {
    const {catalog, addedToCart, favorite, cartLoading, addedToFavorite} = props;
    const params = useParams();
    const dispatch = useDispatch();

    const [currentElem, setCurrentElem] = useState<ProductElem>();
    const [currentIndexRating, setCurrentIndexRating] = useState<number | null>(null);
    const [nameCustomer, setNameCustomer] = useState<string>("");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [showHoverIndex, setShowHoverIndex] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, boolean>>({
        feedback: false,
        input: false
    });

    let calcCountRating = (rating: number[]) => {
        const obj: Record<number, number[]> = {
            5: [],
            4: [],
            3: [],
            2: [],
            1: []
        };
        for (let indx = 0; indx < rating.length; indx++) {
            if (rating[indx])
                obj[rating[indx]].push(rating[indx - 1]);
        }
        return obj;
    };
    let handleSubmitFeedback = () => {
        if (!currentElem) return;
        if (currentIndexRating === null && !feedbackMessage && !nameCustomer) {
            setErrors(prev => ({...prev, "textarea": true}));
            setErrors(prev => ({...prev, "input": true}));
            customHelpersFunctions.returnNotification("error", "Укажите рейтинг, ваше имя, и отзыв.");
            return setTimeout(() => {
                setErrors(prev => ({...prev, "textarea": false}));
                setErrors(prev => ({...prev, "input": false}));
            }, 1500);
        }
        if (!nameCustomer) {
            setErrors(prev => ({...prev, "input": true}));
            customHelpersFunctions.returnNotification("error", "Укажите ваше имя.");
            return setTimeout(() => {
                setErrors(prev => ({...prev, "input": false}));
            }, 1500);
        }
        if (currentIndexRating === null) {
            return customHelpersFunctions.returnNotification("error", "Укажите рейтинг.");
        }
        if (!feedbackMessage) {
            setErrors(prev => ({...prev, "textarea": true}));
            customHelpersFunctions.returnNotification("error", "Укажите отзыв.");
            return setTimeout(() => {
                setErrors(prev => ({...prev, "textarea": false}));
            }, 1500);
        }

        let newComment: CommentType = {
            id: customHelpersFunctions.crateUniqueId(),
            userId: String(localStorage.getItem("fakeUserId")),
            name: nameCustomer,
            rating: currentIndexRating + 1,
            text: feedbackMessage,
            date: new Date().toISOString()
        };
        let newCurrentElem = {...currentElem};
        newCurrentElem.comments = [...newCurrentElem.comments, newComment];
        dispatch(changeComment(newCurrentElem, "Комментарий успешно добавлен"));
        // очистить state
        setFeedbackMessage("");
        setShowHoverIndex(null);
        setCurrentIndexRating(null);
        setNameCustomer("");
    };
    let handleRemoveComment = (commentId: number) => {
        if (typeof currentElem !== "undefined") {
            let newCurrentElem = {...currentElem};
            newCurrentElem.comments = currentElem.comments.filter(com => com.id !== commentId);
            setCurrentElem(newCurrentElem);
            dispatch(changeComment(newCurrentElem, "Комментарий успешно удалён"));
        }
    };

    useEffect(() => {
        if (catalog.length > 0)
            setCurrentElem(catalog.find(elem => String(elem.id) === params.id));
    }, [catalog, params.id]);
    return (
        <motion.div
            className="product_card"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <Navigate/>
                {currentElem !== undefined &&
                    <>
                        <div className="name_product">{currentElem.name}</div>
                        <Rating elem={currentElem}/>
                        <div className="preview_elem">
                            <div className="image">
                                <img src={currentElem.image} alt={currentElem.name}/>
                            </div>
                            <div className="info">
                                <div className="price">
                                    <div className="standart">
                                        <div>{currentElem.fullPrice} ₽</div>
                                        <div>Обычная цена</div>
                                    </div>
                                    <div className="discount">
                                        <div>{currentElem.discountPrice} ₽</div>
                                        <div>С картой Северяночки</div>
                                    </div>
                                </div>
                                <div
                                    className="btn_to-card"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addedToCart(currentElem);
                                    }}
                                >
                                    В корзину
                                    <Card/>
                                </div>
                                <div className="bonus_count">
                                    <img src={bonus_icon} alt="Количество бонусов."/>
                                    <span>Вы получаете <span style={{fontWeight: 700}}>10 бонусов</span></span>
                                </div>
                                <div className="row_info">
                                    <div className="name">Бренд</div>
                                    <div className="value">ПРОСТОКВАШИНО</div>
                                </div>
                                <div className="row_info">
                                    <div className="name">Страна производителя</div>
                                    <div className="value">Россия</div>
                                </div>
                                <div className="row_info">
                                    <div className="name">Упаковка</div>
                                    <div className="value">180 г</div>
                                </div>
                            </div>
                        </div>
                        <TitleSection title={"С этим товаром покупают"}/>
                        <ProductList
                            items={catalog.slice(26, 30)}
                            favorite={favorite}
                            addedToCart={addedToCart}
                            cartLoading={cartLoading}
                            addedToFavorite={addedToFavorite}
                        />
                        <div className="comments_section">
                            <div className="title">Отзывы</div>
                            <div className="group_block">
                                <ul className="rating_list">
                                    {currentElem.rating.map((elem, indx) =>
                                        <li key={indx}>
                                            <span>{1 + indx}</span>
                                            <RatingList count={1 + indx}/>
                                            <span>{calcCountRating(currentElem.rating)[indx + 1].length}</span>
                                        </li>
                                    )}
                                </ul>
                                <div className="comments_list">
                                    {currentElem.comments.map((elem, indx) =>
                                        <div key={indx}>
                                            <Comment {...elem} removeComment={(id) => handleRemoveComment(id)}/>
                                        </div>
                                    )}
                                    <div className="your_result">
                                        <span>Ваша оценка</span>
                                        <div className="rating">
                                            {Array(5).fill(0).map((el, indx) =>
                                                <div
                                                    className={
                                                        classNames(
                                                            {
                                                                active: showHoverIndex !== null &&
                                                                    showHoverIndex >= indx
                                                            },
                                                            {
                                                                active: currentIndexRating !== null &&
                                                                    currentIndexRating >= indx
                                                            }
                                                        )}
                                                    onClick={() => setCurrentIndexRating(indx)}
                                                    onMouseOver={() => setShowHoverIndex(indx)}
                                                    onMouseLeave={() => setShowHoverIndex(null)}
                                                    key={indx}
                                                >
                                                    <Star/>
                                                </div>
                                            )}
                                        </div>
                                        <span>Вашe имя</span>
                                        <div className="name_customer">
                                            <input
                                                className={errors.input ? "error" : ""}
                                                value={nameCustomer}
                                                onChange={(e) => setNameCustomer(e.target.value)}
                                                maxLength={16}
                                            />
                                        </div>
                                    </div>
                                    <div className="feedback_message">
                                    <textarea
                                        className={errors.textarea ? "error" : ""}
                                        value={feedbackMessage}
                                        onChange={(e) => setFeedbackMessage(e.target.value)}
                                        rows={4}
                                        placeholder="Ваш отзыв"
                                    />
                                        <div
                                            className="btn_send"
                                            onClick={handleSubmitFeedback}
                                        >
                                            Отправить отзыв
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TitleSection title={"Акции"}/>
                        <ProductList
                            items={catalog.slice(30, 34)}
                            favorite={favorite}
                            addedToCart={addedToCart}
                            cartLoading={cartLoading}
                            addedToFavorite={addedToFavorite}
                        />
                    </>
                }
            </div>
        </motion.div>
    );
};

export default ProductCard;