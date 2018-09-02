import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import EditableVerticalField from '../../Common/EditableVerticalField-container';

export const Themes = ({ settings }) => (
  <div className="columns is-multiline">
    <div className="column is-12">
      <h1 className="title">
        <Translate id="looks" />
      </h1>
    </div>

    <div className="column is-12">
      <h1 className="title">
        <Translate id="themecoloroverrides" />
      </h1>
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.titleBarColor}
        labelContent="titlebarcolor"
        placeHolder="colorplaceholder"
        path="/settings"
        targetName="titleBarColor"
      />
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.titleBarColor2}
        labelContent="titlebarcolor2"
        placeHolder="colorplaceholder"
        path="/settings"
        targetName="titleBarColor2"
      />
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.titleBarPercentage}
        inputType="number"
        labelContent="titlebarpercentage"
        placeHolder="titlebarpercentageplaceholder"
        path="/settings"
        targetName="titleBarPercentage"
      />
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.titleBarAngle}
        inputType="number"
        labelContent="titlebarangle"
        placeHolder="titlebarangleplaceholder"
        path="/settings"
        targetName="titleBarAngle"
      />
    </div>


    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.titleTextColor}
        labelContent="titletextcolor"
        placeHolder="colorplaceholder"
        path="/settings"
        targetName="titleTextColor"
      />
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.subtitleTextColor}
        labelContent="subtitletextcolor"
        placeHolder="colorplaceholder"
        path="/settings"
        targetName="subtitleTextColor"
      />
    </div>
  </div>
);

Themes.propTypes = {
  settings: PropTypes.object,
};
