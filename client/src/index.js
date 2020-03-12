import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// 1. /graphiql - for debugging console
// 2. /graphql - real API
const client = new ApolloClient({
    uri: 'http://localhost:4444/graphql' //connect FE to BE
})

const Root = () => {
    //trong Route chỉ đc phép có 1 component, đó là switch, trong đó chưa nhiều route, cái route đầu tiên còn gọi là root route
    return(
    <Router>
        <Switch>
            <Route path="/" exact component={App} />
            <Route path="/signin" component={Signin} />
            <Route path="/signup" component={Signup} />
            <Redirect to="/" />
        </Switch>
    </Router>
    )
};

//Redirect: khi user vào 1 cái route ko tồn tại thì back về root

ReactDOM.render(<ApolloProvider client={client}>
<Root />
</ApolloProvider>, document.getElementById('root'));

//sau khi đã wrap up App vào ApolloProvider thì có thể query ở bất cứ đâu trong App


