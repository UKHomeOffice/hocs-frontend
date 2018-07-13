import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from './components/header.jsx';
import Body from './components/body.jsx';
import Footer from './components/footer.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';
import { Redirect } from 'react-router-dom';
import { redirected } from '../contexts/actions/index.jsx';

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

    render() {
        const {
            children,
        } = this.props;
        return (
            <ApplicationConsumer>
                {({ layout: { header, body, footer } }) => {
                    return (
                        <Fragment>
                            <Header {...header} />
                            <Body {...body}>
                                {children}
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
    redirect: PropTypes.string
};

Layout.defaultProps = {
    footer: {
        isVisible: false
    }
};

const WrappedLayout = props => (
    <ApplicationConsumer>
        {({ dispatch, redirect }) => <Layout {...props} dispatch={dispatch} redirect={redirect} />}
    </ApplicationConsumer>
);

export default WrappedLayout;