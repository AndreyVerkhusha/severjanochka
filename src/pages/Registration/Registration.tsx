import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import * as yup from "yup";
import "dayjs/locale/ru";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import regions from "../../data/regions.json";

import { customHelpersFunctions } from "../../utils/helpers";
import { Tooltip } from "antd";
import { motion } from "framer-motion";
import { Formik } from "formik";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

import { ReactComponent as ShowHidePassword } from "../../images/Another/show_hide.svg";
import { ReactComponent as Arrow } from "../../images/Another/arrow.svg";
import { ReactComponent as Info } from "../../images/Another/info.svg";


type SelectProps = {
    data: string[];
    flags: boolean;
    setFlags: Dispatch<SetStateAction<Record<string, boolean>>>;
    callback: (value: string, names: string[]) => string[];
    setCurrentSelect: Dispatch<SetStateAction<string>>;
    placeholder: string;
    currentSelect: string;
    currentInput: string;
}
const CustomSelect: FC<SelectProps> = (props) => {
    let {
        data, flags, setFlags, setCurrentSelect, currentInput,
        callback, placeholder, currentSelect
    } = props;

    return (
        <div className={flags ? "input_region active" : "input_region"}>
            <div
                className={"drop_parent"}
                tabIndex={0}
                onBlur={() =>
                    setTimeout(() => {
                        setFlags(prev => ({...prev, [currentInput]: false}));
                    }, 100)
                }
                onFocus={() => setFlags(prev => ({...prev, [currentInput]: true}))}
                onContextMenu={(e) => e.stopPropagation()}
            >
                <input
                    type="text"
                    value={currentSelect}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setCurrentSelect(e.target.value);
                    }}
                    onFocus={() => {
                        setTimeout(() => {
                            setFlags(prev => ({...prev, [currentInput]: true}));
                        }, 100);
                    }}
                    autoComplete="off"
                />
                <div className="drop_children">
                    {data.length > 0 &&
                        callback(currentSelect, data).map(elem =>
                            <div
                                className="region"
                                onClick={() => {
                                    setCurrentSelect(elem);
                                    setTimeout(() => {
                                        setFlags(prev => ({...prev, [currentInput]: false}));
                                    }, 100);
                                }}
                                key={elem}
                            >{elem}
                            </div>
                        )
                    }
                </div>
            </div>
            <div
                className="arrow"
                tabIndex={0}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                    setFlags(prev => ({...prev, [currentInput]: !flags}));
                }}
                onBlur={() => setFlags(prev => ({...prev, [currentInput]: false}))}
            >
                <Arrow/>
            </div>
        </div>
    );
};
const Registration = () => {
    const [value, setValue] = React.useState<Dayjs | null>(dayjs("1990.01.01"));
    const [typePassword, setTypePassword] = useState<string>("password");
    const [typePasswordConfirm, setTypePasswordConfirm] = useState<string>("password");
    const [regionNames, setRegionNames] = useState<string[]>([]);
    const [currentRegion, setCurrentRegion] = useState<string>("");
    const [locationNames, setLocationNames] = useState<string[]>([]);
    const [currentLocation, setCurrentLocation] = useState<string>("");
    const [activeGender, setActiveGender] = useState<number>(0);
    const [flags, setFlags] = useState<Record<string, boolean>>({
        region: false,
        location: false,
        hoverRegion: false,
        hoverLocation: false
    });

    const dateFormat = "DD.MM.YYYY";
    const validationSchema = yup.object({
        phone: yup
            .number().typeError("Только цифра")
            .required("Обязательное поле")
            .test("length_max", "Длина не более 12 символов", (val) => String(val).length <= 12)
            .test("length_min", "Длина не менее 10 символов", (val) => String(val).length >= 10),
        name: yup
            .string()
            .min(2, "Минимум 2 символа")
            .max(16, "Максимум 16 символов")
            .required("Обязательное поле"),
        lastName: yup
            .string()
            .min(2, "Минимум 2 символа")
            .max(16, "Максимум 16 символов")
            .required("Обязательное поле"),
        password: yup
            .string()
            .min(6, "Минимум 6 символов")
            .max(16, "Максимум 16 символов")
            .matches(/^[a-zA-Z0-9]+$/, "Только латинница")
            .required("Обязательное поле"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Пароли не совпадают")
            .required("Обязательное поле"),
        email: yup
            .string()
            .email("Введите валидный email")
            .required("Обязательное поле")
    });

    let getNamesLocation = (currentRegion = "") => {
        if (Object.values(regions).length > 0) {
            let locationNames: string[] = [];
            for (let indx = 0; indx < regions.areas.length; indx++) {
                if (currentRegion && regions.areas[indx].name === currentRegion) {
                    for (let indxLocation = 0; indxLocation < regions.areas[indx].areas.length; indxLocation++)
                        locationNames = [...locationNames, regions.areas[indx].areas[indxLocation].name];
                    return setLocationNames(locationNames);
                }
            }
            setLocationNames(locationNames);
        }
    };
    let toDisplayLocation = (value: string, locationNames: string[]) => {
        if (value) {
            return locationNames
                .filter(elem => elem.toLowerCase().includes(value.toLowerCase()))?.slice(0, 35);
        }
        return locationNames.slice(0, 35);
    };
    let getNamesRegion = () => {
        if (Object.values(regions).length > 0) {
            let regionNames: string[] = [];
            for (let indx = 0; indx < regions.areas.length; indx++) {
                regionNames = [...regionNames, regions.areas[indx].name];
            }
            setRegionNames(regionNames);
        }
    };
    let toDisplayRegion = (value: string, regionNames: string[]) => {
        if (value) {
            return regionNames
                .filter(elem => elem.toLowerCase().includes(value.toLowerCase()))?.slice(0, 35);
        }
        return regionNames.slice(0, 35);
    };

    let callbackRegion = useCallback((value: string, regionNames: string[]) => {
        return toDisplayRegion(value, regionNames);
    }, []);
    let callbackLocation = useCallback((value: string, locationNames: string[]) => {
        return toDisplayLocation(value, locationNames);
    }, []);

    useEffect(() => {
        getNamesRegion();
    }, []);
    useEffect(() => {
        if (currentRegion) {
            getNamesLocation(currentRegion);
        }
    }, [currentRegion]);
    return (
        <motion.div
            className="registration"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <div className="container">
                <div className="h1">Регистрация</div>
                <div className="h2">Обязательные поля</div>
                <Formik
                    initialValues={{
                        phone: "",
                        name: "",
                        lastName: "",
                        password: "",
                        confirmPassword: "",
                        cardNumber: "",
                        email: ""
                    }}
                    validateOnBlur={true}
                    onSubmit={() => {
                    }}
                    validationSchema={validationSchema}

                >
                    {({
                          values, errors, touched,
                          handleChange, handleBlur,
                          isValid, dirty
                      }) =>
                        <>
                            <div className="required_block">
                                <div className="inputs_col">
                                    <div className="input_group-label">
                                        <label htmlFor={"phone"}>
                                            Телефон
                                        </label>
                                        <input
                                            name={"phone"}
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type={"number"}
                                            id={"phone"}
                                        />
                                    </div>
                                    <div className={classNames("error", {show: touched.phone && errors.phone})}>
                                        {errors.phone !== undefined ? errors.phone : ""}
                                    </div>
                                    <div className="input_group-label">
                                        <label htmlFor={"name"}>Имя</label>
                                        <input
                                            name={"name"}
                                            value={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id={"name"}
                                        />
                                        <div className={classNames("error", {show: touched.name && errors.name})}>
                                            {errors.name !== undefined ? errors.name : ""}
                                        </div>
                                    </div>
                                    <div className="input_group-label">
                                        <label htmlFor={"lastName"}>Фамилия</label>
                                        <input
                                            name={"lastName"}
                                            value={values.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id={"lastName"}
                                        />
                                        <div
                                            className={classNames("error", {show: touched.lastName && errors.lastName})}>
                                            {errors.lastName !== undefined ? errors.lastName : ""}
                                        </div>
                                    </div>
                                    <div className="input_group-label">
                                        <div className="password_block">
                                            <label
                                                htmlFor={"password"}>
                                                Пароль
                                                <Tooltip
                                                    title="Минимум 6 символов. Только латинница">
                                                    <Info/>
                                                </Tooltip>
                                            </label>
                                            <input
                                                name={"password"}
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                id={"password"}
                                                type={typePassword}
                                                autoComplete="new-password"
                                            />
                                            <ShowHidePassword
                                                onClick={() => {
                                                    setTypePassword(prev => prev === "password" ? "text" : "password");
                                                }}
                                            />
                                            <div
                                                className={classNames("error", {show: touched.password && errors.password})}>
                                                {errors.password !== undefined ? errors.password : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input_group-label">
                                        <div className="password_block">
                                            <label htmlFor={"confirmPassword"}>Повторите пароль</label>
                                            <input
                                                name={"confirmPassword"}
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                id={"confirmPassword"}
                                                type={typePasswordConfirm}
                                                autoComplete="new-password"
                                            />
                                            <ShowHidePassword
                                                onClick={() =>
                                                    setTypePasswordConfirm(prev =>
                                                        prev === "password" ? "text" : "password")}
                                            />
                                            <div
                                                className={
                                                    classNames(
                                                        "error",
                                                        {show: touched.confirmPassword && errors.confirmPassword}
                                                    )
                                                }
                                            >
                                                {errors.confirmPassword !== undefined ? errors.confirmPassword : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input_group-label">
                                        <label htmlFor={"email"}>E-mail</label>
                                        <input
                                            name={"email"}
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id={"email"}
                                        />
                                        <div className={classNames("error", {show: touched.email && errors.email})}>
                                            {errors.email !== undefined ? errors.email : ""}
                                        </div>
                                    </div>
                                </div>
                                <div className="select_col">
                                    <div className="input_group-label">
                                        <label>Дата рождения</label>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                            adapterLocale={"ru"}
                                        >
                                            <DatePicker
                                                className={"mui_datepicker"}
                                                views={["year", "month", "day"]}
                                                value={value}
                                                inputFormat={dateFormat}
                                                onChange={(newValue) => setValue(newValue)}
                                                renderInput={(params) => <TextField {...params} helperText={null}/>}
                                                openTo="year"
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="input_group-label">
                                        <label>Регион</label>
                                        <CustomSelect
                                            data={regionNames}
                                            setFlags={setFlags}
                                            currentSelect={currentRegion}
                                            setCurrentSelect={setCurrentRegion}
                                            callback={callbackRegion}
                                            placeholder={"Выберите регион"}
                                            currentInput={"region"}
                                            flags={flags.region}
                                        />
                                    </div>
                                    <div className="input_group-label">
                                        <label>
                                            Населённый пункт
                                            <Tooltip
                                                title="Чтобы получить список населённых пунктов, необходимо выбрать регион.">
                                                <Info/>
                                            </Tooltip>
                                        </label>
                                        <CustomSelect
                                            data={locationNames}
                                            setFlags={setFlags}
                                            currentSelect={currentLocation}
                                            setCurrentSelect={setCurrentLocation}
                                            callback={callbackLocation}
                                            placeholder={"Выберите населённый пункт"}
                                            currentInput={"location"}
                                            flags={flags.location}
                                        />
                                    </div>
                                    <div className="input_group-label">
                                        <label>Пол</label>
                                        <div className="genders">
                                            <div
                                                className={activeGender === 0 ? "active" : ""}
                                                onClick={() => setActiveGender(0)}
                                            >
                                                Мужской
                                            </div>
                                            <div
                                                className={activeGender === 1 ? "active" : ""}
                                                onClick={() => setActiveGender(1)}
                                            >
                                                Женский
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="btn_send"
                                onClick={() => {
                                    if (isValid && dirty && currentRegion && currentLocation && value) {
                                        return customHelpersFunctions
                                            .returnNotification("success", "Поля заполнены верно. Пока это всё");
                                    } else {
                                        return customHelpersFunctions
                                            .returnNotification("error", "Заполните все поля");
                                    }
                                }}
                            >
                                Регистрация
                            </div>
                        </>
                    }
                </Formik>
            </div>
        </motion.div>
    );
};

export default Registration;