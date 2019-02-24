import { EDITOR_RETURN_LOCATION } from './actions';

export function setReturnLocation(returnLocation) {
  return async dispatch => dispatch({
    type: EDITOR_RETURN_LOCATION,
    payload: { returnLocation },
  });
}
