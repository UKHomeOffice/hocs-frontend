import React from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import Layout from '../layouts/layout.jsx';
import routes from './routes/index';
import PageWrapper from '../layouts/page-enabled.jsx';

const Router = () => {

    return (
        <Layout>
            <Routes>
                {routes.map(({ path, exact, component: Page, ...rest }, i) => {
                    return (
                        <Route
                            key={i}
                            exact={exact}
                            path={path}
                            element={<PageWrapper match={useMatch(path)}><Page {...rest} /></PageWrapper>}
                        >
                        </Route>
                    );
                })}
            </Routes>
        </Layout>
    );
};

export default Router;
