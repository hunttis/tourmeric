import { EDITOR_RETURN_LOCATION } from './actions';
import { Dispatch } from 'redux';

export function setReturnLocation(returnLocation: string) {
  return (dispatch: Dispatch) => dispatch({
    type: EDITOR_RETURN_LOCATION,
    payload: { returnLocation },
  });
}
