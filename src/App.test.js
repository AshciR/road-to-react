import React from 'react';
import axios from 'axios';
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

jest.mock('axios');

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

describe('App', () => {

  test('shows loading before stories are fetched', async () => {

    // Given: The stories aren't fetched
    // When: The App renders
    render(<App />);

    // Then: the Loading... text should be present
    expect(screen.queryByText(/Loading/)).toBeInTheDocument();
  });

  test('shows stories after they are fetched', async () => {

    // Given: We're promised to have stories
    const promise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    axios.get.mockImplementationOnce(() => promise);

    // When: The App renders
    render(<App />);

    // And: The stories are fetched
    await act(() => promise);

    // Then: We expect the stories to be in the document
    expect(screen.queryByText(/Loading/)).toBeNull();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getAllByTestId('dimiss-check-box').length).toBe(2);
  });

  test('shows error message when fetch stories fail', async () => {

    // Given: Fetching the stories failed
    const promise = Promise.reject();
    axios.get.mockImplementationOnce(() => promise);

    // When: The App renders
    render(<App />);

    // And: The stories failed to be fetched
    try {
      await act(() => promise);
    } catch (error) {
      // Then: We expect the error messages to be  in the document
      expect(screen.queryByText(/Loading/)).toBeNull();
      expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    }

  });

  test('remove a story', async () => {
    // Given: We're promised to have stories
    const promise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    // And: the stories are on the page
    axios.get.mockImplementationOnce(() => promise);
    render(<App />);
    await act(() => promise);

    // When: We remove the first story
    fireEvent.click(screen.getAllByTestId('dimiss-check-box')[0]);

    // Then: We expect it to not be on the screen anymore
    expect(screen.getAllByTestId('dimiss-check-box').length).toBe(1);
    expect(screen.queryByText('React')).toBeNull();
    expect(screen.getByText('Redux')).toBeInTheDocument();
  })

  test('search for a specific story', async () => {

    // Given: The React stories are already on the page
    const reactStoriesPromise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    axios.get.mockImplementation(url => {

      if (url.includes('React')) {
        return reactStoriesPromise;
      }

      if (url.includes('Google')) {
        return getGoogleStoriesPromise();
      }

      throw Error();

    });

    render(<App />);
    await act(() => reactStoriesPromise);

    
    // When: We search for a specific story
    fireEvent.change(screen.queryByTestId('search-input'), {
      target: {
        value: 'Google'
      }
    });
    
    fireEvent.submit(screen.getByTestId('submit-button'));
    await act (() => getGoogleStoriesPromise());
    
    // Then: The new story appears on the page
    expect(screen.getByText('Google Careers')).toBeInTheDocument();

    // And: The old stories should be gone
    expect(screen.queryByText('React')).toBeNull();
    expect(screen.queryByText('Redux')).toBeNull();

  })

  const getGoogleStoriesPromise = () => {
    const googleStory = {
      title: 'Google Careers',
      url: 'https://careers.google.com/',
      author: 'Sundar Pichai',
      num_comments: 100,
      points: 50,
      objectID: 2
    };

    return Promise.resolve({
      data: {
        hits: [googleStory]
      }
    });
  };


});

