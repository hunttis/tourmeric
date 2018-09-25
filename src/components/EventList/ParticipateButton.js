import React from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import { participate, checkParticipation, cancelParticipation } from '../../api/eventApi';

export const ParticipateButton = ({
  userId, profile, eventId, participations, waitList,
}) => {
  const alreadyParticipated = checkParticipation(userId, eventId, participations);
  if (alreadyParticipated) {
    return (
      <div>
        <button className="cancelbutton button is-rounded is-danger" onClick={() => cancelParticipation(eventId, userId)}>
          <p><Translate id="cancelparticipate" /></p>
          <span className="icon">
            <i className="fas fa-sign-out-alt" />
          </span>
        </button>
      </div>);
  }

  if (profile.isLoaded && !profile.isEmpty) {
    return (
      <button className="participatebutton button is-rounded is-primary" onClick={() => participate(eventId, userId, profile.firstName, profile.lastName)}>
        {!waitList &&
          <p><Translate id="participate" /></p>
        }
        {waitList &&
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
  userId: PropTypes.string,
  profile: PropTypes.object,
  eventId: PropTypes.string,
  participations: PropTypes.object,
  waitList: PropTypes.bool,
};
