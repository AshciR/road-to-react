import React from 'react';
import App, {
  storiesReducer,
  Item,
  List,
  SearchForm,
  InputWithALabel
} from './App';
import {
  render,
  screen,
  fireEvent,
  act
} from '@testing-library/react';

const initialState = {
  data: [],
  isLoading: false,
  isError: false
};

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Richie',
  num_comments: 3,
  points: 4,
  objectID: 0
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Ashcir',
  num_comments: 2,
  points: 5,
  objectID: 1
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {

  test('init fetching stories', () => {

    // Given: We have a current state and an action
    const state = initialState
    const action = { type: 'STORIES_FETCH_INIT' };

    // When: We call the reducer
    const updatedState = storiesReducer(state, action);

    // Then: The expected state should be produdced
    const expectedState = {
      data: [],
      isLoading: true,
      isError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('fetch stories successfully', () => {

    // Given: We have a current state and an action
    const state = initialState
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };

    // When: We call the reducer
    const updatedState = storiesReducer(state, action);

    // Then: The expected state should be produdced
    const expectedState = {
      data: stories,
      isLoading: false,
      isError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('removes a story from all stories', () => {

    // Given: We have a current state and an action
    const state = { data: stories, isLoading: false, isError: false };
    const action = { type: 'REMOVE_STORY', payload: storyOne };

    // When: We call the reducer
    const updatedState = storiesReducer(state, action);

    // Then: The expected state should be produdced
    const expectedState = {
      data: [storyTwo],
      isLoading: false,
      isError: false
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

  test('fetch stories failure', () => {

    // Given: We have a current state and an action
    const state = initialState
    const action = { type: 'STORIES_FETCH_FAILURE' };

    // When: We call the reducer
    const updatedState = storiesReducer(state, action);

    // Then: The expected state should be produdced
    const expectedState = {
      data: [],
      isLoading: false,
      isError: true
    };

    expect(updatedState).toStrictEqual(expectedState);

  });

});

describe('Item component', () => {

  test('renders all properties', () => {

    // When: the component is rendered
    render(<Item item={storyOne} />);

    // Then: the dom should have the following elements 
    expect(screen.getByText('Author: Richie')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute('href', "https://reactjs.org/");

  });

  test('renders a clickable remove button', () => {

    // When: the component is rendered
    render(<Item item={storyOne} />);

    // Then: the dom should have the following elements 
    expect(screen.getByRole('button')).toBeInTheDocument();

  });

  test('clicking the remove button calls the callback handler', () => {

    // Given: the component is rendered
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

    // When: the button is clicked
    fireEvent.click(screen.getByRole('button'));

    // Then: the dom should have the following elements 
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);

  });

});

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

});
