import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_RECIPE } from "../../queries";
import LikeRecipe from "./LikeRecipe";

const RecipePage = ({ match }) => {
  const { _id } = match.params;
  return (
      <Query query={GET_RECIPE} variables={{ _id }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error</div>;
          console.log(data); //có dạng {getRecipe: {}}
          return (
            <div className="App">
              <div
                style={{
                  background: `url(${data.getRecipe.imageUrl}) center center / cover no-repeat`
                }}
                className="recipe-image"
              ></div>

              <div className="recipe">
                <div className="recipe-header">
                  <h2 className="recipe-name">
                    <strong>{data.getRecipe.name}</strong>
                  </h2>
                  <h5>
                    <strong>{data.getRecipe.category}</strong>
                  </h5>
                  <p>
                    Created by <strong>{data.getRecipe.username}</strong>
                  </p>
                  <p>
                    {data.getRecipe.likes}{" "}
                    <span role="img" arial-label="heart">
                      ❤
                    </span>
                  </p>
                </div>
                <blockquote className="recipe-description">
                  {data.getRecipe.description}
                </blockquote>
                <h3 className="recipe-instructions__title">
                  Instructions
                </h3>
                <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: data.getRecipe.instructions }} />
              <LikeRecipe _id={_id} />
              </div>
            </div>
          );
        }}
      </Query>
  );
};

export default withRouter(RecipePage);

//Trước khi nhảy đến RecipeItem để show 1 recipe thì phải thêm 1 query getRecipe trong schema.js
