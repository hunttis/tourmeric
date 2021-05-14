import React from 'react';
import moment from 'moment';
import { Translate } from 'react-localize-redux';
import EditableVerticalField from '../../Common/EditableVerticalField-container';
import { Settings } from '../../../models/Settings';

interface Props {
  settings: Settings;
  showDefaultButton: boolean;
  defaultDateFormat: () => {};
}

export const Localization = ({ settings, showDefaultButton, defaultDateFormat }: Props) => (
  <div className="columns is-multiline">
    <div className="column is-12">
      <h1 className="title">
        <Translate id="dateformat" />
      </h1>
    </div>

    <div className="column is-6">
      <EditableVerticalField
        defaultValue={settings.dateFormat}
        labelContent="dateformat"
        placeHolder="dateformatplaceholder"
        path="/settings"
        targetName="dateFormat"
      />
    </div>

    <div className="column is-6">
      <div className="dateformattext is-hidden-mobile"><Translate id="lookslike" />: <strong><span className="has-text-success">{moment().format(settings.dateFormat)}</span></strong></div>
      <div className="is-hidden-tablet"><Translate id="lookslike" />: <strong><span className="has-text-success">{moment().format(settings.dateFormat)}</span></strong></div>
    </div>
    {showDefaultButton &&
      <div className="column is-6">
        <div className="field">
          <label className="label">
            <Translate id="clicktousedefaultdateformat" />
          </label>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-right">
                <button className="button" onClick={() => defaultDateFormat()}>DD.MM.YYYY</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    }
    <div className="column is-6">
      <Translate id="help" />: <a href="https://momentjs.com/docs/#/displaying/format/"><Translate id="momentdateformatdocs" /></a>
    </div>

  </div>
);
