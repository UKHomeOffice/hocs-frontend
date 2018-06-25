import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import {ApplicationConsumer} from '../../contexts/application.jsx';

class Submit extends Component {

  render() {
    const {
      label,
      className,
      disabled,
      action
    } = this.props;
    return (
      <Fragment>
        <Link
          className={`button${className ? ' ' + className : ''}`}
          disabled={disabled}
          to={action}
        >{label}</Link>
      </Fragment>
    )
  }
}

Submit.defaultProps = {
  label: 'Submit',
  disabled: false
};

const WrappedButton = props => (
  <ApplicationConsumer>
      {({dispatch}) => <Submit {...props} dispatch={dispatch}/>}
  </ApplicationConsumer>
);

export default WrappedButton;