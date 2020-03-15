import React from "react";
import withSession from "../withSession";
import { Mutation } from "react-apollo";
import { LIKE_RECIPE, GET_RECIPE, UNLIKE_RECIPE } from "../../queries";

class LikeRecipe extends React.Component {
  state = {
    liked: false,
    username: ""
  };

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser;
      console.log(favorites);
      this.setState({ username });
    }
  }

  handleClick = (likeRecipe, unlikeRecipe) => {
    this.setState(
      prevState => ({
        liked: !prevState.liked
      }),
      () => {
        this.handleLike(likeRecipe, unlikeRecipe);
      }
    );
  };

  /*this.setState nhận vào 2 argument, là 2 callback fn. Once we update the state (sau cái tn thứ nhất), we will call the second async fn, this fn will be called asynchronously everytime we update the state. 
  Nói chung là khi update state thì gọi handleLike, tại handleLike thì bắn mutation like hay unlike tuỳ thuộc vào state
  */

  handleLike = (likeRecipe, unlikeRecipe) => {
    if (this.state.liked) {
      likeRecipe().then(async ({ data }) => {
        console.log(data);
        await this.props.refetch();
      });
    } else {
      //unike recipe mutation
      //console.log("unlike");
      unlikeRecipe().then(async ({ data }) => {
        console.log(data);
        await this.props.refetch();
      });
    }
  };

  updateLike = (cache, { data: { likeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    }); //readQuery là read cái query đc gọi tại parent component của component này
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
      }
    });
  };

  updateUnlike = (cache, { data: { unlikeRecipe } }) => {
    const { _id } = this.props;
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id }
    }); //readQuery là read cái query đc gọi tại parent component của component này
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
      }
    });
  };

  render() {
    console.log(this.props); //{session: {…}, refetch: ƒ}
    const { liked, username } = this.state;
    const { _id } = this.props;
    return (
      <Mutation
        mutation={UNLIKE_RECIPE}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {unlikeRecipe => (
          <Mutation
            mutation={LIKE_RECIPE}
            variables={{ _id, username }}
            update={this.updateLike}
          >
            {likeRecipe => {
              return (
                username && (
                  <button
                    onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}
                  >
                    {liked ? "Unlike" : "Like"}
                  </button>
                )
              );
            }}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

//wrap mutation unlike bên ngoài mutation like

export default withSession(LikeRecipe);

//Lỗi Response not successful: Received status code 400: là do bên parent component pass props sai, phải là _id={_id} chứ ko phải id={_id}
