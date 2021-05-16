import React from 'react';
import { FormattedMessage } from "react-intl";
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import { Settings } from '../../../models/Settings';

/* eslint-disable-next-line no-unused-vars */
/* const themes = ['Default', 'Cerulean', 'Cosmo', 'Cyborg',
  'Darkly', 'Flatly', 'Journal', 'Litera', 'Lumen', 'Lux', 'Materia',
  'Minty', 'Nuclear', 'Pulse', 'Sandstone', 'Simplex', 'Slate', 'Solar',
  'Spacelab', 'Superhero', 'United', 'Yeti'];
  */
// These are not used, since themes are 'hardcoded' now

interface Props {
  settings: Settings;
}

export const Themes = ({ settings }: Props) => (
  <div className="columns is-multiline">
    <div className="column is-12">
      <h1 className="title">
        <FormattedMessage id="looks" />
      </h1>
    </div>

    <div className="column is-12">
      <h1 className="title">
        <FormattedMessage id="themecoloroverrides" />
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
