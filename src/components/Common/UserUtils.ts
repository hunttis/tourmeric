import _ from 'lodash';
import { User } from '../../models/ReduxState';

export const parseStartingLettersFromUserLastnames = (users: [{ key: string, value: User }]): string[] => {
  const alphabet = _.compact(_.uniq(Object.values(users).map((user) => {
    if (user.value.lastName && !_.isEmpty(user.value.lastName)) {
      return user.value.lastName.substring(0, 1).toUpperCase();
    }
    return null;
  })));
  return alphabet;
};
