import { EDITOR_RETURN_LOCATION } from './actions';

export function setReturnLocation(returnLocation) {
  return dispatch => dispatch({
    type: EDITOR_RETURN_LOCATION,
    payload: { returnLocation },
  });
}
