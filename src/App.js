import './App.css';
import React from 'react';

const App = () => {

  const fruits = [
    { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
    { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
    { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
  ];

  const handleSearch = event => console.log(event.target.value);

  return (
    <div>
      <h1>My Favorite Fruits</h1>

      <Search onSearch={handleSearch} />

      <hr />

      <List list={fruits} />
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

  const [searchTerm, setSearchTerm] = React.useState('What do you want to search for?');

  const handleChange = event => {
    setSearchTerm(event.target.value);
    props.onSearch(event);
  };

  return (
    <div>
      <label htmlFor="search" >Search: </label>
      <input id="search" type="text" onChange={handleChange} />

      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
    </div>
  );

};

export default App;
