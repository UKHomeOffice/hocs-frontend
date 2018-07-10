import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApplicationProvider } from './contexts/application.jsx';
import Router from './router/index.jsx';

class App extends Component {
    render() {
        return (
            <ApplicationProvider config={this.props.config}>
                <Router />
            </ApplicationProvider>
        );
    }
}

App.propTypes = {
    config: PropTypes.object.isRequired
};

App.defaultProps = {
    config: {
        layout: {
            header: {},
            body: {},
            footer: {}
        }
    }
};

export default App;