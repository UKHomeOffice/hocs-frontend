import ActionPage from "../../pages/action.jsx";
import CasePage from "../../pages/case.jsx";
import Error from "../../layouts/error.jsx";
import MainPage from "../../pages/main.jsx";

const routes = [
    {
        path: '/',
        exact: true,
        component: MainPage,
        title: 'Main'
    },
    {
        path: '/action/:action',
        exact: true,
        component: ActionPage,
        title: 'Create case'
    },
    {
        path: '/case/:caseId/create/',
        exact: true,
        component: CasePage,
        title: 'Create case'
    },
    {
        path: '/unauthorised',
        component: Error,
        title: 'You do not have the required permission to view this resource',
        error: 'Access denied',
        errorCode: 403
    },
    {
        path: '/error',
        component: Error,
        title: 'The server has encountered an error',
        error: 'Server error',
        errorCode: 500
    },
    {
        component: Error,
        title: 'The requested resource can not be found or does not exist',
        error: 'Not found',
        errorCode: 404
    }
];

export default routes;