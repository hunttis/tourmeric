import React from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import EditableVerticalField from '../../Common/EditableVerticalField-container';

export const Themes = ({ settings, themes, changeTheme }) => (
  <div className="columns is-multiline">
    <div className="column is-12">
      <h1 className="title">
        <Translate id="theme" />
      </h1>
    </div>

    <div className="column is-6">
      <label className="label"><Translate id="theme" /></label>
      <div className="control">
        <div className="select">
          <select defaultValue={settings.theme} onChange={event => changeTheme(event.target.value)}>
            <option>- <Translate id="selecttheme" /> -</option>
            {themes.map(theme => <option key={`option${theme}`} value={theme.toLowerCase()}>{theme}</option>)}
          </select>
        </div>
      </div>
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
  themes: PropTypes.array,
  changeTheme: PropTypes.func,
};
