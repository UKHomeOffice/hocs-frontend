import React, { Component, Fragment } from 'react';
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
        <button
          className={`button${className ? ' ' + className : ''}`}
          disabled={disabled}
          onClick={ e => {
            e.preventDefault();
            this.props.dispatch({type: action});
          }}
          formAction={`/action/${action}`}
        >{label}</button>
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