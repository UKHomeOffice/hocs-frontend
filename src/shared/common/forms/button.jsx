import React, { Component, Fragment } from 'react';

class Button extends Component {

  render() {
    const {
      label,
      className,
      isDisabled
    } = this.props;
    return (
      <Fragment>
        <input
          className={`button${className ? ' ' + className : ''}`}
          disabled={isDisabled} 
          type="submit"
          value={label}
        />
      </Fragment>
    )
  }
}

Button.defaultProps = {
  label: 'Submit',
  isDisabled: false
};

export default Button;