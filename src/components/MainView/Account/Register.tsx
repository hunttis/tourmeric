import React, { Component } from 'react';
import { History } from 'history';
import { registerEmail, loginGoogle, loginFacebook } from '../../../api/loginApi';
import { GenericSignupComponent } from './GenericSignupComponent';
import { setListener } from '~/components/Common/DocumentUtils';

interface Props {
  history: History;
}

interface State {
  loginEmail: string;
  loginPass: string;
  errorState: string | null;
}

export default class Register extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { loginEmail: '', loginPass: '', errorState: null };
  }

  onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginEmail: event.target.value });
  }

  onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginPass: event.target.value });
  }

  onRegisterSubmit = async () => {
    this.setState({ errorState: null });
    try {
      await registerEmail(this.state.loginEmail, this.state.loginPass);
      this.props.history.push('/today');
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }

  onLoginGoogle = async () => {
    try {
      await loginGoogle();
      this.props.history.push('/today');
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }

  onLoginFacebook = async () => {
    try {
      await loginFacebook();
      this.props.history.push('/today');
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }

  componentDidMount = () => {
    setListener('keydown', this.enterFunction);
  }

  enterFunction = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      this.onRegisterSubmit();
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
        loginGoogle={this.onLoginGoogle}
        loginFacebook={this.onLoginFacebook}
      />
    );
  }
}
