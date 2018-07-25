import ActionPage from '../../pages/action.jsx';
import CasePage from '../../pages/case.jsx';
import StagePage from '../../pages/stage.jsx';
import Error from '../../layouts/error.jsx';
import MainPage from '../../pages/main.jsx';

const routes = [
    {
        path: '/',
        exact: true,
        component: MainPage,
        title: 'Main'
    },
    {
        path: '/action/:workflow/:action',
        exact: true,
        component: ActionPage
    },
    {
        path: '/action/:workflow/:context/:action',
        exact: true,
        component: ActionPage
    },
    {
        path: '/case/:caseId/stage/:stageId',
        exact: true,
        component: StagePage,
    },
    {
        path: '/case/:caseId/action/:entity/:action/',
        exact: true,
        component: CasePage,
    },
    {
        path: '/error',
        component: Error,
        error: 'The server has encountered an error',
        title: 'Error',
        errorCode: 500
    },
    {
        component: Error,
        error: 'The requested resource can not be found or does not exist',
        title: 'Not found',
        errorCode: 404
    }
];

export default routes;