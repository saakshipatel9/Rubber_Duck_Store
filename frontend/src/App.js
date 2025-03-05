import React from 'react';
import DuckList from './duckList';
import './App.css';

const App = () => {
  return (
    <div>
      <div class="navbar">
        <a class="active" href="#warehouse">Warehouse</a>
        <a href="#store">Store</a>
      </div>
      <h1><center>Duck Warehouse</center></h1>
      <DuckList />
    </div>
  );
};

export default App;