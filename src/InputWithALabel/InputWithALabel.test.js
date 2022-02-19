import React from "react";
import { render, screen } from "@testing-library/react";
import InputWithALabel from "./InputWithALabel";

const inputWithALabelProps = {
    id: 'testLabel',
    value: 'testValue',
    type: 'text',
    onInputChange: jest.fn(),
    children: null
};

describe('InputWithALabel', () => {

    test('should render', () => {

        // When: the component is rendered
        render(<InputWithALabel {...inputWithALabelProps} />);
        
        // Then: it should be present
        expect(screen.getByTestId('label')).toBeInTheDocument();
        expect(screen.getByTestId('search-input')).toBeInTheDocument();
        

    });

});
