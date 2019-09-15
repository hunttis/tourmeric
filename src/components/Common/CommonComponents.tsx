import React from 'react';
import { Translate } from 'react-localize-redux';

interface Props {
  className?: string;
  onClick: any;
  iconName: string;
  translationKey: string;
}

export const ButtonWithIcon = ({ className, onClick, iconName, translationKey }: Props) => (
  <button className={`button ${className}`} onClick={onClick}>
    <span className="icon"><i className={`fas ${iconName}`} /></span>
    <span><Translate id={translationKey} /></span>
  </button>
);
