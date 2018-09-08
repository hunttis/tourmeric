import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import firebase from 'firebase/app';
import { participantCount } from '../../../api/eventApi';

export default class EventParticipants extends Component {
  getParticipantsForEvent(eventId) {
    if (_.isEmpty(this.props.participations)) {
      return null;
    }

    const participants = this.props.participations[eventId];
    return participants;
  }

  removeParticipation(eventId, userId) {
    return firebase.set(`participations/${eventId}/${userId}`, {});
  }

  render() {
    const {
      eventId, users, participations, events,
    } = this.props;

    const participantsForEvent = this.getParticipantsForEvent(eventId);
    const hasParticipants = !!participantsForEvent;
    const event = events[eventId];
    const participants = hasParticipants ? _.sortBy(Object.entries(participantsForEvent), participantEntry => participantEntry[1].date) : [];

    return (
      <div className="column is-12 columns is-multiline">
        {!hasParticipants &&
          <div><Translate id="noparticipants" /></div>
        }
        {hasParticipants &&
          <div className="column is-8">
            <h2 className="subtitle">{participantCount(eventId, participations)} / {event.playerSlots} <Translate id="participants" /></h2>
          </div>
        }
        <div className="column is-12">
          {hasParticipants && participants.map((participantEntry) => {
            const userId = participantEntry[0];
            const userIsPlaceholder = _.isEmpty(users[userId]);
            const participationInfo = participantEntry[1];
            return (
              <Fragment>
                <div key={userId} className={`${userIsPlaceholder && 'has-text-warning'} has-background-black is-rounded`}>
                  {moment(participationInfo.date).format('DD-MM-YYYY  |  HH:mm:ss')} - {participationInfo.firstName} {participationInfo.lastName}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <button className="button is-danger is-rounded is-small" onClick={() => this.removeParticipation(eventId, userId)}><i className="fas fa-user-minus" /></button>
                </div>
                <div>&nbsp;</div>
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  }
}

EventParticipants.propTypes = {
  eventId: PropTypes.string,
  events: PropTypes.object,
  participations: PropTypes.object,
  users: PropTypes.object,
};
