import React from "react";
import './InputWithALabel.css'

type InputWithALabelProps = {
    id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    children: React.ReactNode;
};

const InputWithALabel = ({
    id,
    children,
    type = "text",
    value,
    onInputChange,
}: InputWithALabelProps) => (

    <>
        <label
            htmlFor={id}
            className="label"
            data-testid="label"
        >
            {children}
        </label>
        &nbsp;
        <input
            id={id}
            type={type}
            value={value}
            onChange={onInputChange}
            className='input'
            data-testid='search-input'
        />
    </>

);

export default InputWithALabel;