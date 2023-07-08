import React, { Dispatch, FC, SetStateAction } from "react";
import Range from "rc-slider";
import Spin from "../Spin/Spin";

type Props = {
    range: { minRange: number, maxRange: number | null };
    maxPrice: number;
    setRange: Dispatch<SetStateAction<{ minRange: number, maxRange: number | null }>>;
    needListCategory?: boolean;
    diapazonFilterPut: () => void;
    clearFilter: () => void;
    loading: boolean;
};
const Filter: FC<Props> = (props) => {
    let {range, setRange, maxPrice, diapazonFilterPut, clearFilter, loading} = props;

    let handleChangeRange = (value: number, current: string) => {
        setRange((prev: { minRange: number, maxRange: number | null }) => ({...prev, [current]: value}));
    };
    let handleChange = (min: number, max: number) => {
        setRange((prev: { minRange: number, maxRange: number | null }) => ({...prev, "minRange": min}));
        setRange((prev: { minRange: number, maxRange: number | null }) => ({...prev, "maxRange": max}));
    };
    return (
        <div className="filter">
            <div className="title">Фильтр</div>
            <div className="price_clear">
                <span>Цена (без карты)</span>
                <div onClick={() => clearFilter()}>Очистить</div>
            </div>
            <div className="inputs_block">
                <input
                    className="filter_range"
                    value={range.minRange}
                    type="number"
                    onChange={(e) => handleChangeRange(Number(e.target.value), "minRange")}
                />
                <div className="line"/>
                <input
                    className="filter_range"
                    value={range.maxRange || 0}
                    type="number"
                    onChange={(e) => handleChangeRange(Number(e.target.value), "maxRange")}
                />
            </div>
            <div className="range_block">
                {range.maxRange !== null &&
                    <Range
                        range
                        value={[range.minRange, range.maxRange]}
                        defaultValue={[0, range.maxRange]}
                        min={0}
                        max={maxPrice}
                        onChange={(e) => {
                            if (Array.isArray(e))
                                handleChange(e[0], e[1]);
                        }}
                    />
                }
            </div>
            <div
                className="btn_put"
                onClick={() => diapazonFilterPut()}
            >
                {loading
                    ? <Spin/>
                    : "Применить"
                }
            </div>
        </div>
    );
};

export default Filter;