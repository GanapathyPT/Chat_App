import React from 'react';
import Interface from "./components/interface";
import Provider from "./contexts/Provider";
import './App.css';

function App() {

  

  return (
    <Provider>
      <Interface />
    </Provider>
  );
}

export default App;
