import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Header from './components/header.jsx';
import Body from './components/body.jsx';
import { ApplicationConsumer } from '../contexts/application.jsx';

class Layout extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            apiStatus,
            children,
            layout: { header, body }
        } = this.props;
        return (
            <Fragment>
                {apiStatus &&
                    <div className={`notification${apiStatus.status.type === 'ERROR' ? ' notification--error' : ''}`}>
                        {apiStatus.status.display}
                    </div>
                }
                <Header {...header} />
                <Body {...body}>
                    {children}
                </Body>
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