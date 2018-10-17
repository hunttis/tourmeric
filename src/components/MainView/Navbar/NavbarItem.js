import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

export const NavbarItem = ({ linkTarget, translationKey, icon, styleClass }) => (
  <Link to={linkTarget} className={`navbar-item ${styleClass}`}>
    <span className="icon">
      <i className={`fas ${icon}`} />
    </span>
      &nbsp;&nbsp;
    <Translate id={translationKey} />
  </Link>
);

NavbarItem.propTypes = {
  linkTarget: PropTypes.string.isRequired,
  translationKey: PropTypes.string,
  icon: PropTypes.string,
  styleClass: PropTypes.string,
};
