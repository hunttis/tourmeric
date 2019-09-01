import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import moment from 'moment';
import _ from 'lodash';
import SelectElement from '../../AdminTools/EventEditor/SelectElement';
import { OpeningHoursException } from '../../../models/OpeningHours';

interface OpeningHoursExceptionEditorProps {
  day: moment.Moment;
  existingExceptions: { [key: string]: OpeningHoursException };
  closeEditor: () => void;
}

export class OpeningHoursExceptionEditor extends Component<OpeningHoursExceptionEditorProps> {

  delayedSave = _.debounce(async (path, item, value) => {
    await firebase.update(`${path}`, { [item]: value });
  }, 500)

  async deleteException(path: string) {
    await firebase.set(`${path}`, {});
    this.props.closeEditor();
  }

  async setShopClosed(path: string, item: string, value: boolean) {
    await firebase.update(`${path}`, { openingHours: null });
    this.delayedSave(path, item, value);
  }

  render() {
    const { day, existingExceptions, closeEditor } = this.props;
    const todayString = day.format('YYYY-MM-DD');
    const exceptionForToday = existingExceptions[todayString];
    const pathForToday = `/openinghoursexceptions/${todayString}/`;

    const openOk = exceptionForToday && !_.isNil(exceptionForToday.status);
    const descriptionOk = exceptionForToday && exceptionForToday.name;
    const hoursOk = exceptionForToday && (exceptionForToday.status === 'closed' || (exceptionForToday.status === 'open' && exceptionForToday.openingHours));

    return (
      <Translate>
        {(translate: any) => (
          <div>
            <SelectElement
              labelContent="open"
              defaultValue={exceptionForToday ? exceptionForToday.status : 'none'}
              dropdownItems={{ open: translate('open'), closed: translate('closed') }}
              isOk={exceptionForToday && !_.isNil(exceptionForToday.status)}
              targetName="status"
              path={pathForToday}
              isLocked={false}
              isHorizontal={false}
            />

            {openOk &&
              <div className="field">
                <div className="label">
                  <label className="label"><Translate id="description" /></label>
                </div>
                <div className="field-body">
                  <div className="field">
                    <p className="control">
                      <input
                        type="text"
                        className="input"
                        defaultValue={exceptionForToday ? exceptionForToday.name : ''}
                        onChange={(event) => this.delayedSave(pathForToday, 'name', event.target.value)}
                      />
                    </p>
                  </div>
                </div>
              </div>
            }

            {openOk && descriptionOk && (exceptionForToday && exceptionForToday.status === 'open') &&
              <div className="field ">
                <div className="label">
                  <label className="label">{translate('hours')}</label>
                </div>
                <div className="field">
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      defaultValue={exceptionForToday ? exceptionForToday.openingHours : ''}
                      placeholder={translate('openinghoursexample')}
                      onChange={(event) => this.delayedSave(pathForToday, 'openingHours', event.target.value)}
                    />
                  </div>
                </div>
              </div>
            }
            {hoursOk &&
              <button className="button is-info is-outlined" onClick={() => closeEditor()}><Translate id="done" /></button>
            }
            {exceptionForToday &&
              <button className="button is-danger is-outlined" onClick={() => this.deleteException(pathForToday)}><Translate id="deleteexception" /></button>
            }
          </div>
        )}
      </Translate>
    );
  }
}
