import React, { Component } from 'react';
import Form from '../common/forms/form.jsx';

class TestComponent extends Component {
  render() {
    const {
      title,
      subTitle
    } = this.props;
    return (
      <div className="grid-row">
        <div className="column-full">
          <h1 className="heading-xlarge">
            {title}
            {subTitle ? <span className="heading-secondary">{subTitle}</span> : null}
          </h1>
          <Form />
        </div>
      </div>
    )
  }
}

export default TestComponent;