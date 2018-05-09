import React, { Component, Fragment } from 'react';

class Submit extends Component {

  render() {
    const {
      label,
      className,
      disabled
    } = this.props;
    return (
      <Fragment>
        <input
          className={`button${className ? ' ' + className : ''}`}
          disabled={disabled}
          type="submit"
          value={label}
        />
      </Fragment>
    )
  }
}

Submit.defaultProps = {
  label: 'Submit',
  disabled: false
};

export default Submit;