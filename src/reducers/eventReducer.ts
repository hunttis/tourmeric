import { ADMIN_CHOOSE_PARTICIPANT } from '../actions/actions';

const initialState = {};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case ADMIN_CHOOSE_PARTICIPANT:
      return { ...state, [action.payload.eventId]: action.payload.userUID };
    default:
      return state;
  }
};
