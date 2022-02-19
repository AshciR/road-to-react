import React from 'react';
import {
    render,
    screen,
    fireEvent
} from '@testing-library/react';
import SearchForm from './SearchForm';

describe('SearchForm', () => {

    const searchFormProps = {
        searchTerm: 'React',
        onSearchInput: jest.fn(),
        onSearchSubmit: jest.fn()
    };

    test('renders the input field with its value', () => {

        // When: we render the component
        render(<SearchForm {...searchFormProps} />);

        // Then: the component is rendered correctly
        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });

    test('renders the correct label', () => {

        // When: we render the component
        render(<SearchForm {...searchFormProps} />);

        // Then: the component is rendered correctly
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    test('calls onSearchInput on input field change', () => {

        // Given: we render the component
        render(<SearchForm {...searchFormProps} />);

        // When: we change the input field
        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'Redux' }
        });

        // Then: the component is rendered correctly
        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    test('calls onSearchSubmit on button submit click', () => {

        // Given: we render the component
        render(<SearchForm {...searchFormProps} />);

        // When: we change the input field
        fireEvent.submit(screen.getByRole('button'));

        // Then: the component is rendered correctly
        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });

    test('renders snapshop', () => {

        // When: we render the component
        const { container } = render(<SearchForm {...searchFormProps} />);

        // Then: we expect the HTML structure not to have changed
        expect(container.firstChild).toMatchSnapshot();


    });

});