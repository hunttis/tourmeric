import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';

export const NavbarItem = ({ onClick, translationKey, icon }) => (
  <div className="navbar-item">
    <a onClick={onClick}>
      <span className="icon">
        <i className={`fas ${icon}`} />
      </span>
      &nbsp;&nbsp;
      <Translate id={translationKey} />
    </a>
  </div>
);

NavbarItem.propTypes = {
  onClick: PropTypes.func,
  translationKey: PropTypes.string,
  icon: PropTypes.string,
};
