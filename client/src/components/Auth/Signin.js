import React from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from "react-apollo";
import Error from '../Error';
import { SIGNIN_USER } from '../../queries';

const initialState = {
    username: "",
    password: ""
}

class Signin extends React.Component {
    state = {...initialState};

  clearState = () => {
    this.setState({... initialState});
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value //assign gộp
    });
  };

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({data}) => {
        //có thể destructuring 2 lần {data: {signinUser}} và ở dưới chỉ cần signinUser.token 
        console.log(data); // có dạng {data:{}}
        localStorage.setItem('token', data.signinUser.token);
        await this.props.refetch(); //execute the query one more after signing in, perform before clearing the state
        this.clearState();
        //sử dụng token đc trả về từ database để authenticate user
        this.props.history.push('/');
    })
    //vì signinUser trả về promise
  }

  validateForm = () => {
      //trả về true or false
      const { username, password } = this.state;
      const isInvalid = !username || !password;
      return isInvalid;
  }

  render() {
    const { username, password } = this.state; //because the input aren't aware that we have updated our state so we have to pass down the values of updated state, pass state xuống value của input

    return (
      <div className="App">
        <h2 className="App">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {( signinUser, {data, loading, error }) => {
            return (
              <form className="form" onSubmit={event => this.handleSubmit(event, signinUser)}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <button 
                    type="submit" 
                    className="button-primary"
                    disabled={ loading || this.validateForm() }
                >
                  Submit
                </button>
                {error && <Error error={error}/>}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signin);

//wrap withRouter với (Signin) vì withRouter là higher order component, dùng để redirect sau khi signin 