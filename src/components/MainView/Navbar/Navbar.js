import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { logout } from '../../../api/loginApi';
import { NavbarItem } from './NavbarItem';

export default class Navbar extends Component {

  state = { burgerOpen: false };

  toggleBurger() {
    const { burgerOpen } = this.state;
    this.setState({ burgerOpen: !burgerOpen });
  }

  switchTab(tabName) {
    const { switchActiveTab } = this.props;
    switchActiveTab(tabName);
    const { burgerOpen } = this.state;
    if (burgerOpen) {
      this.setState({ burgerOpen: false });
    }
  }

  render() {

    const { profile, settings, changeLanguage, activeItem } = this.props;
    const isProfileLoaded = isLoaded(profile) && isLoaded(settings);

    const features = _.get(settings, 'features', {});
    const eventsActive = _.get(features, 'events.active', false);
    const storeInfoActive = _.get(features, 'storeinfo.active', false);

    if (isProfileLoaded) {
      const isLoggedIn = isProfileLoaded && !isEmpty(profile);
      const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';
      const { burgerOpen } = this.state;
      const activeClass = 'active-navbar-item';

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
              <NavbarItem onClick={() => { this.switchTab('today'); }} translationKey="today" icon="fa-calendar" styleClass={activeItem === 'today' && activeClass} />
              {eventsActive &&
                <NavbarItem onClick={() => { this.switchTab('events'); }} translationKey="events" icon="fa-calendar-alt" styleClass={activeItem === 'events' && activeClass} />
              }
              {storeInfoActive &&
                <NavbarItem onClick={() => { this.switchTab('storeinfo'); }} translationKey="contactinfo" icon="fa-store" styleClass={activeItem === 'storeinfo' && activeClass} />
              }
              {isLoggedIn &&
                <NavbarItem onClick={() => { this.switchTab('userinfo'); }} translationKey="userinfo" icon="fa-user" styleClass={activeItem === 'userinfo' && activeClass} />
              }

              {isAdmin &&
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className={`navbar-link ${(['admintools', 'admintoolsevents', 'adminsitesettings'].includes(activeItem)) && 'adminactive'}`}>
                    <span className="icon">
                      <i className="fas fa-star" />
                    </span>
                    &nbsp;&nbsp;
                    <Translate id="admin" />
                  </a>
                  <div className="navbar-dropdown">
                    <NavbarItem onClick={() => { this.switchTab('admintools'); }} translationKey="admingeneric" icon="fa-calendar" styleClass={activeItem === 'admintools' && activeClass} />
                    <NavbarItem onClick={() => { this.switchTab('admintoolsevents'); }} translationKey="adminevents" icon="fa-calendar-plus" styleClass={activeItem === 'admintoolsevents' && activeClass} />
                    <NavbarItem onClick={() => { this.switchTab('adminsitesettings'); }} translationKey="adminsitesettings" icon="fa-cogs" styleClass={activeItem === 'adminsitesettings' && activeClass} />
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
                  <span className="is-hidden-desktop">&nbsp;&nbsp;<Translate id="changelanguage" /></span>
                </a>
                <div className="navbar-dropdown">
                  <div className="navbar-item">
                    <a onClick={() => { changeLanguage('en'); }}>
                      <Translate id="english" />
                    </a>
                  </div>
                  <div className="navbar-item">
                    <a onClick={() => { changeLanguage('fi'); }}>
                      <Translate id="finnish" />
                    </a>
                  </div>
                </div>
              </div>

              {!isLoggedIn &&
                <Fragment>
                  <NavbarItem onClick={() => { this.switchTab('login'); }} translationKey="login" icon="fa-sign-in-alt" />
                  <NavbarItem onClick={() => { this.switchTab('register'); }} translationKey="register" icon="fa-pencil-alt" />
                </Fragment>
              }

              {isLoggedIn &&
                <a className="navbar-item" onClick={() => logout()}>

                  <span className="icon">
                    <i className="fas fa-sign-out-alt" />
                  </span>
                  <p><Translate id="logout" /></p>
                </a>
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
  activeItem: PropTypes.string,
};
