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
    case 'SET_FRUITS':
      return action.payload;
    case 'REMOVE_FRUIT':
      return state.filter(fruit => action.payload.id !== fruit.id);
    default:
      throw new Error();
  }
};

const App = () => {

  const initialFruits = [
    { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
    { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
    { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
  ];

  const getAsyncStories = () =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({ data: { fruits: initialFruits } }), 2000
      )
    );

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', '');
  const [fruits, dispatchFruits] = React.useReducer(fruitsReducer, []);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then(result => {
        dispatchFruits({
          type: 'SET_FRUITS',
          payload: result.data.fruits
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
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

  const filteredSearch = fruits.filter(fruit =>
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

      {isError && <p>Something went wrong ...</p>}

      {isLoading ? (
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
    <span>Calories: {item.calories} </span>
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
