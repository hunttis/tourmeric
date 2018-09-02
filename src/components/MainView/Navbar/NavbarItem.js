import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

export const NavbarItem = ({ onClick, translationKey, icon, styleClass }) => (
  <a onClick={onClick} className={`navbar-item ${styleClass}`}>
    <span className="icon">
      <i className={`fas ${icon}`} />
    </span>
      &nbsp;&nbsp;
    <Translate id={translationKey} />
  </a>
);

NavbarItem.propTypes = {
  onClick: PropTypes.func,
  translationKey: PropTypes.string,
  icon: PropTypes.string,
  styleClass: PropTypes.string,
};
