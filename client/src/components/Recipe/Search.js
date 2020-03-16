import React from "react";
// import { Query } from 'react-apollo';
import SearchItem from './SearchItem';
import { ApolloConsumer } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries";

//since we want to perform our query on demand we need to replace <Query> with <ApolloConsumer>

class Search extends React.Component {
    state = {
        searchResults: []
    }

    handleChange = ({ searchRecipes }) => {
        //destructure searchRecipes from data
        //console.log(data);
        this.setState({
            searchResults: searchRecipes
        })
    }

    render() {
        const { searchResults } = this.state;

        return (
            <ApolloConsumer>
                {client => {
                    return (
                        <div className="App">
                        <input 
                            className="search"
                            type="search" 
                            placeholder="Search for recipes" 
                            onChange={async (event) => {
                                event.persist(); //persist the event
                                const {data} = await client.query({ //similar to optimistic UI
                                    query: SEARCH_RECIPES, //the query we want to perform
                                    variables: { searchTerm: event.target.value }
                                });
                                this.handleChange(data);
                            }}
                        />
                        <ul>
                          {searchResults.map(recipe => (
                              //ban đầu là data.data.searchRecipes.map nhưng khi chưa có data thì lỗi undefined => chuyển nó về [] empty array thì hết lỗi
                            <SearchItem key={recipe._id} {...recipe}/>
                          ))}
                        </ul>
                      </div>
                    )
                }}
            </ApolloConsumer>
        )
    }
}


/*const Search = () => {
  return (
    <Query query={SEARCH_RECIPES} variables={{ searchTerm: "" }}>
      {(data, loading, error) => {
        if (loading || !data.data) return <div>Loading</div>;
        if (error) return <div>Error</div>;
        console.log(data.data.searchRecipes); //evernote
        return (
          <div className="App">
            <input type="search" />
            <ul>
              {data.data.searchRecipes.map(recipe => (
                <li key={recipe._id}>
                  <h4>{recipe.name}</h4>
                  <p>{recipe.likes}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    </Query>
  );
}; */

export default Search;

//we perform the search query but we're not changing the recipe that we get back whenever we type into the input => go to recipe model and provide index to specify which field we are searching on
