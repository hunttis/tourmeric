import { EDITOR_RETURN_LOCATION } from '../actions/actions';

const initialState = {};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case EDITOR_RETURN_LOCATION:
      return { ...state, returnLocation: action.payload.returnLocation };
    default:
      return state;
  }
};
