import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// 1. /graphiql - for debugging console
// 2. /graphql - real API
const client = new ApolloClient({
    uri: 'http://localhost:4444/graphql' //connect FE to BE
})

ReactDOM.render(<ApolloProvider client={client}>
<App />
</ApolloProvider>, document.getElementById('root'));

//sau khi đã wrap up App vào ApolloProvider thì có thể query ở bất cứ đâu trong App


