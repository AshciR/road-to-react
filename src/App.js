import './App.css';
import React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
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
  const [fruits, setFruits] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setFruits(result.data.fruits);
    });
  }, []);

  const handleRemoveFruit = item => {
    const newFruits = fruits.filter(fruit => fruit.id !== item.id);
    setFruits(newFruits);
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

      <List list={filteredSearch} onRemoveItem={handleRemoveFruit} />
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
