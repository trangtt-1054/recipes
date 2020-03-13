import React from "react";
import { Mutation } from "react-apollo";
import { ADD_RECIPE } from "../../queries";
import Error from "../Error";

class AddRecipe extends React.Component {
  state = {
    name: "",
    instructions: "",
    category: "Breakfast",
    description: "",
    username: ""
  };

  componentDidMount() {
    console.log(this.props); //{session: {}}
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    console.log(name, ":", value);
    this.setState({
      [name]: value
    });
  };

  validateForm = () => {
    const { name, category, description, instructions, username } = this.state;

    const isInvalid = !name || !category || !description || !instructions;

    return isInvalid;
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data); //{addRecipe:{}}
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
      >
        {(addRecipe, { data, loading, error }) => {
          //we want to make onSubmit an arrow fn so that it won't be called on page load.
          return (
            <div className="App">
              <h2 className="App">Add Recipe</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe name"
                  onChange={this.handleChange}
                  value={name}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  onChange={this.handleChange}
                  placeholder="Add description"
                  value={description}
                />
                <textarea
                  name="instructions"
                  onChange={this.handleChange}
                  placeholder="Add instructions"
                  value={instructions}
                ></textarea>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default AddRecipe;
