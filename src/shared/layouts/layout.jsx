import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from './components/header.jsx';
import Body from './components/body.jsx';
import Footer from './components/footer.jsx';
import Notification from './notifaction.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';

class Layout extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            apiStatus,
            children,
            layout: { header, body, footer }
        } = this.props;
        return (
            <Fragment>
                {apiStatus && <Notification {...apiStatus.status} />}
                <Header {...header} />
                <Body {...body}>
                    {children}
                </Body>
                {footer.isVisible && <Footer {...footer} />}
            </Fragment>
        );
    }
}

Layout.propTypes = {
    apiStatus: PropTypes.object,
    children: PropTypes.node,
    layout: PropTypes.object.isRequired
};

const WrappedLayout = props => (
    <ApplicationConsumer>
        {({
            apiStatus,
            layout
        }) => <Layout {...props} layout={layout} apiStatus={apiStatus} />}
    </ApplicationConsumer>
);

export default WrappedLayout;