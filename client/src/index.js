import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './index.css';
import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import Navbar from './components/Navbar';
import withSession from './components/withSession';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import RecipePage from './components/Recipe/RecipePage';

// 1. /graphiql - for debugging console
// 2. /graphql - real API
const client = new ApolloClient({
    uri: 'http://react-trang-apollo-recipes.herokuapp.com/graphql', //connect FE to BE
    fetchOptions: {
        credentials: 'include' //allow to send our token to BE
    },

    request: operation => {
        const token = localStorage.getItem('token'); //lấy token từ localStorage để authenticate
        operation.setContext({
            headers: {
                authorization: token //add token to authorization header
            }
        })
    }, //Sau khi gửi đc token lên cho BE thì quay lại server.js để set up jwt authentication

    onError: ({ networkError }) => {
        if (networkError) {
            console.log('Network Error', networkError);//log and pass the error

            // if (networkError.statusCode === 401) {
            //     localStorage.removeItem('token'); //nếu đứt mạng chắc bắt login lại đm :))
            // }
        }
    }
})

const Root = ({ refetch, session }) => {
    //trong Route chỉ đc phép có 1 component, đó là switch, trong đó chưa nhiều route, cái route đầu tiên còn gọi là root route

    //refetch destructure từ withSession, and pass it to whatever Route that we choose, cụ thể ở đây là Signin và Signup => đổi component prop thành render prop, từ đó có thể call a component with an arrow fn and pass in refetch, sau đó back về signinUser trong handleSubmit trong signin.js, async await this.props.refetch
    return(
    <Router>
        <Fragment>
        <Navbar session={session}/>
        <Switch>
            <Route path="/" exact component={App} />
            <Route path="/search" component={Search} />
            <Route path="/signin" render={() => <Signin refetch={refetch}/>} />
            <Route path="/signup" render={() => <Signup refetch={refetch}/>} />
            <Route path="/recipe/add" render={() => <AddRecipe session={session} refetch={refetch}/>} />
            <Route path="/recipes/:_id" component={RecipePage} />
            <Route path="/profile" render={() => <Profile session={session}/>} />
            <Redirect to="/" />
        </Switch>
        </Fragment>
        
    </Router>
    )
};

//we will use the withSession component to wrap the root component, rồi pass RootWithSession xuống ApolloProvider
const RootWithSession = withSession(Root);

//Redirect: khi user vào 1 cái route ko tồn tại thì back về root

ReactDOM.render(<ApolloProvider client={client}>
<RootWithSession />
</ApolloProvider>, document.getElementById('root'));

//sau khi đã wrap up App vào ApolloProvider thì có thể query ở bất cứ đâu trong App


