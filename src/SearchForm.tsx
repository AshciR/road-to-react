import React from "react";
import InputWithALabel from "./InputWithALabel";

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit
}: SearchFormProps) => (

    <form onSubmit={onSearchSubmit} className='search-form'>
        <InputWithALabel
            id="search"
            value={searchTerm}
            onInputChange={onSearchInput}
        >
            <strong>Search:</strong>
        </InputWithALabel>

        <button
            type="submit"
            disabled={!searchTerm}
            className='button button--large'
            data-testid='submit-button'
        >
            Submit
        </button>
    </form>

);

export default SearchForm;