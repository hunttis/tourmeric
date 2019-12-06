import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';

import { registerEmail } from '../../api/loginApi';
import { FirebaseProfile } from '~/models/ReduxState';

interface Props {
  profile: FirebaseProfile;
}

interface State {
  loginEmail: string;
  loginPass: string;
  errorState: boolean;
}

export default class InitialSetup extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { loginEmail: '', loginPass: '', errorState: false };
  }

  onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginEmail: event.target.value });
  }

  onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ loginPass: event.target.value });
  }

  onRegisterSubmit = async () => {
    try {
      await registerEmail(this.state.loginEmail, this.state.loginPass);
      this.setState({ errorState: false });
    } catch (err) {
      this.setState({ errorState: err.code });
    }
  }

  render() {
    const { profile } = this.props;
    const showSetupEnd = isLoaded(profile) && !isEmpty(profile);

    return (
      <div className="section">
        <div className="columns is-multiline">
          {!showSetupEnd &&
            <>
              <div className="column is-12">
                <h1 className="title">
                  <Translate id="setupnotdoneyet" />
                </h1>
              </div>
              <div className="column is-12">
                <p>
                  <Translate id="youneedtocreateanadminaccount" />
                </p>
              </div>
              <div className="column is-12">
                <h2 className="subtitle"><Translate id="fillinyouremailaddressandinputpassword" /></h2>
              </div>

              <div className="column is-12">
                <div className="field is-grouped">
                  <p className="control is-expanded has-icons-left">
                    <span className="icon is-small is-left"><i className="fas fa-envelope" /></span>
                    <Translate>
                      {({ translate }) => (
                        <input placeholder={`${translate('emailplaceholder')}`} className="input email" type="email" onChange={(event) => this.onChangeEmail(event)} />
                      )}
                    </Translate>
                  </p>
                  <p className="control is-expanded has-icons-left">
                    <span className="icon is-small is-left"><i className="fas fa-lock" /></span>
                    <Translate>
                      {({ translate }) => (
                        <input placeholder={`${translate('passwordplaceholder')}`} className="input password" type="password" onChange={(event) => this.onChangePass(event)} />
                      )}
                    </Translate>
                  </p>
                  <button className="button" onClick={() => this.onRegisterSubmit()}><Translate id="register" /></button>
                </div>
              </div>
            </>
          }
          {this.state.errorState &&
            <>
              <div className="column is-12">
                <h1 className="title">
                  <Translate id="almostthere" />
                </h1>
              </div>
              <div className="column is-12">
                <div className="box">
                  <Translate id={String(this.state.errorState)} />
                </div>
              </div>
            </>
          }
          {showSetupEnd &&
            <div className="column is-12">
              <h2 className="subtitle">
                Alright, time to finish the setup. Next part is a bit tricky.
              </h2>
              <ol className="list">
                <li>You need to go into the <a href="https://console.firebase.google.com">Firebase console (click here to be taken there)</a></li>
                <li>
                  Select the <span className="has-text-success">app you created</span> there. Then click <span className="has-text-success">database</span>.
                </li>
                <li>
                  Under the users folder, you should see one user. It&apos;s the one you just registered. Click the ID of that user (it&apos;s a garbled mess of characters and numbers)
                </li>
                <li>
                  Once you see the variables for that user, you should see an email address and a username for it. Point at the id and press the <span className="has-text-danger">+</span>
                </li>
                <li>
                  For the <span className="has-text-success">name</span> write <span className="has-text-danger">role</span> and for the <span className="has-text-success">value</span> write <span className="has-text-danger">admin</span>. This makes your user account an admin account.
                </li>
                <li>
                  Go back. You can press the back button on the browser or click the name of your application just above the user ID.
                </li>
                <li>
                  Point at the <span className="has-text-success">database root</span> (it&apos;s probably named what your application is named) with your mouse cursor and click the <span className="has-text-danger">+</span> to create a new folder.
                </li>
                <li>
                  For the <span className="has-text-success">name</span> write <span className="has-text-danger">settings</span> and click the <span className="has-text-danger">+</span> next to the value. It creates a variable under the settings folder.
                </li>
                <li>
                  For the new variable: <span className="has-text-success">name</span> should be <span className="has-text-danger">initialSetupDone</span> and the <span className="has-text-success">value</span> for it should be <span className="has-text-danger">true</span>.
                </li>
                <li>
                  Once you refresh the page, you should see the user info page. Input your info there and start using tourmeric!
                </li>
              </ol>

            </div>
          }
        </div>
      </div>
    );
  }
}
