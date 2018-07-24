import React, { Component } from 'react';
import PropTypes from 'prop-types';
import types from './actions/types.jsx';

const Context = React.createContext();

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
                ...state.form, data: {
                    ...state.form.data, ...action.payload
                }
            }
        };
    case types.UPDATE_FORM_ERRORS:
        return {
            ...state, form: {
                ...state.form, errors: action.payload
            }
        };
    case types.SET_PHASE:
        return {
            ...state, layout: {
                ...state.layout,
                body: {
                    ...state.layout.body,
                    phaseBanner: {
                        ...state.layout.body.phaseBanner, phase: action.payload
                    }
                }
            }
        };
    case types.UPDATE_LOCATION:
        return { ...state, location: action.payload };
    case types.CANCEL:
        return { ...state, redirect: '/', form: null };
    case types.REDIRECT:
        return { ...state, redirect: action.payload };
    case types.REDIRECTED:
        return { ...state, redirect: null };
    case types.SET_ERROR:
        return { ...state, error: action.payload };
    case types.UNSET_ERROR:
        return { ...state, error: null };
    case types.UNSET_FORM:
        return { ...state, form: { schema: null, data: null, errors: null } };
    default:
        /* eslint-disable-next-line  no-console*/
        console.warn('Unsupported action');
    }
};

export class ApplicationProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.config,
            apiStatus: null,
            dispatch: action => {
                this.setState(state => reducer(state, action));
            }
        };
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