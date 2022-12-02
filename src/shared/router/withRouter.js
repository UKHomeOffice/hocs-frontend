import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const withRouter = (Component) => {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();

        // console.log(location);
        // console.log('===========');
        // console.log(navigate);
        // console.log('===========');
        // console.log(params);
        console.log(props);
        console.log('===========');
        return (
            <Component
                {...props}
                location={location}
                params={params}
                history={navigate}
            />
        );
    }

    return ComponentWithRouterProp;
};

export default withRouter;
