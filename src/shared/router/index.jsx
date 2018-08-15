import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../layouts/layout.jsx';
import routes from './routes/index';

class Router extends Component {
    render() {
        return (
            <Layout>
                <Switch>
                    {routes.map(({ path, exact, component: Component, ...rest }, i) => (
                        <Route
                            key={i}
                            path={path}
                            exact={exact}
                            render={(props) => (
                                <Component {...props} {...rest} />
                            )}
                        />
                    ))}
                </Switch>
            </Layout>
        );
    }
}

export default Router;