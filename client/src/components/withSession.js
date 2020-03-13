//here we will perform the getCurrentUser query
import React from 'react';
import {Query} from 'react-apollo';
import { GET_CURRENT_USER } from '../queries';

//higher order component, đây là function component, nó sẽ nhận vào 1 component khác ahi
const withSession = Component => props => (
    <Query query={GET_CURRENT_USER}>
        {({data, loading, refetch}) => {
            if (loading) return null;
            //console.log(data); //khi refresh page sẽ thấy getCurrentUser đc nhấc về từ token 
            return ( 
                // 
                <Component {...props} refetch={refetch} session={data}/>
            )
        }}
    </Query>
)

export default withSession;

//khi redirect xong thì getCurrentUser vẫn là user cũ, phải refresh lại thì getCurrentUser mới lấy user mới nhất => ở đây destructure thêm 1 cái nữa là refetch (fn) để refetch cái query