import React, { Component } from 'react';
import { registerEmail } from '../../../api/loginApi';
import { GenericSignupComponent } from './GenericSignupComponent';

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.state = { loginEmail: '', loginPass: '' };
  }

  onChangeEmail = (event) => {
    this.setState({ loginEmail: event.target.value });
  }

  onChangePass = (event) => {
    this.setState({ loginPass: event.target.value });
  }

  onRegisterSubmit = async () => {
    this.setState({ errorState: null });
    try {
      await registerEmail(this.state.loginEmail, this.state.loginPass);
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }

  render() {
    return (
      <GenericSignupComponent
        firstTitle="registerwith"
        buttonTitle="register"
        onChangeEmail={this.onChangeEmail}
        onChangePass={this.onChangePass}
        onSubmit={this.onRegisterSubmit}
        errorState={this.state.errorState}
      />
    );
  }
}
