import React from "react";
import { Mutation } from "react-apollo";
import { ADD_RECIPE, GET_ALL_RECIPES } from "../../queries";
import Error from "../Error";
import { withRouter } from 'react-router-dom';

class AddRecipe extends React.Component {
  state = {
    name: "",
    instructions: "",
    category: "Breakfast",
    description: "",
    username: ""
  };

  componentDidMount() {
    //console.log(this.props); //{session: {}}
    this.setState({
      username: this.props.session.getCurrentUser.username
    });
  }

  handleChange = event => {
    const { name, value } = event.target;
    //console.log(name, ":", value);
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
    addRecipe().then(async ({ data }) => {
       //{addRecipe:{}}
      await this.props.refetch();
      this.props.history.push('/');
    });
    // this.props.history.push('/'); 
  };

  updateCache = (cache, {data: { addRecipe }}) => {
    //manually update getAllRecipes query
    //console.log(cache, data); 
    /*{InMemoryCache:{}} 
    trong đấy có 1 cái data object chứa tất cả các recipe bao gồm cả cái mình vừa add
    data chính là cái data trả về khi thực hiện mutation add recipe, có dạng {addRecipe:{}}
    when we want to update query manually, we will take the data and add to something in this cache object, cụ thể ở đây là $ROOT_QUERY and ROOT_MUTATION
    */
   const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })
   //readQuery: Reads a graphQL quẻy from the root query id
   console.log('from cache', getAllRecipes);
   console.log('from data', addRecipe);

   cache.writeQuery({
     query: GET_ALL_RECIPES,
     data: {
       getAllRecipes: [addRecipe, ...getAllRecipes]
       /* addRecipe phải để lên đầu array vì đấy là cái mới nhất.
       nếu mà viết getAllRecipes.concat([addRecipe] thì nó sẽ nhảy xuống cuối, phải refresh page lần nữa mới lên đầu)
       */
     }
   })
   //readQuery rồi writeQuery còn gọi là flow of optimistic UI :-?
  }

  render() {
    const { name, category, description, instructions, username } = this.state;

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }
}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          /*we want to make onSubmit an arrow fn so that it won't be called on page load.
          updateCache: sau khi add recipe, mất 1 thời gian mutation mới thực hiện xong nên khi quay về homepage sẽ ko tự động update data mới nhất => phải update manually
          */
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

export default withRouter(AddRecipe);
