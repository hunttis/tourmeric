import React from 'react';
import { Translate } from 'react-localize-redux';
import { Link } from 'react-router-dom';

interface Props {
  linkTarget: string;
  translationKey: string;
  icon: string;
  styleClass?: string;
}


export const NavbarItem = ({ linkTarget, translationKey, icon, styleClass }: Props) => (
  <Link to={linkTarget} className={`navbar-item ${styleClass}`}>
    <span className="icon">
      <i className={`fas ${icon}`} />
    </span>
    &nbsp;&nbsp;
    <Translate id={translationKey} />
  </Link>
);
