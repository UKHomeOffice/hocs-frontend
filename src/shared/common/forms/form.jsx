import React, { Component } from 'react';
import Submit from './submit.jsx';

class Form extends Component {

  submitAction(e) {
    e.preventDefault();
    console.log('Submitted');
  };

  render() {
    return (
      <form action='/test' onSubmit={e => this.submitAction(e)}>
        <Submit />
      </form>
    )
  }
}

export default Form;