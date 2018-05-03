import WorkstackPage from "../pages/workstack.jsx";
import CreatePage from "../pages/create.jsx";
import Error from "../layouts/error.jsx";

const routes = [
    {
        path: '/',
        exact: true,
        component: WorkstackPage,
        title: 'Workstack'
    },
    {
        path: '/case/create/',
        exact: true,
        component: CreatePage,
        title: 'Create case'
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