import React, { Component } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import moment from 'moment';
import EventParticipants from './EventParticipants-container';
import { participantCount, adminparticipate } from '../../../api/eventApi';

export default class SingleEventParticipation extends Component {

  state = { firstName: '', lastName: '' }

  savePlaceholderuser() {
    const { firstName, lastName } = this.state;
    const { eventId } = this.props;
    const fakeUser = { key: `Placeholder-${Math.round(Math.random() * 1000)}`, value: { firstName, lastName } };
    adminparticipate(eventId, fakeUser);
  }

  render() {

    const {
      users, categories, participations, admin, settings, eventId, event,
    } = this.props;

    const dateFormat = _.get(settings, 'dateFormat', 'DD-MM-YYYY');

    return (
      <div key={`parteditor-${eventId}`} className="box column is-12">
        <div className="columns">
          <div className="column is-4 has-text-left">
            <h1 className="title">{event.name}</h1>
          </div>
          <div className="column is-2">
            <div>
              <span className="icon is-small is-left"><i className="fas fa-calendar" /></span>
              <Moment format={dateFormat}>{moment(event.date)}</Moment>
            </div>
            <div>
              <span className="icon is-small is-left"><i className="fas fa-clock" /></span>
              {event.time}
            </div>
          </div>
          <div className="column">{categories[event.category].name}</div>
        </div>
        <div className="columns">
          <div className="column is-12">
            <EventParticipants eventId={eventId} toggleParticipantVisibility={this.toggleParticipantVisibility} />
          </div>
        </div>
        <div className="columns">

          <div className="column is-2">
            {participantCount(eventId, participations)} / {event.playerSlots}
          </div>
          <div className="column is-10">
            <div className="field has-addons">
              <div className="control is-expanded">
                <div className="select has-text-right">
                  <select
                    className="input"
                    id="adminparticipation"
                    onChange={(e) => {
                      this.props.chooseParticipant(eventId, e.target.value);
                    }}
                  >
                    <option value=""><Translate id="select" /></option>
                    {users.map((userEntry) => {
                      const userId = userEntry.key;
                      const user = userEntry.value;
                      const alreadyParticipated = Boolean(_.get(participations, `${eventId}.${userId}`));
                      if (alreadyParticipated) {
                        return '';
                      }
                      return (
                        <option key={`part${eventId}${userId}`} value={userId}>
                          {user.firstName} {user.lastName} - {user.email} - {userId}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="control">
                <button
                  className="button"
                  onClick={() => adminparticipate(eventId, _.find(users, { key: admin[eventId] }), admin[eventId])}
                ><Translate id="adduserparticipation" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-2">
            <Translate id="addplaceholderuser" />
          </div>
          <div className="column is-4">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><Translate id="firstname" /></label>
              </div>
              <div className="field-body">
                <input className="input" onChange={(change) => { this.setState({ firstName: change.target.value }); }} />
              </div>
            </div>
          </div>
          <div className="column is-4">
            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><Translate id="lastname" /></label>
              </div>
              <div className="field-body">
                <input className="input" onChange={(change) => { this.setState({ lastName: change.target.value }); }} />
              </div>
            </div>
          </div>
          <div className="column is-2">
            <button className="button" onClick={() => this.savePlaceholderuser()}><Translate id="add" /></button>
          </div>
        </div>
      </div>
    );
  }
}

SingleEventParticipation.propTypes = {
  users: PropTypes.array,
  categories: PropTypes.object,
  participations: PropTypes.object,
  admin: PropTypes.object,
  chooseParticipant: PropTypes.func,
  settings: PropTypes.object,
  event: PropTypes.object,
  eventId: PropTypes.string,
};
