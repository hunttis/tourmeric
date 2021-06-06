import React from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
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
    <FormattedMessage id={translationKey} />
  </Link>
);
