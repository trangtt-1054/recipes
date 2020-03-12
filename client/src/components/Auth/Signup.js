import React from "react";
import { Mutation } from "react-apollo";
import { SIGNUP_USER } from '../../queries'

class Signup extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: ""
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value //assign gộp
    });
  };

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(data => {
        console.log(data); // có dạng {data:{}}
    })
    //vì signupUser trả về promise
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state; //because the input aren't aware that we have updated our state so we have to pass down the values of updated state, pass state xuống value của input

    return (
      <div className="App">
        <h2 className="App">Signup</h2>
        <Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
          {( signupUser, {data, loading, error }) => {
            return (
              <form className="form" onSubmit={event => this.handleSubmit(event, signupUser)}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                  value={passwordConfirmation}
                  onChange={this.handleChange}
                />
                <button type="submit" className="button-primary">
                  Submit
                </button>
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

/*Wrap form vào Mutation thì mới thực hiện sign up đc, trong Mutation có 1 cái renderprops như hồi ở Query. 
mutation={SIGNUP_USER} means which type of mutation we want to perform, SIGNUP_USER là 1 cái variable, thời điểm pass vào thì chưa có nó nên nhảy về queries/index.js để tạo 

để execute SIGNUP_USER fn, we need to pass it necessary variables, tạo prop là variables, pass vào 1 object gồm những cái đã destructure ở trên là username, email, password

ở render props cũng destructure mấy cái cần thiết như data, loading, error, mấy cái này có sẵn mỗi lần chạy Mutation

Mutation còn access đc cả signupUser fn nữa => pass cái đấy vào luôn dùng cho onSubmit
*/

export default Signup;
