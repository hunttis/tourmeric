import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import Moment from 'react-moment';
import moment from 'moment';

import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

import ValidatedEditableField from './ValidatedEditableField-container';
import EditableTextarea from './EditableTextarea-container';
import ValidatedTimeField from './ValidatedTimeField';
import ValidatedDropdown from './ValidatedDropdown';
import ValidatedDropdownForArray from './ValidatedDropdownForArray';

import { TourmericEvent } from '../../../models/Events';
import { Settings } from '../../../models/Settings';
import { Category } from '../../../models/Category';

interface Props {
  categories: {[key: string]: Category};
  eventId: string;
  eventContent: TourmericEvent;
  toggleEventVisibility: () => {};
  settings: Settings;
}

interface State {
  focused: boolean;
  date: string;
  nameOk: boolean;
  categoryOk: boolean;
  formatOk: boolean;
  dateOk: boolean;
  timeOk: boolean;
  entryFeeOk: boolean;
}

export default class EditableEvent extends Component<Props, Partial<State>> {

  constructor(props: Props) {
    super(props);
    this.updateFieldStatus = this.updateFieldStatus.bind(this);
    const { eventContent } = this.props;
    this.state = {
      focused: false,
      date: eventContent.date,
      nameOk: !_.isEmpty(eventContent.name),
      categoryOk: !_.isEmpty(eventContent.category),
      formatOk: this.checkIfFormatOk(eventContent.format),
      dateOk: !_.isEmpty(eventContent.date),
      timeOk: !_.isEmpty(eventContent.time),
      entryFeeOk: !_.isEmpty(eventContent.entryFee),
    };
  }

  checkIfFormatOk(format: string | null) {
    const { eventContent, categories } = this.props;
    const selectedCategory = eventContent.category ? categories[eventContent.category] : { formats: null };
    const formatOptions = _.isEmpty(selectedCategory.formats) || !selectedCategory.formats ? [] : selectedCategory.formats.split(',');
    const formatIsEmptyAndNoOptions = _.isEmpty(formatOptions) && _.isEmpty(format);
    return formatIsEmptyAndNoOptions || !_.isEmpty(format);
  }

  addPublishAndDeleteButtons(eventId: string, published: boolean, allFieldsOk: boolean) {
    return (
      <div>
        <div><Translate id="published" />: {published ? <Translate id="yes" /> : <Translate id="no" />}</div>

        {published &&
          <button className="button is-warning" onClick={() => firebase.update(`/events/${eventId}`, { published: false })}><Translate id="unpublish" /></button>
        }
        {!published &&
          <button className="button is-primary" disabled={!allFieldsOk} onClick={() => firebase.update(`/events/${eventId}`, { published: true })}><Translate id="publish" /></button>
        }
        {!published &&
          <button className="button is-danger" onClick={() => firebase.set(`/events/${eventId}`, {})}><Translate id="delete" /></button>
        }
      </div>
    );
  }

  updateFieldStatus(fieldName: string, fieldStatus: string) {
    const field = `${fieldName}Ok`;
    const updatedField = { [field]: fieldStatus };

    const { eventContent } = this.props;
    const newState = { nameOk: !_.isEmpty(eventContent.name),
      categoryOk: !_.isEmpty(eventContent.category),
      formatOk: this.checkIfFormatOk(eventContent.format),
      dateOk: !_.isEmpty(eventContent.date),
      timeOk: !_.isEmpty(eventContent.time),
      entryFeeOk: !_.isEmpty(eventContent.entryFee),
      ...updatedField };

    this.setState(newState);
  }

  dayPhase(time: string) {

    if (!time) {
      return '';
    }

    try {
      const hour = time.split(':')[0];
      const hourNumber = parseInt(hour, 10);

      if (hourNumber >= 0 && hourNumber < 6) {
        return <Translate id="night" />;
      }

      if (hourNumber >= 6 && hourNumber < 10) {
        return <Translate id="morning" />;
      }

      if (hourNumber >= 10 && hourNumber < 14) {
        return <Translate id="daytime" />;
      }

      if (hourNumber >= 14 && hourNumber < 18) {
        return <Translate id="afternoon" />;
      }

      if (hourNumber >= 18 && hourNumber <= 23) {
        return <Translate id="evening" />;
      }

    } catch (error) {
      console.warn('Something in the dayphase viewer', error);
    }
    return '';
  }

  async saveDate(newDate: string) {
    const { eventId } = this.props;
    await firebase.update(`/events/${eventId}`, { date: newDate });
    this.setState({ date: newDate });
  }

