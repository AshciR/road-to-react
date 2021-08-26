import './App.css';

const fruits = [
  { id: 1, name: 'Apple', calories: 100, url: 'https://en.wikipedia.org/wiki/Apple' },
  { id: 2, name: 'Bananas', calories: 200, url: 'https://en.wikipedia.org/wiki/Banana' },
  { id: 3, name: 'Cherry', calories: 300, url: 'https://en.wikipedia.org/wiki/Cherry' }
];

const App = () => {

  const handleChange = event => {
    console.log(event.target.value);
  };

  return (
    <div>
      <h1>My Favorite Fruits</h1>

      <label htmlFor="search" >Search: </label>
      <input id="search" type="text" onChange={handleChange}/>

      <hr />

      <List />
    </div>
  );
};

const List = () =>
  fruits.map(it =>
    <div key={it.id}>
      <span>Id: {it.id} </span>
      <span>
        <a href={it.url} >{it.name} </a>
      </span>
      <span>Calories: {it.calories} </span>
    </div>
  );

export default App;
