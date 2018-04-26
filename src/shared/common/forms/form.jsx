import React, { Component } from 'react';
import Button from './button.jsx';

class Form extends Component {

  submitAction(e) {
    e.preventDefault();
    console.log('test');
  };

  render() {
    return (
      <form action='/test' onSubmit={e => this.submitAction(e)}>
        <Button />
      </form>
    )
  }
}

export default Form;