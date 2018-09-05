import React, { Component } from 'react';
import { loginEmail } from '../../../api/loginApi';
import { GenericSignupComponent } from './GenericSignupComponent';

export default class Login extends Component {

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

  onLoginSubmit = async () => {
    this.setState({ errorState: null });
    try {
      await loginEmail(this.state.loginEmail, this.state.loginPass);
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }


  render() {
    return (
      <GenericSignupComponent
        firstTitle="loginwith"
        buttonTitle="login"
        onChangeEmail={this.onChangeEmail}
        onChangePass={this.onChangePass}
        onSubmit={this.onLoginSubmit}
        errorState={this.state.errorState}
      />
    );
  }
}
