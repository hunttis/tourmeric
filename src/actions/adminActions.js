import { ADMIN_CHOOSE_PARTICIPANT } from './actions';

export function chooseParticipant(eventId, userUID) {
  return async dispatch => dispatch({
    type: ADMIN_CHOOSE_PARTICIPANT,
    payload: { eventId, userUID },
  });
}
