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


/* User Queries */
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      username
      joinDate
      email
    }
  }
`;
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
