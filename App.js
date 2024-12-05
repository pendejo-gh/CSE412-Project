import React from 'react';
import RestaurantAdmin from './components/RestaurantAdmin';

function App() {
  console.log('App component rendering');
  return (
    <div className="App">
      <div id="admin-container">
        {React.createElement(RestaurantAdmin)}
      </div>
    </div>
  );
}

export default App;