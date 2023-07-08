import React, { FC } from "react";

import arrow from "../../images/Another/arrow.svg";

type TitleSectionProps = {
    title: string;
    titleRedirect?: string;
}
const TitleSection: FC<TitleSectionProps> = ({title, titleRedirect}) => {
    return (
        <div className="title">
            <div>{title}</div>
            {titleRedirect &&
                <div>
                    <span>{titleRedirect}</span>
                    <img src={arrow} alt="Перейти" />
                </div>
            }
        </div>
    );
};

export default TitleSection;