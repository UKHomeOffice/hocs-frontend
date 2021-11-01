import ActionPage from '../../pages/action.jsx';
import CasePage from '../../pages/case.jsx';
import StagePage from '../../pages/stage.jsx';
import Error from '../../layouts/error.jsx';
import MainPage from '../../pages/dashboard.jsx';
import WorkstackPage from '../../pages/workstack.jsx';
import Search from '../../pages/search.jsx';
import StandardLinesView from '../../pages/standardLines/standardLinesView.jsx';

const routes = [
    {
        path: '/',
        exact: true,
        component: MainPage,
        title: 'Dashboard'
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
        path: '/search',
        exact: true,
        component: Search
    },
    {
        path: '/search/results',
        exact: true,
        component: WorkstackPage,
        selectable: false,
        title: 'Search results'
    },
    {
        path: '/search/reference',
        exact: true,
        component: WorkstackPage,
        selectable: false,
        title: 'Search results'
    },
    {
        path: '/case/:caseId/stage/:stageId',
        exact: true,
        component: StagePage
    },
    {
        path: '/case/:caseId/stage/:stageId/allocate',
        exact: true,
        component: StagePage
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/member/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/somu/:somuTypeUuid/:somuType/:somuCaseType/item/:somuItemUuid/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/member/:context/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/correspondent/:action?hideSidebar=:hideSidebar',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/correspondent/:context/:action?hideSidebar=:hideSidebar',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/document/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: false
    },
    {
        path: '/case/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction',
        exact: true,
        component: CasePage,
        hasSidebar: false
    },
    {
        path: '/case/:caseId/caseAction/:caseActionType/:caseAction',
        exact: true,
        component: CasePage,
        hasSidebar: false
    },
    {
        path: '/case/:caseId/stage/:stageId/caseAction/:caseActionType/:caseAction/:caseActionId',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/:entity/:action/',
        exact: true,
        component: CasePage,
        hasSidebar: true
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/:entity/:context/:action/',
        exact: true,
        component: CasePage
    },
    {
        path: '/case/:caseId/stage/:stageId/entity/:entity/:context/:caseType/:action/',
        exact: true,
        component: CasePage
    },
    {
        path: '/workstack/user',
        exact: true,
        component: WorkstackPage,
        title: 'User Workstack'
    },
    {
        path: '/workstack/team/:teamId/',
        exact: true,
        component: WorkstackPage,
        title: 'Team Workstack'
    },
    {
        path: '/workstack/team/:teamId/workflow/:workflowId',
        exact: true,
        component: WorkstackPage,
        title: 'Workflow Workstack'
    },
    {
        path: '/workstack/team/:teamId/workflow/:workflowId/stage/:stagId',
        exact: true,
        component: WorkstackPage,
        title: 'Stage Workstack'
    },
    {
        path: '/view-standard-lines',
        exact: true,
        component: StandardLinesView,
        title: 'View Standard Lines'
    },
    {
        component: Error,
        error: { status: 404 }
    }
];

export default routes;
