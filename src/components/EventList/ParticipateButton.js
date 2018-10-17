import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { participantCount, participate, checkParticipation, cancelParticipation } from '../../api/eventApi';

export const ParticipateButton = ({
  profile, events, eventId, participations, userId,
}) => {

  const alreadyParticipated = checkParticipation(userId, eventId, participations);
  const eventContent = _.get(events, eventId, {});
  const maxParticipants = _.get(eventContent, 'playerSlots', 0);
  const currentParticipants = participantCount(eventId, participations);
  const eventFull = Boolean(maxParticipants && maxParticipants <= currentParticipants);

  if (alreadyParticipated) {
    return (
      <div>
        <button className="cancelbutton button is-rounded is-danger" onClick={() => cancelParticipation(eventId, userId)}>
          <p><Translate id="cancelparticipate" /></p>
          <span className="icon">
            <i className="fas fa-sign-out-alt" />
          </span>
        </button>
      </div>
    );
  }

  if (profile.isLoaded && !profile.isEmpty) {
    return (
      <button className="participatebutton button is-rounded is-primary" onClick={() => participate(eventId, userId, profile.firstName, profile.lastName)}>
        {!eventFull &&
          <p><Translate id="participate" /></p>
        }
        {eventFull &&
          <p><Translate id="participateforwaitlist" /></p>
        }

        <span className="icon">
          <i className="fas fa-sign-in-alt" />
        </span>
      </button>);
  }
  return (<div className="button is-black" disabled><Translate id="signintoparticipate" /></div>);
};

ParticipateButton.propTypes = {
  events: PropTypes.object,
  userId: PropTypes.string,
  profile: PropTypes.object,
  eventId: PropTypes.string,
  participations: PropTypes.object,
};
