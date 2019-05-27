import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import moment, { Moment } from 'moment/min/moment-with-locales';

import { SmallCalendarDatePicker } from './SmallCalendarDatePicker';
import { Settings } from '~/models/Settings';
import { OpeningHoursException } from '~/models/OpeningHours';
import { Day } from '~/models/Calendar';

interface Props {
  activeLanguage: string;
  defaultValue: string;
  defaultEndValue: string;
  path: string;
  settings: Settings;
  targetName: string;
  isHorizontal: boolean;
  disabled: boolean;
  openinghoursexceptions: {[key: string]: OpeningHoursException};
  isMulti: boolean;
};

interface State {
  saved: boolean;
  editing: boolean;
  viewTime: Moment;
  choosingStart: boolean;
  isMulti: boolean;
}

export default class ValidatedDateField extends Component<Props, Partial<State>> {

  delayedSave = _.debounce((value) => {
    firebase.update(this.props.path, value);
    this.setState({ saved: true, editing: false });
    this.delayedNormalize();
  }, 200)

  delayedNormalize = _.debounce(() => {
    this.setState({ saved: false, editing: false });
  }, 1000);

  constructor(props: Props) {
    super(props);

    const viewTime = props.defaultValue && props.defaultValue.length === 10 ? moment(props.defaultValue, 'YYYY-MM-DD') : moment();

    this.state = {
      saved: false,
      editing: false,
      viewTime,
      choosingStart: true,
    };
  }

  updateDateInDB(newDate: string, clearEndDate: boolean) {
    const { targetName } = this.props;
    this.setState({ editing: true, saved: false });
    const update: {[key: string]: string | null} = { [targetName]: newDate };
    if (clearEndDate) {
      update.endDate = null;
    }
    this.delayedSave(update);
  }

  updateEndDateInDB(newDate: string) {
    this.setState({ editing: true, saved: false });
    this.delayedSave({ endDate: newDate });
  }

  parseInformationForMonthYear(month: number, year: number): Day[] {
    const targetMonth = moment().month(month).year(year);
    const dayCount = targetMonth.daysInMonth();
    const days: Day[] = []

    for (let i = 1; i <= dayCount; i += 1) {
      const dayString = `${_.padStart(String(i), 2, '0')}-${targetMonth.format('MM-YYYY')}`;
      const day = moment(dayString, 'DD-MM-YYYY');

      days.push({
        day: day.format('DD'),
        dayOfWeek: parseInt(day.format('d')),
        dayName: day.format('dddd'),
        dayString: day.format('DD-MMMM-YYYY'),
        dayLink: day.format('YYYY/MM/DD'),
      });
    }

    const emptyDays = (days[0].dayOfWeek! % 7) - 1;
    const calendar: Day[] = [];
    for (let i = 0; i < emptyDays; i += 1) {
      calendar.push({ empty: true });
    }
    _.forEach(days, day => calendar.push(day));
    return calendar;
  }

  chunkedCalendar(calendar: Day[]): Day[][] {
    const chunkedCalendar = _.chunk(calendar, 7);
    while (chunkedCalendar[chunkedCalendar.length - 1].length < 7) {
      chunkedCalendar[chunkedCalendar.length - 1].push({ empty: true });
    }
    return chunkedCalendar;
  }

  clickDay(dayLink: string) {
    const clickMoment = moment(dayLink, 'YYYY/MM/DD');
    if (this.state.choosingStart) {
      this.updateDateInDB(clickMoment.format('YYYY-MM-DD'), !this.state.isMulti);
    } else {
      this.updateEndDateInDB(clickMoment.format('YYYY-MM-DD'));
    }
  }

  changeMonth(amount: number) {
    this.setState((prevState: Partial<State>) => {
      const viewTime = moment(prevState.viewTime, 'YYYY-MM');
      viewTime.add(amount, 'month');
      return { viewTime };
    });
  }

  setChoosingStart(newValue: boolean) {
    this.setState({ choosingStart: newValue });
  }

  render() {
    const { saved, editing, viewTime } = this.state;
    const { isHorizontal, disabled, settings, openinghoursexceptions, defaultValue, isMulti, defaultEndValue } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    moment.locale(this.props.activeLanguage);

    const eventDate = defaultValue ? moment(defaultValue, 'YYYY-MM-DD') : null;
    const eventEndDate = defaultEndValue ? moment(defaultEndValue, 'YYYY-MM-DD') : null;

    const isOk = !!defaultValue;

    if (!isMulti && disabled) {
      return (
        <div className={`field ${isHorizontal && 'is-horizontal'}`}>
          <div className="field-label is-normal">
            <Translate id="date" />
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control has-icons-left">
                <span className="icon is-small is-left"><i className="fas fa-lock" /></span>
                {eventDate &&
                  <input
                    className="input"
                    disabled
                    value={eventDate.format(`dddd - ${dateFormat}`)}
                  />
                }
              </p>
            </div>
          </div>
        </div>
      );
    }

    const viewDate = moment(viewTime, 'YYYY-MM');
    const calendarData: Day[]= this.parseInformationForMonthYear(viewDate.month(), viewDate.year());
    const chunkedCalendar = this.chunkedCalendar(calendarData);

    return (
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className={`label has-icons-left ${saved && 'has-text-success'} ${editing && 'has-text-warning'} ${!isOk && 'has-text-danger'}`}>
            {saved && <span className="icon is-small is-left"><i className="fas fa-check-circle" />&nbsp;&nbsp;</span>}
            {editing && <span className="icon is-small is-left"><i className="fas fa-pencil-alt" />&nbsp;&nbsp;</span>}
            <Translate id="date" />
          </label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="level">
              <div className="level-left">
                <h2 className="subtitle">{viewDate.format('MMMM - YYYY')}</h2>
              </div>
              {isMulti &&
                <div className="level-item">
                  <button className={`button is-small ${this.state.choosingStart && 'is-success is-outlined'}`} onClick={() => this.setChoosingStart(true)}><Translate id="startdate" /></button>
                  <button className={`button is-small ${!this.state.choosingStart && 'is-success is-outlined'}`} onClick={() => this.setChoosingStart(false)}><Translate id="enddate" /></button>
                </div>
              }
              <div className="level-right">
                <button className="button is-small" onClick={() => this.changeMonth(-1)}><i className="fas fa-arrow-left" /></button>
                <button className="button is-small" onClick={() => this.changeMonth(1)}><i className="fas fa-arrow-right" /></button>
              </div>
            </div>
            <SmallCalendarDatePicker
              chunkedCalendar={chunkedCalendar}
              clickDay={day => this.clickDay(day)}
              openinghoursexceptions={openinghoursexceptions}
              settings={settings}
              selectedDay={eventDate ? eventDate.format('YYYY-MM-DD') : null}
              selectedEndDay={eventEndDate ? eventEndDate.format('YYYY-MM-DD') : null}
            />
          </div>
        </div>
      </div>
    );
  }
}


