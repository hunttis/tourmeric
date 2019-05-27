import React from 'react';
import { Translate } from 'react-localize-redux';
import FileHandler from './FileHandler-container';
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import { Settings } from '~/models/Settings';

interface Props {
  settings: Settings;
};

export const PageTitles = ({ settings }: Props) => (
  <div className="columns is-multiline">
    <div className="column is-12">
      <h1 className="title">
        <Translate id="pagetitles" />
      </h1>
    </div>

    <div className="column is-half-tablet">
      <EditableVerticalField
        defaultValue={settings.pageTitle}
        labelContent="pagetitle"
        placeHolder="pagetitleplaceholder"
        path="/settings"
        targetName="pageTitle"
      />
    </div>
    <div className="column is-half-tablet">
      <EditableVerticalField
        defaultValue={settings.pageSubtitle}
        labelContent="pagesubtitle"
        placeHolder="pagesubtitleplaceholder"
        path="/settings"
        targetName="pageSubtitle"
      />
    </div>
    <FileHandler />
  </div>
);
