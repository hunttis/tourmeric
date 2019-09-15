import { Dispatch } from 'redux';
import { ADMIN_CHOOSE_PARTICIPANT } from './actions';

export function chooseParticipant(dispatch: Dispatch, eventId: string, userUID: string) {
  return dispatch({
    type: ADMIN_CHOOSE_PARTICIPANT,
    payload: { eventId, userUID },
  });
}
