import React, { Component } from "react";
import { History } from "history";
import { FormattedMessage, IntlShape } from "react-intl";
import { Dispatch, AnyAction } from "redux";
import { GenericSignupComponent } from "./GenericSignupComponent";
import {
  loginEmail,
  resetPassword,
  loginGoogle,
  loginFacebook,
} from "../../../api/loginApi";
import { setListener } from "../../../components/Common/DocumentUtils";

interface Props {
  history: History;
  returnLocation: string;
  dispatch: Dispatch;
  setReturnLocation: (returnLocation: string) => AnyAction;
  intl: IntlShape;
}

interface State {
  loginEmail: string;
  loginPass: string;
  errorState: string | null;
  resetEmail: string;
  passwordResetEmailSent: boolean;
}

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loginEmail: "",
      loginPass: "",
      resetEmail: "",
      passwordResetEmailSent: false,
      errorState: null,
    };
  }

  onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginEmail: event.target.value });
  };

  onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginPass: event.target.value });
  };

  onLoginSubmit = async () => {
    this.setState({ errorState: null });
    try {
      await loginEmail(this.state.loginEmail, this.state.loginPass);
      await this.goToReturnLocation();
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  };

  onLoginGoogle = async () => {
    try {
      await loginGoogle();
      await this.goToReturnLocation();
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  };

  onLoginFacebook = async () => {
    try {
      await loginFacebook();
      await this.goToReturnLocation();
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  };

  onChangeResetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ resetEmail: event.target.value });
  };

  onResetEmailClick = async () => {
    await resetPassword(this.state.resetEmail);
    this.setState({ passwordResetEmailSent: true });
  };

  async goToReturnLocation() {
    const returnUrl = this.props.returnLocation;
    await this.props.dispatch(this.props.setReturnLocation(""));
    await this.props.history.push(returnUrl);
  }

  componentDidMount = () => {
    setListener("keydown", this.enterFunction);
  };

  enterFunction = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      this.onLoginSubmit();
    }
  };

  render() {
    const { errorState, passwordResetEmailSent } = this.state;
    const { intl } = this.props;

    return (
      <>
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
            {!passwordResetEmailSent && (
              <>
                <div className="column is-12">
                  <h1 className="title">
                    <FormattedMessage id="forgotpassword" />
                  </h1>
                </div>
                <div className="column is-1" />

                <div className="column is-11">
                  <div className="field is-grouped">
                    <p className="control is-expanded has-icons-left">
                      <span className="icon is-small is-left">
                        <i className="fas fa-envelope" />
                      </span>
                      <input
                        placeholder={`${intl.formatMessage({
                          id: "emailplaceholder",
                        })}`}
                        className="input email"
                        type="email"
                        onChange={(event) => this.onChangeResetEmail(event)}
                      />
                    </p>
                    <button
                      className="button"
                      onClick={() => this.onResetEmailClick()}
                    >
                      <FormattedMessage id="resetpassword" />
                    </button>
                  </div>
                </div>
              </>
            )}
            {passwordResetEmailSent && (
              <>
                <div className="column is-1" />

                <div className="column is-11">
                  <FormattedMessage id="resetemailsent" />
                </div>
              </>
            )}
          </div>
        </section>
      </>
    );
  }
}
