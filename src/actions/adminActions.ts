import { Dispatch } from 'redux';
import { ADMIN_CHOOSE_PARTICIPANT } from './actions';

export function chooseParticipant(eventId: string, userUID: string) {
  return (dispatch: Dispatch) => dispatch({
    type: ADMIN_CHOOSE_PARTICIPANT,
    payload: { eventId, userUID },
  });
}
