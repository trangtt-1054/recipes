import React from "react";
import { Query, Mutation } from "react-apollo";
import { Link } from "react-router-dom";
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from "../../queries";

const handleDelete = deleteUserRecipe => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this recipe?"
  );
  if (confirmDelete) {
    deleteUserRecipe().then(({ data }) => {
      console.log(data);
    });
  }
};

const UserRecipes = ({ username }) => {
  return (
    <Query query={GET_USER_RECIPES} variables={{ username }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading</div>;
        if (error) return <div>Error</div>;
        console.log(data);
        return (
          <ul>
            <h3>Your Recipes</h3>
            {!data.getUserRecipes.length && <strong>You have not added any recipes yet</strong>}
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

                    update={(cache, { data: { deleteUserRecipe }}) => {
                        //console.log(cache, data)
                        const { getUserRecipes } = cache.readQuery({
                            query: GET_USER_RECIPES,
                            variables: { username }
                        });
                        cache.writeQuery({
                            query: GET_USER_RECIPES,
                            variables: { username },
                            data : {
                                getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                            }
                        })
                    }}
                  >
                    {(deleteUserRecipe, attrs = {}) => {
                      return (
                        <p
                          className="delete-button"
                          onClick={() => handleDelete(deleteUserRecipe)}
                        >
                          {attrs.loading ? 'deleting...' : 'x'}
                        </p>
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
};

export default UserRecipes;
