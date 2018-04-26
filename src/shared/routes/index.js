import TestComponent from '../components/test-component.jsx';
import NotFound from '../layouts/error.jsx';

const routes = [
  {
    path: '/',
    exact: true,
    component: TestComponent,
    title: 'Page Title'
  },
  {
    component: NotFound,
    title: 'The requested resource can not be found or does not exist',
    error: 'Not found',
    errorCode: 404
  }
];

export default routes;