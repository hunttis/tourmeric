import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

export const GenericSignupComponent = ({ firstTitle, buttonTitle, onChangeEmail, onChangePass, onSubmit, errorState, loginFacebook, loginGoogle }) => (
  <section className="section">

    <div className="columns is-multiline">

      <div className="column is-12">
        <h1 className="title"><Translate id={firstTitle} /></h1>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <h2 className="subtitle"><Translate id="asocialmediaaccount" /></h2>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <div className="field is-grouped">
          <p className="control">
            <button className="button has-icons" onClick={loginFacebook}>
              <span className="icon"><i className="fas fa-sign-in-alt" /></span>
              <span className="icon has-text-info"><i className="fab fa-facebook" /></span>
            </button>
          </p>
          <p className="control is-left">
            <button className="button has-icons" onClick={loginGoogle}>
              <span className="icon"><i className="fas fa-sign-in-alt" /></span>
              <span className="icon has-text-success"><i className="fab fa-google" /></span>
            </button>
          </p>
        </div>
      </div>

      <div className="column is-12">
        <h1 className="title"><Translate id="or" /></h1>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <h2 className="subtitle"><Translate id="fillinyouremailaddressandinputpassword" /></h2>
      </div>

      <div className="column is-1" />
      <div className="column is-11">
        <div className="field is-grouped">
          <p className="control is-expanded has-icons-left">
            <span className="icon is-small is-left"><i className="fas fa-envelope" /></span>
            <Translate>
              {translate => (
                <input placeholder={translate('emailplaceholder')} className="input email" type="email" onChange={event => onChangeEmail(event)} />
              )}
            </Translate>
          </p>
          <p className="control is-expanded has-icons-left">
            <span className="icon is-small is-left"><i className="fas fa-lock" /></span>
            <Translate>
              {translate => (
                <input placeholder={translate('passwordplaceholder')} className="input password" type="password" onChange={event => onChangePass(event)} />
              )}
            </Translate>
          </p>
          <button className="button" onClick={() => onSubmit()}><Translate id={buttonTitle} /></button>
        </div>
      </div>

    </div>
    {errorState &&
      <div className="box">
        <Translate id={errorState} />
      </div>
    }
  </section>
);

GenericSignupComponent.propTypes = {
  firstTitle: PropTypes.string,
  buttonTitle: PropTypes.string,
  onChangeEmail: PropTypes.func,
  onChangePass: PropTypes.func,
  onSubmit: PropTypes.func,
  errorState: PropTypes.string,
  loginGoogle: PropTypes.func.isRequired,
  loginFacebook: PropTypes.func.isRequired,
};
