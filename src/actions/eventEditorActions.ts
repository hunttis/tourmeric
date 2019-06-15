import { Dispatch } from 'redux';
import { EDITOR_RETURN_LOCATION } from './actions';

export function setReturnLocation(returnLocation: string) {
  return (dispatch: Dispatch) => dispatch({
    type: EDITOR_RETURN_LOCATION,
    payload: { returnLocation },
  });
}
