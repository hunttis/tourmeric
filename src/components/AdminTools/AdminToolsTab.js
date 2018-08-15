import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';

export const AdminToolsTab = ({ tabid, isActive, switchAction, icon, translationKey }) => (
  <li id={tabid} className={`has-icon ${isActive && 'is-active'}`}>
    <a onClick={switchAction}>
      <span className="icon is-small"><i className={`fas ${icon}`} aria-hidden="true" /></span>
      <span><Translate id={translationKey} /></span>
    </a>
  </li>
);

AdminToolsTab.propTypes = {
  tabid: PropTypes.string,
  isActive: PropTypes.bool,
  switchAction: PropTypes.func,
  icon: PropTypes.string,
  translationKey: PropTypes.string,
};
