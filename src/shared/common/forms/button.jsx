import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {ApplicationConsumer} from '../../contexts/application.jsx';
import {cancel} from '../../contexts/actions/index.jsx';

class Submit extends Component {

    handleClick(e) {
        e.preventDefault();
        this.props.dispatch(cancel());
    }

    render() {
        const {
            action,
            className,
            disabled,
            label
        } = this.props;
        return (
            <Fragment>
                <Link
                    className={`button${className ? ' ' + className : ''}`}
                    disabled={disabled}
                    to={action}
                    onClick={e => this.handleClick(e)}
                >{label}</Link>
            </Fragment>
        );
    }
}

Submit.propTypes = {
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    label: PropTypes.string
};

Submit.defaultProps = {
    disabled: false,
    label: 'Submit'
};

const WrappedButton = props => (
    <ApplicationConsumer>
        {({dispatch}) => <Submit {...props} dispatch={dispatch}/>}
    </ApplicationConsumer>
);

export default WrappedButton;