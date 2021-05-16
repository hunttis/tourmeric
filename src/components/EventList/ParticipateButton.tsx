import React from 'react';
import { FormattedMessage } from "react-intl";
import _ from 'lodash';
import { History } from 'history';
import { Dispatch, AnyAction } from 'redux';
import { participantCount, participate, checkParticipation, cancelParticipation } from '../../api/eventApi';
import { FirebaseProfile, Participation } from '../../models/ReduxState';
import { TourmericEvent } from '../../models/Events';

interface Props {
  events: { [key: string]: TourmericEvent };
  userId: string;
  profile: FirebaseProfile;
  eventId: string;
  participations: { [key: string]: Participation };
  history: History;
  dispatch: Dispatch;
  setReturnLocation: (returnLocation: string) => AnyAction;
}

export const ParticipateButton = ({
  profile, events, eventId, participations, userId, history, setReturnLocation, dispatch,
}: Props) => {

  const alreadyParticipated = checkParticipation(userId, eventId, participations);
  const eventContent = _.get(events, eventId, {});
  const maxParticipants = _.get(eventContent, 'playerSlots', 0);
  const currentParticipants = participantCount(eventId, participations);
  const eventFull = Boolean(maxParticipants && maxParticipants <= currentParticipants);

  if (alreadyParticipated) {
    return (
      <div>
        <button className="cancelbutton button is-rounded is-danger" onClick={() => cancelParticipation(eventId, userId)}>
          <p><FormattedMessage id="cancelparticipate" /></p>
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
          <p><FormattedMessage id="participate" /></p>
        }
        {eventFull &&
          <p><FormattedMessage id="participateforwaitlist" /></p>
        }

        <span className="icon">
          <i className="fas fa-sign-in-alt" />
        </span>
      </button>);
  }
  return (
    <button
      className="button is-black"
      onClick={async () => {
        await dispatch(setReturnLocation(history.location.pathname));
        history.push('/login');
      }}
    >
      <FormattedMessage id="signintoparticipate" />
    </button>);
};
