import { gql } from "apollo-boost";

/* Recipes Queries */
export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      name
      description
      instructions
      category
      likes
      createdDate
    }
  }
`;

/* tên query phải chính xác như trong Schema */

/* Recipes Mutation */

/* User Queries */

/* User Mutation */
export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

//bên trong `` như nào thì phải vào schema.js để xem type của nó, ở đây là signupUser, lên graphiql chạy thử OK thì copy paste vào
