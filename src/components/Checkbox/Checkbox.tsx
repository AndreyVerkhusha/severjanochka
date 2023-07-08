import React, { FC } from "react";
type Props = {
    id: string;
    value: boolean;
    setValue: (value: boolean | number) => void;
    className: string;
    label?: string;
}
const Checkbox: FC<Props> = ({id,value, setValue, className, label}) => {
    return (
        <>
            <input
                className={"checkbox-custom"}
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                id={id}
                name="checkbox-1"
                type="checkbox"
            />
            <label
                htmlFor={id}
                className={className}
            >
                {label}
                <div className="midst" />
            </label>
        </>
    );
};

export default Checkbox;