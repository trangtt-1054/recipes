import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter } from 'react-router-dom';

const handleSignout = (client, history) => {
    localStorage.setItem('token', '');//clear token
    client.resetStore(); //clear user in ApolloClient
    history.push('/');
}

const Signout = ({history}) => {
    return (
        //Giống như kiểu context: Provider và Consumer, Provider để nhận vào, consumer để lấy ra
        <ApolloConsumer>
            {client => {
                console.log(client); //có dạng {DefaultClient:{}}, trong đó có cái resetstore để get rid of the current user
                return (
                    <button onClick={() => handleSignout(client, history)}>Signout</button>
                    )
                }}
        </ApolloConsumer>
    )
}

export default withRouter(Signout); //pass Signout vào withRouter thì mới access đc history