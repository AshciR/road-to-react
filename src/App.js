import React from 'react';
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

const fruitsReducer = (state, action) => {
  switch (action.type) {
    case 'FRUITS_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case 'FRUITS_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'FRUITS_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_FRUIT':
      return {
        ...state,
        data: state.data.filter(fruit => action.payload.id !== fruit.id)
      };
    default:
      throw new Error();
  }
};

const App = () => {

  const FRUITS_API_ENDPOINT = 'https://www.fruityvice.com/api/fruit/all'

  const initialFruits = [
    { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
    { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
    { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
  ];

  const getAsyncFruits = () =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({ data: { fruits: initialFruits } }), 2000
      )
    );

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  const [fruits, dispatchFruits] = React.useReducer(
    fruitsReducer,
    { data: [], isLoading: false, isError: false }
  );

  React.useEffect(() => {
    dispatchFruits({ type: 'FRUITS_FETCH_INIT' });

    fetch(`${FRUITS_API_ENDPOINT}`)
      .then(response => response.json())
      .then(result => {
        dispatchFruits({
          type: 'FRUITS_FETCH_SUCCESS',
          payload: result
        });
      })
      .catch(() =>
        dispatchFruits({ type: 'FRUITS_FETCH_FAILURE' })
      );
  }, []);

  const handleRemoveFruit = item => {
    dispatchFruits({
      type: 'REMOVE_FRUIT',
      payload: item
    });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  };

  const filteredSearch = fruits.data.filter(fruit =>
    fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Favorite Fruits</h1>

      <InputWithALabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithALabel>

      <hr />

      {fruits.isError && <p>Something went wrong ...</p>}

      {fruits.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List
          list={filteredSearch}
          onRemoveItem={handleRemoveFruit}
        />
      )}

    </div>
  );
};

const List = ({ list, onRemoveItem }) => list.map(item =>
  <Item
    key={item.id}
    item={item}
    onRemoveItem={onRemoveItem}
  />
);

const Item = ({ item, onRemoveItem }) => (
  <div>
    <span>Id: {item.id} </span>
    <span>
      <a href={item.url}> {item.name} </a>
    </span>
    <span>Calories: {item.nutritions.calories} </span>
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
