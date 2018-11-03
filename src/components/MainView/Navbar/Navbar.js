import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { logout } from '../../../api/loginApi';
import { NavbarItem } from './NavbarItem';

export default class Navbar extends Component {

  state = { burgerOpen: false };

  componentDidMount() {
    this.historyListener = this.props.history.listen(() => this.closeBurger());
  }

  componentWillUnmount() {
    this.historyListener();
  }

  closeBurger() {
    this.setState({ burgerOpen: false });
  }

  toggleBurger() {
    const { burgerOpen } = this.state;
    this.setState({ burgerOpen: !burgerOpen });
  }

  switchTab() {
    const { burgerOpen } = this.state;
    if (burgerOpen) {
      this.setState({ burgerOpen: false });
    }
  }

  render() {

    const { profile, settings, changeLanguage, location } = this.props;
    const isProfileLoaded = isLoaded(profile) && isLoaded(settings);

    const eventsActive = _.get(settings, 'features.events.active', false);
    const storeInfoActive = _.get(settings, 'features.storeinfo.active', false);

    const activeItem = location.pathname.substring(1);

    if (isProfileLoaded) {
      const isLoggedIn = !isEmpty(profile);
      const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';
      const { burgerOpen } = this.state;
      const activeClass = 'is-active';

      return (
        <div className="navbar is-white" role="navigation" aria-label="dropdown navigation">
          <div className="navbar-brand">
            <div className="navbar-item is-hidden-desktop">
              {settings.activeLogo &&
                <img src={settings.activeLogo} alt="" />
              }
              {!settings.activeLogo &&
                <div>{settings.pageTitle}</div>
              }
            </div>

            <div role="button" className={`navbar-burger ${this.state.burgerOpen && 'is-active'}`} tabIndex={0} onClick={() => { this.toggleBurger(); }}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>
          </div>
          <div className={`navbar-menu ${burgerOpen && 'is-active'}`} id="navbarTarget">
            <div className="navbar-start">
              <NavbarItem linkTarget="/today" translationKey="today" icon="fa-calendar" styleClass={activeItem === 'today' ? activeClass : ''} />
              {eventsActive &&
                <NavbarItem linkTarget="/events" translationKey="events" icon="fa-calendar-alt" styleClass={activeItem === 'events' ? activeClass : ''} />
              }
              {storeInfoActive &&
                <NavbarItem linkTarget="/storeinfo" translationKey="contactinfo" icon="fa-store" styleClass={activeItem === 'storeinfo' ? activeClass : ''} />
              }
              {isLoggedIn &&
                <NavbarItem linkTarget="/userinfo" translationKey="userinfo" icon="fa-user" styleClass={activeItem === 'userinfo' ? activeClass : ''} />
              }
              <NavbarItem linkTarget="/companyinfo" translationKey="companyinfo" icon="fa-warehouse" styleClass={activeItem === 'companyinfo' ? activeClass : ''} />

              {isAdmin &&
                <div className="navbar-item has-dropdown is-hoverable is-white">
                  <a className={`navbar-link ${(['admintools', 'admintoolsevents', 'adminsitesettings'].includes(activeItem)) && 'is-active'}`}>
                    <span className="icon">
                      <i className="fas fa-star" />
                    </span>
                    &nbsp;&nbsp;
                    <Translate id="admin" />
                  </a>
                  <div className="navbar-dropdown">
                    <NavbarItem linkTarget="/admintools" translationKey="admingeneric" icon="fa-calendar" styleClass={activeItem === 'admintools' ? activeClass : ''} />
                    <NavbarItem linkTarget="/admintoolsevents" translationKey="adminevents" icon="fa-calendar-plus" styleClass={activeItem === 'admintoolsevents' ? activeClass : ''} />
                    <NavbarItem linkTarget="/adminsitesettings" translationKey="adminsitesettings" icon="fa-cogs" styleClass={activeItem === 'adminsitesettings' ? activeClass : ''} />
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
                  <NavbarItem linkTarget="/login" translationKey="login" icon="fa-sign-in-alt" />
                  <NavbarItem linkTarget="/register" translationKey="register" icon="fa-pencil-alt" />
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
    return <div />;
  }
}

Navbar.propTypes = {
  profile: PropTypes.object,
  settings: PropTypes.object,
  changeLanguage: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
};
