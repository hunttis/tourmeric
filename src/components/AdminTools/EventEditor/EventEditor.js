import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Moment from 'react-moment';
import ValidatedEditableField from './ValidatedEditableField-container';
import EditableTextarea from './EditableTextarea-container';
import ValidatedDateField from './ValidatedDateField-container';
import ValidatedTimeField from './ValidatedTimeField';
import ValidatedDropdown from './ValidatedDropdown-container';

export default class EditableEvent extends Component {

  constructor(props) {
    super(props);
    this.updateFieldStatus = this.updateFieldStatus.bind(this);
    const { eventContent } = this.props;
    this.state = {
      nameOk: !_.isEmpty(eventContent.name),
      categoryOk: !_.isEmpty(eventContent.category),
      formatOk: !_.isEmpty(eventContent.format),
      dateOk: !_.isEmpty(eventContent.date),
      timeOk: !_.isEmpty(eventContent.time),
      playerSlotsOk: !_.isEmpty(eventContent.playerSlots),
      entryFeeOk: !_.isEmpty(eventContent.entryFee),
      rulesLevelOk: !_.isEmpty(eventContent.rulesLevel),
      prizesOk: !_.isEmpty(eventContent.prizes),
      notesOk: !_.isEmpty(eventContent.notes),
      linkOk: !_.isEmpty(eventContent.link),
    };
  }

  addPublishAndDeleteButtons(eventId, published, allFieldsOk) {
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

  updateFieldStatus(fieldName, fieldStatus) {
    const field = `${fieldName}Ok`;
    this.setState({ [field]: fieldStatus });
  }

  render() {
    const { categories, eventId, eventContent, settings } = this.props;
    const allFieldsOk = _.every(this.state);

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    return (
      <div className="column is-12 columns is-multiline editableevent box">
        <div className="column is-6">
          <div className="has-text-right is-small is-disabled"><Translate id="editing" /> <Translate id="eventid" />: {eventId}</div>
        </div>
        <div className="column is-6">

          <div className="level">
            <div className="level-left" />
            <div className="level-right">
              <button className="button is-right" onClick={this.props.toggleEventVisibility}><Translate id="minimize" /></button>
            </div>
          </div>
        </div>

        <div className="column is-6">
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

        <div className="column is-6">
          <ValidatedEditableField
            isOk={this.state.formatOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="format"
            placeHolder="formatplaceholder"
            defaultValue={eventContent.format}
            path={`/events/${eventId}`}
            targetName="format"
          />
        </div>

        <div className="column is-12">
          <ValidatedDateField
            isOk={this.state.dateOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="date"
            defaultValue={eventContent.date}
            inputType="date"
            path={`/events/${eventId}`}
            targetName="date"
          />
        </div>

        <div className="column is-12">
          <Translate id="abovedateinterpretedas" /> : <Moment format={dateFormat}>{eventContent.date}</Moment>
        </div>

        <div className="column is-12">
          <ValidatedTimeField
            isOk={this.state.timeOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="time"
            placeHolder="timeformat"
            defaultValue={eventContent.time}
            path={`/events/${eventId}`}
          />
        </div>

        <div className="column is-6">
          <ValidatedEditableField
            isOk={this.state.playerSlotsOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="playerslots"
            placeHolder="playerslotsplaceholder"
            defaultValue={eventContent.playerSlots}
            inputType="number"
            path={`/events/${eventId}`}
            targetName="playerSlots"
          />
        </div>

        <div className="column is-6">
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

        <div className="column is-6">
          <ValidatedEditableField
            isOk={this.state.rulesLevelOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="ruleslevel"
            placeHolder="ruleslevelplaceholder"
            defaultValue={eventContent.rulesLevel}
            path={`/events/${eventId}`}
            targetName="rulesLevel"
          />
        </div>

        <div className="column is-6">
          <EditableTextarea
            isOk={this.state.prizesOk}
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
            isOk={this.state.notesOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="notes"
            placeHolder="notesplaceholder"
            defaultValue={eventContent.notes}
            path={`/events/${eventId}`}
            targetName="notes"
          />
        </div>

        <div className="column is-6">
          <ValidatedEditableField
            isOk={this.state.linkOk}
            updateFieldStatus={this.updateFieldStatus}
            labelContent="link"
            placeHolder="linkplaceholder"
            defaultValue={eventContent.link}
            path={`/events/${eventId}`}
            targetName="link"
          />
        </div>

        <div className="column is-6">
          <div className="level">
            <div className="level-left" />
            <div className="level-item has-text-right">{!allFieldsOk && <Translate id="fillmissingdatatopublish" />}</div>
            <div className="level-right">
              {this.addPublishAndDeleteButtons(eventId, eventContent.published, allFieldsOk)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EditableEvent.propTypes = {
  categories: PropTypes.object,
  eventId: PropTypes.string,
  eventContent: PropTypes.object,
  toggleEventVisibility: PropTypes.func,
  settings: PropTypes.object,
};
