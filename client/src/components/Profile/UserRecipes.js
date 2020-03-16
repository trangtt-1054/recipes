import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
  UPDATE_USER_RECIPE
} from "../../queries";

class UserRecipes extends React.Component {
  state = {
    id: "",
    name: "",
    imageUrl: "",
    category: "",
    description: "",
    modal: false
  };

  handleChange = event => {
    const { name, value } = event.target;
    //console.log(name, ":", value);
    this.setState({
      [name]: value
    });
  };

  handleDelete = deleteUserRecipe => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmDelete) {
      deleteUserRecipe().then(({ data }) => {
        console.log(data);
      });
    }
  };

  handleSubmit = (event, updateUserRecipe) => {
    event.preventDefault();
    updateUserRecipe().then(({data}) => {
      console.log(data);
      this.closeModal();
    })
  }

  loadRecipe = recipe => {
    //bước này gọi là populate form
    console.log(recipe); //muốn edit đc recipe thì cần phải lôi hết thông tin recipe ra mà lúc này recipe trả về mới có mỗi name và id, phải vào query index.js để lôi nốt mấy cái category các thứ nữa
    this.setState({ ...recipe, modal: true });
    //this.setState({modal: true})
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_RECIPES} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading</div>;
          if (error) return <div>Error</div>;
          console.log(data);
          return (
            <ul>
              {modal && (
                <EditRecipeModal
                  recipe={this.state}
                  closeModal={this.closeModal}
                  handleSubmit={this.handleSubmit}
                  handleChange={this.handleChange}
                />
              )}
              <h3>Your Recipes</h3>
              {!data.getUserRecipes.length && (
                <strong>You have not added any recipes yet</strong>
              )}
              {data.getUserRecipes.map(recipe => {
                return (
                  <li key={recipe._id}>
                    <Link to={`/recipes/${recipe._id}`}>
                      <p>{recipe.name}</p>
                    </Link>
                    <p style={{ marginBottom: "0" }}>{recipe.likes}</p>

                    <Mutation
                      mutation={DELETE_USER_RECIPE}
                      variables={{ _id: recipe._id }}
                      refetchQueries={() => [
                        { query: GET_ALL_RECIPES }, //refetch ko thì mặc dù xoá rồi nhưng homepage vẫn ko đc update
                        { query: GET_CURRENT_USER } //fetch lại cả current user vì nhỡ xoá những cái favorite thì phải update cả user
                      ]}
                      update={(cache, { data: { deleteUserRecipe } }) => {
                        //console.log(cache, data)
                        const { getUserRecipes } = cache.readQuery({
                          query: GET_USER_RECIPES,
                          variables: { username }
                        });
                        cache.writeQuery({
                          query: GET_USER_RECIPES,
                          variables: { username },
                          data: {
                            getUserRecipes: getUserRecipes.filter(
                              recipe => recipe._id !== deleteUserRecipe._id
                            )
                          }
                        });
                      }}
                    >
                      {(deleteUserRecipe, attrs = {}) => {
                        return (
                          <div>
                            <button
                              onClick={() => this.loadRecipe(recipe)}
                              className="button-primary"
                            >
                              Update
                            </button>
                            <p
                              className="delete-button"
                              onClick={() =>
                                this.handleDelete(deleteUserRecipe)
                              }
                            >
                              {attrs.loading ? "deleting..." : "x"}
                            </p>
                          </div>
                        );
                      }}
                    </Mutation>
                  </li>
                );
              })}
            </ul>
          );
        }}
      </Query>
    );
  }
}

//Update recipe: phải có một mutation riêng

const EditRecipeModal = ({ handleSubmit, recipe, handleChange, closeModal }) => {
  return(
  <Mutation mutation={UPDATE_USER_RECIPE} variables={{ 
    _id: recipe._id,
    name: recipe.name,
    imageUrl: recipe.imageUrl,
    category: recipe.category,
    description: recipe.description
  }}>
    {updateUserRecipe => {
      return (
        <div className="modal modal-open">
          <div className="modal-inner">
            <div className="modal-content">
              <form className="modal-content-inner" onSubmit={event => handleSubmit(event, updateUserRecipe)}>
                <h4>Edit Recipe</h4>
                <label htmlFor="name">Recipe Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={recipe.name}
                />
                <label htmlFor="imageUrl">Recipe Image</label>
                <input
                  type="text"
                  name="imageUrl"
                  onChange={handleChange}
                  value={recipe.imageUrl}
                />
                <label htmlFor="imageUrl">Category of Recipe</label>
                <select
                  name="category"
                  onChange={handleChange}
                  value={recipe.category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                </select>
                <label htmlFor="description">Recipe Description</label>
                <input
                  type="text"
                  name="description"
                  onChange={handleChange}
                  value={recipe.description}
                />
                <hr />
                <div className="modal-buttons">
                  <button type="submit" className="button-primary">
                    Update
                  </button>
                  <button onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }}
  </Mutation>
  //pass handleChange vào đây as a props
  //console.log(recipe);
  )
};

//onClick={this.setState} sẽ ko chạy mà phải là () => this.setState

export default UserRecipes;
