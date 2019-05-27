import React from 'react';
import { Translate } from 'react-localize-redux';

interface Props {
  isActive: boolean;
  switchAction: () => void;
  icon: string;
  translationKey: string;
}

export const AdminToolsTab = ({ isActive, switchAction, icon, translationKey }: Props) => (
  <li className={`has-icon ${isActive && 'is-active'}`}>
    <a onClick={switchAction}>
      <span className="icon is-small"><i className={`fas ${icon}`} aria-hidden="true" /></span>
      <span><Translate id={translationKey} /></span>
    </a>
  </li>
);
