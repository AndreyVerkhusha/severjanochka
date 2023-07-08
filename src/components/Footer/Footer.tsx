import React from "react";
import footer_logo from "../../images/Footer/footer_logo.svg";
import social_footer from "../../images/Footer/social_footer.svg";

const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="list_info">
                    <div className="logo"><img src={footer_logo} alt="Логотип" /></div>
                    <ul className="nav">
                        <li>О компании</li>
                        <li>Контакты</li>
                        <li>Вакансии</li>
                        <li>Статьи</li>
                        <li>Политика обработки персональных данных</li>
                    </ul>
                    <img src={social_footer} alt="Социальные сети" />
                </div>
            </div>
        </div>
    );
};

export default Footer;