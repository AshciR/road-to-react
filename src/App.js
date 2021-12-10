import React from 'react';
import axios from 'axios';
import './App.css';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(stories => action.payload.objectID !== stories.objectID)
      };
    default:
      throw new Error();
  }
};

const App = () => {

  const STORIES_API_ENDPOINT = 'http://hn.algolia.com/api/v1/search?query='

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  const [url, setUrl] = React.useState(`${STORIES_API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = event => {
    setUrl(`${STORIES_API_ENDPOINT}${searchTerm}`)

    event.preventDefault();
  }

  const handleFetchStories = React.useCallback(async () => {

    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    try {
      const result = await axios.get(url)

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    }

  }, [url]);

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };

  return (
    <div>
      <h1>Hacker News Stories</h1>

      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={stories.data}
          onRemoveItem={handleRemoveStory}
        />
      )}

    </div>
  );
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (

  <form onSubmit={onSearchSubmit}>
    <InputWithALabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithALabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>

);

const List = ({ list, onRemoveItem }) => list.map(item =>
  <Item
    key={item.objectID}
    item={item}
    onRemoveItem={onRemoveItem}
  />
);

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>Id: {item.objectID} </span>
    <span>
      <a href={item.url}> {item.title} </a>
    </span>
    <span>Author: {item.author} </span>
    <span>Number of comments: {item.num_comments} </span>
    <span>Points: {item.points} </span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Remove
      </button>
    </span>
  </div>
);

const InputWithALabel = ({ id, children, type = "text", value, onInputChange }) => (

  <>
    <label htmlFor={id}> {children} </label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange} />
  </>

);

export default App;
