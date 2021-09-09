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

  const fruits = [
    { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
    { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
    { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
  ];

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'Fruit to search for');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const filteredSearch = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Favorite Fruits</h1>

      <InputWithALabel
        id="search"
        label="Search"
        value={searchTerm}
        onInputChange={handleSearch}
      />

      <hr />

      <List list={filteredSearch} />
    </div>
  );
};

const List = ({ list }) => list.map(item =>
  <Item key={item.id} item={item} />
);

const Item = ({ item }) => (
  <div>
    <span>Id: {item.id} </span>
    <span>
      <a href={item.url}> {item.name} </a>
    </span>
    <span>Calories: {item.calories} </span>
  </div>
);

const InputWithALabel = ({ id, label, type = "text", value, onInputChange }) => (

  <>
    <label htmlFor={id} >{label} </label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange} />
  </>

);

export default App;
