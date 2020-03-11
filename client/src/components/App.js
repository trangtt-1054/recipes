import React from 'react';
import './App.css';


import { Query } from 'react-apollo'; //phải import Query component thì mới perform query đc
import { GET_ALL_RECIPES } from '../queries';

const App = () => {
  return (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error }) => {
        if (loading) return <div>loading...</div>
        if (error) return <div>Error</div>
        console.log(data)
        return (
          <p>Recipes</p>
        )
      }}
    </Query>
  </div>
  )
}

/* {data, loading, error} là những cái destructured từ renderprops argument 

Lôi: No-Access-Control-Allow-Origin, import cors in server.js

*/

export default App;
