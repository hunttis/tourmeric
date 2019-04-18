import { EDITOR_RETURN_LOCATION } from './actions';

export function setReturnLocation(returnLocation: string) {
  return {
    type: EDITOR_RETURN_LOCATION,
    payload: { returnLocation },
  };
}
