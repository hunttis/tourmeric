import React from 'react';
import { FormattedMessage } from "react-intl";

interface Props {
  className?: string;
  onClick: any;
  iconName: string;
  translationKey: string;
}

export const ButtonWithIcon = ({ className, onClick, iconName, translationKey }: Props) => (
  <button className={`button ${className}`} onClick={onClick}>
    <span className="icon"><i className={`fas ${iconName}`} /></span>
    <span><FormattedMessage id={translationKey} /></span>
  </button>
);
