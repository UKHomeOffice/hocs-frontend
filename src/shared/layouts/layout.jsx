import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from './components/header.jsx';
import Body from './components/body.jsx';
import Footer from './components/footer.jsx';
import Error from './error.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import { Redirect } from 'react-router-dom';
import { redirected, unsetForm, unsetError } from '../contexts/actions/index.jsx';

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.redirect) {
            this.setState({ redirect: this.props.redirect });
            this.props.dispatch(redirected());
        }
    }

    componentWillUnmount() {
        if (this.props.history && this.props.history.action === 'POP') {
            this.props.dispatch(unsetForm());
            this.props.dispatch(unsetError());
        }
    }

    render() {
        const {
            children,
            error
        } = this.props;
        return (
            <ApplicationConsumer>
                {({ layout: { header, body, footer } }) => {
                    return (
                        <Fragment>
                            <Header {...header} />
                            <Body {...body} error={error}>
                                {error ? <Error {...error}/> : children}
                            </Body>
                            {footer.isVisible && <Footer {...footer} />}
                            {this.props.redirect && <Redirect to={this.props.redirect} push />}
                        </Fragment>
                    );
                }}
            </ApplicationConsumer>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.node,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object,
    error: PropTypes.object,
    redirect: PropTypes.string
};

Layout.defaultProps = {
    footer: {
        isVisible: false
    }
};

const WrappedLayout = props => (
    <ApplicationConsumer>
        {({ dispatch, redirect, error }) => <Layout {...props} dispatch={dispatch} redirect={redirect} error={error} />}
    </ApplicationConsumer>
);

export default WrappedLayout;