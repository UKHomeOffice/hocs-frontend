import React, { Component, Fragment } from 'react';

class Submit extends Component {

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
          disabled={isDisabled && "true"}
          type="submit"
          value={label}
        />
      </Fragment>
    )
  }
}

Submit.defaultProps = {
  label: 'Submit',
  isDisabled: false
};

export default Submit;