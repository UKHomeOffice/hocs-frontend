import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IdleTimer from 'react-idle-timer';
import { Helmet } from 'react-helmet-async';
import { ApplicationProvider } from './contexts/application.jsx';
import Router from './router/index.jsx';
// import SessionTimer from '../shared/layouts/session-timer.jsx';

class App extends Component {
    constructor(props) {
        super(props);
        this.idleTimer = null;
        this.onAction = this._onAction.bind(this);
        this.onActive = this._onActive.bind(this);
        this.onIdle = this._onIdle.bind(this);
        this.state = { idle: false };
    }
    render() {
        return (
            <ApplicationProvider config={this.props.config}>
                <IdleTimer
                    ref={ref => { this.idleTimer = ref; }}
                    element={typeof document !== 'undefined' ? document : undefined}
                    onActive={this.onActive}
                    onIdle={this.onIdle}
                    onAction={this.onAction}
                    debounce={250}
                    timeout={1000 * 10} />
                {typeof document !== 'undefined' && <Helmet defer={false}>
                    <title>{this.state.idle ? 'idle' : 'active'}</title>
                </Helmet>}
                <Router />
            </ApplicationProvider>
        );
    }

    _onAction(e) {
        console.log('user did something', e);
    }

    _onActive(e) {
        console.log('user is active', e);
        console.log('time remaining', this.idleTimer.getRemainingTime());
        this.setState({ idle: false });
    }

    _onIdle(e) {
        console.log('user is idle', e);
        console.log('last active', this.idleTimer.getLastActiveTime());

        this.setState({ idle: true });
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