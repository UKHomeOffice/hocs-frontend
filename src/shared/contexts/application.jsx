import React, { Component } from 'react';
import PropTypes from 'prop-types';
import types from './actions/types.jsx';
import ReactGA from 'react-ga';

export const Context = React.createContext();

const reducer = (state, action) => {
    // TODO: REMOVE
    /* eslint-disable-next-line  no-console*/
    console.log(`ACTION: ${action.type} PAYLOAD: ${JSON.stringify(action.payload)}`);
    // ------------
    switch (action.type) {
    case types.UPDATE_FORM:
        return {
            ...state, form: action.payload
        };
    case types.UPDATE_FORM_DATA:

        return {
            ...state, form: {
                ...state.form, data: state.form && state.form.data ? { ...state.form.data, ...action.payload } : { ...action.payload }
            }
        };
    case types.UPDATE_FORM_ERRORS:
        return {
            ...state, form: {
                ...state.form, errors: action.payload
            }
        };
    case types.UPDATE_LOCATION:
        return { ...state, location: action.payload };
    case types.CANCEL:
        return { ...state, redirect: '/', form: null };
    case types.REDIRECT:
        return { ...state, redirect: action.payload, form: null };
    case types.REDIRECTED:
        return { ...state, redirect: null };
    case types.SET_ERROR:
        return { ...state, error: action.payload };
    case types.UNSET_ERROR:
        return { ...state, error: null };
    case types.UNSET_FORM:
        return { ...state, form: null };
    case types.UPDATE_API_STATUS:
        return { ...state, apiStatus: action.payload };
    case types.CLEAR_API_STATUS:
        return { ...state, apiStatus: null };
    case types.UPDATE_PAGE_META:
        return { ...state, page: { ...action.payload } };
    case types.UPDATE_DASHBOARD:
        return { ...state, dashboard: action.payload };
    case types.CLEAR_DASHBOARD:
        return { ...state, dashboard: null };
    case types.UPDATE_WORKSTACK:
        return { ...state, workstack: action.payload };
    case types.CLEAR_WORKSTACK:
        return { ...state, workstack: null };
    case types.UNSET_CASE_NOTES:
        return { ...state, caseNotes: null };
    case types.UNSET_CASE_SUMMARY:
        return { ...state, summary: null };
    case types.PASS_FORWARD_PROPS: {
        return { ...state, ...action.payload };
    }
    default:
        // TODO: Remove
        /* eslint-disable-next-line  no-console*/
        console.warn('Unsupported action');
    }
};

export class ApplicationProvider extends Component {
    constructor(props) {
        super(props);
        const { config } = props;
        if (config && config.analytics &&
            ReactGA.initialize(config.analytics.tracker, { titleCase: true, gaOptions: { userId: config.analytics.userId } })) {
            /* eslint-disable-next-line  no-console*/
            this.useAnalytics = true;
        }
        this.state = {
            ...props.config,
            apiStatus: null,
            dispatch: action => {
                try {
                    this.setState(state => reducer(state, action));
                    return Promise.resolve();
                } catch (error) {
                    return Promise.reject(error);
                }
            },
            track: this.track.bind(this)
        };
    }


    track(event, payload) {
        if (this.useAnalytics) {
            switch (event) {
            case 'EVENT':
                ReactGA.event({
                    category: payload.category,
                    action: payload.action,
                    label: payload.label
                });
                break;
            case 'PAGE_VIEW':
                ReactGA.pageview(
                    payload.path,
                    null,
                    payload.title
                );
                break;
            default:
                /* eslint-disable-next-line  no-console*/
                console.warn('Unsupported analytics event');
            }
        }
    }

    render() {
        const { state, props: { children } } = this;
        return (
            <Context.Provider value={state}>
                {children}
            </Context.Provider>
        );
    }

}

ApplicationProvider.propTypes = {
    children: PropTypes.node,
    config: PropTypes.object
};

export const ApplicationConsumer = Context.Consumer;