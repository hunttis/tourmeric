import { ADMIN_CHOOSE_PARTICIPANT } from './actions';
import { Dispatch } from 'redux';

export function chooseParticipant(eventId: string, userUID: string) {
  return (dispatch: Dispatch) => dispatch({
    type: ADMIN_CHOOSE_PARTICIPANT,
    payload: { eventId, userUID },
  });
}
