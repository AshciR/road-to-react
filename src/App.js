import './App.css';
import React from 'react';

const App = () => {

  const fruits = [
    { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
    { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
    { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
  ];

  const [searchTerm, setSearchTerm] = React.useState('Search For Fruit');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const filteredSearch = fruits.filter(fruit =>
    fruit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>My Favorite Fruits</h1>

      <Search onSearch={handleSearch} search={searchTerm} />

      <hr />

      <List list={filteredSearch} />
    </div>
  );
};

const List = props =>
  props.list.map(it =>
    <div key={it.id}>
      <span>Id: {it.id} </span>
      <span>
        <a href={it.url} >{it.name} </a>
      </span>
      <span>Calories: {it.calories} </span>
    </div>
  );

const Search = props => {

  return (
    <div>
      <label htmlFor="search" >Search: </label>
      <input
        id="search" 
        type="text"
        value={props.search} 
        onChange={props.onSearch} />

      <p>
        Searching for <strong>{props.search}</strong>
      </p>
    </div>
  );

};

export default App;
