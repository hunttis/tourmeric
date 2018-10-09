import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { GenericSignupComponent } from './GenericSignupComponent';
import { loginEmail, resetPassword, loginGoogle, loginFacebook } from '../../../api/loginApi';

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = { loginEmail: '', loginPass: '', resetEmail: '', passwordResetEmailSent: false, errorState: null };
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

  onChangeResetEmail = (event) => {
    this.setState({ resetEmail: event.target.value });
  }

  onResetEmailClick = async () => {
    await resetPassword(this.state.resetEmail);
    this.setState({ passwordResetEmailSent: true });
  }


  render() {
    const { errorState, passwordResetEmailSent } = this.state;

    return (
      <Fragment>
        <GenericSignupComponent
          firstTitle="loginwith"
          buttonTitle="login"
          onChangeEmail={this.onChangeEmail}
          onChangePass={this.onChangePass}
          onSubmit={this.onLoginSubmit}
          errorState={errorState}
          loginGoogle={this.onLoginGoogle}
          loginFacebook={this.onLoginFacebook}
        />
        <section className="section">
          <div className="columns is-multiline">

            {!passwordResetEmailSent &&
            <Fragment>
              <div className="column is-12">
                <h1 className="title"><Translate id="forgotpassword" /></h1>
              </div>
              <div className="column is-1" />

              <div className="column is-11">
                <div className="field is-grouped">
                  <p className="control is-expanded has-icons-left">
                    <span className="icon is-small is-left"><i className="fas fa-envelope" /></span>
                    <Translate>
                      {translate => (
                        <input placeholder={translate('emailplaceholder')} className="input email" type="email" onChange={event => this.onChangeResetEmail(event)} />
                      )}
                    </Translate>
                  </p>
                  <button className="button" onClick={() => this.onResetEmailClick()}><Translate id="resetpassword" /></button>
                </div>

              </div>
            </Fragment>
            }
            {passwordResetEmailSent &&
              <Fragment>
                <div className="column is-1" />

                <div className="column is-11">
                  <Translate id="resetemailsent" />
                </div>
              </Fragment>
            }
          </div>
        </section>
      </Fragment>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
};
