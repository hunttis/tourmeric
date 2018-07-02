import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { participantCount } from '../../../api/eventApi';

export default class EventParticipants extends Component {
  getParticipantsForEvent(eventId) {
    if (_.isEmpty(this.props.participations)) {
      return null;
    }

    const participants = this.props.participations[eventId];
    return participants;
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
            const user = users[participantEntry[0]];
            const participationInfo = participantEntry[1];
            return (
              <div key={participantEntry[0]}>
                {moment(participationInfo.date).format('DD-MM-YYYY  HH:mm:ss')} - {user.displayName}
              </div>
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
