import { gql } from "apollo-boost";

/* Recipes Queries */
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name
      category
      createdDate
    }
  }
`;

export const GET_RECIPE = gql`
  query($_id: ID!) {
    getRecipe(_id: $_id) {
      _id
      name
      category
      description
      instructions
      createdDate
      likes
    }
  }
`;

/* tên query phải chính xác như trong Schema */

export const SEARCH_RECIPES = gql`
    query($searchTerm: String) {
      searchRecipes(searchTerm: $searchTerm) {
        _id
        name
        likes
      }
    }
`;

/* Recipes Mutation */

//đống arg pass vào copy từ schema sang rồi add $

export const ADD_RECIPE = gql`
  mutation($name: String!, $description: String!, $category: String!, $instructions: String!, $username: String) {
        addRecipe(name: $name, description: $description, category: $category, instructions: $instructions, username: $username) {
          _id
          name
          category
          instructions
          createdDate
          likes  
    }
  }
`;

export const LIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    likeRecipe(_id: $_id, username: $username) {
      _id
      likes
    }
  }
`;

export const UNLIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeRecipe(_id: $_id, username: $username) {
      _id
      likes
    }
  }
`;


export const DELETE_USER_RECIPE = gql`
  mutation($_id: ID!) {
    deleteUserRecipe(_id: $_id) {
      _id
    }
  }
`;



/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
      favorites {
        _id
        name
      }
    }
  }
`;

export const GET_USER_RECIPES = gql`
  query($username: String!) {
    getUserRecipes(username: $username){
      _id
      name
      likes
    }
  }
`;

/*nếu chỉ có mỗi favorites thì lỗi Response not successful: Receive status code 400, ở trong resolvers có populate, which refer to the path of favorites on User models, favorites ở đây có type là 1 array gồm các objectId, nhưng populate will make them not Id anymore => make favorites an object with all the info about the recipe

Khi đã define favorites ở đây rồi thì session sẽ có thêm favorites, kiểu file này là define mình muốn response trả về sẽ gồm những gì 
*/

//sau khi xong ở đây có thể quay về withSession.js để add query props, query={GET_CURRENT_USER}

/* User Mutation */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

//bên trong `` như nào thì phải vào schema.js để xem type của nó, ở đây là signupUser, lên graphiql chạy thử OK thì copy paste vào