  render() {
    const { categories, eventId, eventContent, settings } = this.props;
    const allFieldsOk = _.every([this.state.nameOk, this.state.categoryOk, this.state.formatOk, this.state.dateOk, this.state.timeOk, this.state.entryFeeOk]);
    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');
    moment.locale('fi');

    const selectedCategory = eventContent.category ? categories[eventContent.category] : { formats: null };
    const formatOptions = _.isEmpty(selectedCategory.formats) || !selectedCategory.formats ? [] : selectedCategory.formats.split(',');
    const cleanedFormatOptions = formatOptions.map((option) => _.trim(option));

    return (
      <div className="column is-12 columns is-multiline editableevent box">
        <div className="column is-6">
          <div className="has-text-right is-small is-disabled is-hidden"><Translate id="editing" /> <Translate id="eventid" />: {eventId}</div>
        </div>
        <div className="column is-6">

          <div className="level">
            <div className="level-left" />
            <div className="level-right">
              <button className="button is-right" onClick={() => this.props.toggleEventVisibility()}><Translate id="minimize" /></button>
            </div>
          </div>
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk={this.state.nameOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="name"
            placeHolder="eventnameplaceholder"
            defaultValue={eventContent.name}
            path={`/events/${eventId}`}
            targetName="name"
          />
        </div>

        <div className="column is-6">
          <ValidatedDropdown
            isOk={this.state.categoryOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="category"
            placeHolder="categoryplaceholder"
            defaultValue={eventContent.category}
            dropdownItems={categories}
            path={`/events/${eventId}`}
            targetName="category"
          />
        </div>

        {!_.isEmpty(formatOptions) &&
          <div className="column is-6">
            <ValidatedDropdownForArray
              isOk={this.state.formatOk}
              updateFieldStatus={this.updateFieldStatus}
              labelContent="format"
              placeHolder="formatplaceholder"
              defaultValue={eventContent.format}
              dropdownItems={cleanedFormatOptions}
              path={`/events/${eventId}`}
              targetName="format"
            />
          </div>
        }

        <div className="column is-12 is-hidden-mobile">
          <hr />
        </div>

        <div className="column is-12">
          <h2 className="subtitle"><Translate id="time" /></h2>
          <ValidatedTimeField
            isOk={this.state.timeOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="time"
            placeHolder="timeformat"
            defaultValue={eventContent.time}
            path={`/events/${eventId}`}
          />
        </div>

        <div className="column is-12">
          <h2 className="subtitle"><Translate id="date" /></h2>
          <SingleDatePicker
            date={this.state.date ? moment(this.state.date, 'YYYY-MM-DD') : moment()}
            onDateChange={(date) => this.saveDate(date!.format('YYYY-MM-DD'))}
            focused={!!this.state.focused}
            onFocusChange={({ focused }) => this.setState({ focused: !!focused })}
            id={`${eventId}-datepicker`}
            firstDayOfWeek={1}
            displayFormat={dateFormat}
          />
        </div>

        <div className="column is-12">
          <Translate id="abovedateinterpretedas" /> : <span className="has-text-success"><Moment format={dateFormat}>{eventContent.date}</Moment></span> <span className="has-text-info">{eventContent.time}</span> <span className="has-text-warning">{this.dayPhase(eventContent.time)}</span>
        </div>

        <div className="column is-12 is-hidden-mobile">
          <hr />
        </div>

        <div className="column is-4">
          <ValidatedEditableField
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent="playerslots"
            placeHolder="playerslotsplaceholder"
            defaultValue={eventContent.playerSlots}
            inputType="number"
            path={`/events/${eventId}`}
            targetName="playerSlots"
          />
        </div>

        <div className="column is-4">
          <ValidatedEditableField
            isOk={this.state.entryFeeOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="entryfee"
            placeHolder="entryfeeplaceholder"
            defaultValue={eventContent.entryFee}
            inputType="number"
            path={`/events/${eventId}`}
            targetName="entryFee"
          />
        </div>

        <div className="column is-4">
          <ValidatedEditableField
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent="ruleslevel"
            placeHolder="ruleslevelplaceholder"
            defaultValue={eventContent.rulesLevel}
            path={`/events/${eventId}`}
            targetName="rulesLevel"
          />
        </div>

        <div className="column is-12">
          <ValidatedEditableField
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent="link"
            placeHolder="linkplaceholder"
            defaultValue={eventContent.link}
            path={`/events/${eventId}`}
            targetName="link"
          />
        </div>

        <div className="column is-6">
          <EditableTextarea
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent="prizes"
            placeHolder="prizesplaceholder"
            defaultValue={eventContent.prizes}
            path={`/events/${eventId}`}
            targetName="prizes"
          />
        </div>

        <div className="column is-6">
          <EditableTextarea
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent="notes"
            placeHolder="notesplaceholder"
            defaultValue={eventContent.notes}
            path={`/events/${eventId}`}
            targetName="notes"
          />
        </div>


        <div className="column is-12">
          <div className="level">
            <div className="level-left is-hidden-tablet" />
            <div className="level-item is-hidden-tablet" />
            <div className="level-item has-text-right">{!allFieldsOk && <span className="has-text-warning"><Translate id="fillmissingdatatopublish" /></span>}</div>
            <div className="level-right">
              {this.addPublishAndDeleteButtons(eventId, eventContent.published, allFieldsOk)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
