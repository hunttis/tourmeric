import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { logout } from '../../api/loginApi';

// import flagFI from '../../images/fi.png';
// import flagEN from '../../images/uk.png';

import { NavbarItem } from './NavbarItem';

export default class Navbar extends Component {

  state = { burgerOpen: false };

  toggleBurger() {
    const { burgerOpen } = this.state;
    this.setState({ burgerOpen: !burgerOpen });
  }

  render() {

    const { profile, settings, switchActiveTab, changeLanguage } = this.props;
    const isProfileLoaded = isLoaded(profile) && isLoaded(settings);

    const features = _.get(settings, 'features', {});
    const eventsActive = _.get(features, 'events.active', false);
    const storeInfoActive = _.get(features, 'storeinfo.active', false);

    if (isProfileLoaded) {
      const isLoggedIn = isProfileLoaded && !isEmpty(profile);
      const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';
      const { burgerOpen } = this.state;

      return (
        <div className="navbar" role="navigation" aria-label="dropdown navigation">
          <div className="navbar-brand">
            <div className="navbar-item is-hidden-desktop">
              <Translate id="menu" />
            </div>

            <div role="button" className="navbar-burger" tabIndex={0} onClick={() => { this.toggleBurger(); }}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>
          </div>
          <div className={`navbar-menu ${burgerOpen && 'is-active'}`} id="navbarTarget">
            <div className="navbar-start">
              {eventsActive &&
                <NavbarItem onClick={() => { switchActiveTab('events'); }} translationKey="events" icon="fa-calendar-alt" />
              }
              {storeInfoActive &&
                <NavbarItem onClick={() => { switchActiveTab('storeinfo'); }} translationKey="storeinfo" icon="fa-store" />
              }
              {isLoggedIn &&
                <NavbarItem onClick={() => { switchActiveTab('userinfo'); }} translationKey="userinfo" icon="fa-user" />
              }

              {isAdmin &&
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">
                    <span className="icon">
                      <i className="fas fa-star" />
                    </span>
                    &nbsp;&nbsp;
                    <Translate id="admin" />
                  </a>
                  <div className="navbar-dropdown">
                    <NavbarItem onClick={() => { switchActiveTab('admintools'); }} translationKey="admingeneric" icon="fa-calendar" />
                    <NavbarItem onClick={() => { switchActiveTab('admintoolsevents'); }} translationKey="adminevents" icon="fa-calendar-plus" />
                    <NavbarItem onClick={() => { switchActiveTab('adminsitesettings'); }} translationKey="adminsitesettings" icon="fa-cogs" />
                  </div>
                </div>
              }

            </div>

            <div className="navbar-end">

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  <span className="icon">
                    <i className="fas fa-globe" />
                  </span>
                </a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    {/* <span className="image"><img src={flagEN} className="languageflag" alt="English" /></span> */}
                    <a onClick={() => { changeLanguage('en'); }}>
                      <Translate id="english" />
                    </a>
                  </div>
                  <div className="navbar-item">
                    {/* <span className="image"><img src={flagFI} className="languageflag" alt="Finnish" /></span> */}
                    <a onClick={() => { changeLanguage('fi'); }}>
                      <Translate id="finnish" />
                    </a>
                  </div>
                </div>
              </div>

              {!isLoggedIn &&
                <Fragment>
                  <NavbarItem onClick={() => { switchActiveTab('login'); }} translationKey="login" icon="fa-sign-in-alt" />
                  <NavbarItem onClick={() => { switchActiveTab('register'); }} translationKey="register" icon="fa-pencil-alt" />
                </Fragment>
              }

              {isLoggedIn &&
                <div className="navbar-item" onClick={() => logout()}>
                  <span className="icon">
                    <i className="fas fa-sign-out-alt" />
                  </span>
                  <p><Translate id="logout" /></p>
                </div>
              }
            </div>


          </div>
        </div>
      );
    }
    return <div><Translate id="loading" /></div>;
  }
}

Navbar.propTypes = {
  profile: PropTypes.object,
  settings: PropTypes.object,
  switchActiveTab: PropTypes.func,
  changeLanguage: PropTypes.func,
};
